// admin/Wardrobeaccessories.jsx
// Admin panel: Wardrobe Accessories products manage karne ke liye
// Supabase table  : wardrobe_accessories_images
// Supabase bucket : wardrobe-accessories (public)
// Columns: id, image_url, storage_path, title, description, price,
//          delivery_text, status, alt, sort_order, created_at
//
// Features: Add (image upload) | Edit (image replace optional) |
//           Delete (row + storage image) | Active / Inactive toggle

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */

const TABLE = "wardrobe_accessories_images";
const BUCKET = "wardrobe-accessories";
const DEFAULT_DELIVERY = "Delivery All Over Pakistan";
const MAX_FILE_MB = 5;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const emptyForm = {
  title: "",
  description: "",
  price: "",
  deliveryText: DEFAULT_DELIVERY,
  status: "active",
  alt: "",
  sortOrder: "",
};

/* =========================================================
   HELPERS
========================================================= */

const formatPrice = (price) => {
  const value = Number(price);
  return Number.isFinite(value) && value > 0
    ? `PKR ${value.toLocaleString("en-PK")}`
    : "No price";
};

const getExtension = (file) => {
  const fromName = (file.name.split(".").pop() || "").toLowerCase();
  const safe = fromName.replace(/[^a-z0-9]/g, "");
  if (safe) return safe;

  const fromType = (file.type.split("/")[1] || "jpg").toLowerCase();
  return fromType.replace(/[^a-z0-9]/g, "") || "jpg";
};

const buildStoragePath = (file) =>
  `items/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${getExtension(
    file
  )}`;

const errorText = (error) =>
  error?.message || error?.error_description || "Something went wrong.";

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WardrobeaccessoriesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editing, setEditing] = useState(null); // item being edited

  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text }

  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ---------- next sort order ---------- */
  const nextSort = useMemo(
    () =>
      items.reduce((max, item) => Math.max(max, Number(item.sort_order) || 0), 0) +
      1,
    [items]
  );

  /* ---------- fetch list ---------- */
  const fetchItems = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      setNotice({ type: "error", text: `Load failed: ${errorText(error)}` });
      setItems([]);
    } else {
      setItems(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /* ---------- image preview (object URL) ---------- */
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* ---------- notice auto hide ---------- */
  useEffect(() => {
    if (!notice || notice.type === "error") return undefined;
    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  /* ---------- form helpers ---------- */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleFile = (event) => {
    const picked = event.target.files?.[0];
    if (!picked) return;

    if (!ALLOWED_TYPES.includes(picked.type)) {
      setNotice({
        type: "error",
        text: "Only JPG, PNG, WEBP or AVIF images are allowed.",
      });
      event.target.value = "";
      return;
    }

    if (picked.size > MAX_FILE_MB * 1024 * 1024) {
      setNotice({
        type: "error",
        text: `Image is too large. Maximum size is ${MAX_FILE_MB} MB.`,
      });
      event.target.value = "";
      return;
    }

    setNotice(null);
    setFile(picked);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setEditing(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (item) => {
    setEditing(item);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setForm({
      title: item.title || "",
      description: item.description || "",
      price:
        item.price === null || item.price === undefined || Number(item.price) === 0
          ? ""
          : String(item.price),
      deliveryText: item.delivery_text || DEFAULT_DELIVERY,
      status: item.status || "active",
      alt: item.alt || "",
      sortOrder:
        item.sort_order === null || item.sort_order === undefined
          ? ""
          : String(item.sort_order),
    });
    setNotice(null);

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------- storage helpers ---------- */
  const uploadImage = async (picked) => {
    const path = buildStoragePath(picked);

    const { error } = await supabase.storage.from(BUCKET).upload(path, picked, {
      cacheControl: "3600",
      upsert: false,
      contentType: picked.type,
    });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { path, url: data.publicUrl };
  };

  const removeImage = async (path) => {
    if (!path) return;
    try {
      await supabase.storage.from(BUCKET).remove([path]);
    } catch (error) {
      console.error("Could not remove image from storage:", error);
    }
  };

  /* ---------- submit (add / update) ---------- */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    const title = form.title.trim();
    if (!title) {
      setNotice({ type: "error", text: "Title is required." });
      return;
    }

    const priceValue = form.price === "" ? 0 : Number(form.price);
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      setNotice({ type: "error", text: "Please enter a valid price." });
      return;
    }

    if (!editing && !file) {
      setNotice({ type: "error", text: "Please choose an image." });
      return;
    }

    const sortValue =
      form.sortOrder === "" ? nextSort : Math.max(0, parseInt(form.sortOrder, 10) || 0);

    const payload = {
      title,
      description: form.description.trim(),
      price: priceValue,
      delivery_text: form.deliveryText.trim() || DEFAULT_DELIVERY,
      status: form.status === "inactive" ? "inactive" : "active",
      alt: form.alt.trim() || title,
      sort_order: sortValue,
    };

    setSaving(true);
    setNotice(null);

    let uploaded = null;

    try {
      if (file) uploaded = await uploadImage(file);

      if (editing) {
        const updates = uploaded
          ? { ...payload, image_url: uploaded.url, storage_path: uploaded.path }
          : payload;

        const { error } = await supabase
          .from(TABLE)
          .update(updates)
          .eq("id", editing.id);

        if (error) throw error;

        /* nayi image lagi to purani storage se hata do */
        if (uploaded && editing.storage_path) {
          await removeImage(editing.storage_path);
        }

        setNotice({ type: "success", text: "Product updated successfully." });
      } else {
        const { error } = await supabase.from(TABLE).insert([
          {
            ...payload,
            image_url: uploaded.url,
            storage_path: uploaded.path,
          },
        ]);

        if (error) throw error;

        setNotice({ type: "success", text: "Product added successfully." });
      }

      resetForm();
      await fetchItems();
    } catch (error) {
      /* DB fail hua to upload ki hui image saaf kar do */
      if (uploaded) await removeImage(uploaded.path);
      setNotice({ type: "error", text: `Save failed: ${errorText(error)}` });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- delete ---------- */
  const handleDelete = async (item) => {
    const ok = window.confirm(
      `Delete "${item.title || "this product"}"? This cannot be undone.`
    );
    if (!ok) return;

    setBusyId(item.id);
    setNotice(null);

    const { error } = await supabase.from(TABLE).delete().eq("id", item.id);

    if (error) {
      setNotice({ type: "error", text: `Delete failed: ${errorText(error)}` });
    } else {
      await removeImage(item.storage_path);
      if (editing?.id === item.id) resetForm();
      setItems((previous) => previous.filter((row) => row.id !== item.id));
      setNotice({ type: "success", text: "Product deleted." });
    }

    setBusyId(null);
  };

  /* ---------- active / inactive toggle ---------- */
  const toggleStatus = async (item) => {
    const nextStatus = item.status === "inactive" ? "active" : "inactive";

    setBusyId(item.id);
    setNotice(null);

    const { error } = await supabase
      .from(TABLE)
      .update({ status: nextStatus })
      .eq("id", item.id);

    if (error) {
      setNotice({ type: "error", text: `Update failed: ${errorText(error)}` });
    } else {
      setItems((previous) =>
        previous.map((row) =>
          row.id === item.id ? { ...row, status: nextStatus } : row
        )
      );
    }

    setBusyId(null);
  };

  const shownImage = previewUrl || editing?.image_url || "";

  return (
    <main className="wa-admin">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

        .wa-admin,
        .wa-admin * {
          box-sizing: border-box;
          font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
        }

        .wa-admin {
          --ad-accent: #C0652B;
          --ad-ink: #141414;
          --ad-muted: rgba(20, 20, 20, 0.6);
          --ad-line: rgba(20, 20, 20, 0.14);

          min-height: 100vh;
          padding: 24px 16px 64px;
          background: #F6F4F1;
          color: var(--ad-ink);
        }
        @media (min-width: 640px)  { .wa-admin { padding: 32px 28px 80px; } }
        @media (min-width: 1024px) { .wa-admin { padding: 40px 48px 96px; } }

        .wa-admin-inner { width: 100%; max-width: 1240px; margin: 0 auto; }

        .wa-admin-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
        }

        .wa-admin-title {
          margin: 0;
          font-size: clamp(1.2rem, 4vw, 1.7rem);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .wa-admin-title span { color: var(--ad-accent); }

        .wa-admin-sub {
          margin: 6px 0 0;
          color: var(--ad-muted);
          font-size: 12.5px;
          line-height: 1.7;
        }

        .wa-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 20px;
          border: 1px solid var(--ad-accent);
          border-radius: 999px;
          background: var(--ad-accent);
          color: #fff;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 200ms ease, border-color 200ms ease, opacity 200ms ease;
        }
        .wa-btn:hover:not(:disabled) { background: #D2743A; border-color: #D2743A; }
        .wa-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .wa-btn-ghost {
          background: #fff;
          color: var(--ad-ink);
          border-color: var(--ad-line);
        }
        .wa-btn-ghost:hover:not(:disabled) {
          background: #fff;
          color: var(--ad-accent);
          border-color: var(--ad-accent);
        }

        .wa-btn-danger { background: #fff; color: #B42318; border-color: rgba(180, 35, 24, 0.35); }
        .wa-btn-danger:hover:not(:disabled) { background: #B42318; color: #fff; border-color: #B42318; }

        .wa-btn-sm { min-height: 34px; padding: 0 14px; font-size: 10.5px; }

        .wa-notice {
          margin-bottom: 20px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 12.5px;
          font-weight: 500;
          line-height: 1.6;
        }
        .wa-notice.is-success { background: #E8F5EC; color: #1B6B3A; border: 1px solid #BFE3CB; }
        .wa-notice.is-error   { background: #FDECEA; color: #B42318; border: 1px solid #F5C2BD; }

        .wa-layout { display: grid; gap: 24px; }
        @media (min-width: 1024px) {
          .wa-layout { grid-template-columns: 380px minmax(0, 1fr); align-items: start; }
          .wa-form-card { position: sticky; top: 24px; }
        }

        .wa-card {
          border: 1px solid var(--ad-line);
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 1px 2px rgba(20, 20, 20, 0.04);
        }

        .wa-form-card { padding: 20px; }
        @media (min-width: 640px) { .wa-form-card { padding: 24px; } }

        .wa-card-title {
          margin: 0 0 18px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .wa-card-title span { color: var(--ad-accent); }

        .wa-field { margin-bottom: 14px; }
        .wa-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .wa-label {
          display: block;
          margin-bottom: 6px;
          color: var(--ad-muted);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .wa-input,
        .wa-textarea,
        .wa-select {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid var(--ad-line);
          border-radius: 10px;
          background: #FAFAF9;
          color: var(--ad-ink);
          font-size: 13px;
          outline: none;
          transition: border-color 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
        }
        .wa-textarea { min-height: 96px; resize: vertical; line-height: 1.6; }
        .wa-input:focus,
        .wa-textarea:focus,
        .wa-select:focus {
          border-color: var(--ad-accent);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(192, 101, 43, 0.15);
        }

        .wa-drop {
          position: relative;
          display: flex;
          min-height: 160px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          overflow: hidden;
          border: 1.5px dashed rgba(20, 20, 20, 0.25);
          border-radius: 12px;
          background: #FAFAF9;
          color: var(--ad-muted);
          font-size: 12px;
          text-align: center;
          cursor: pointer;
          transition: border-color 200ms ease, background-color 200ms ease;
        }
        .wa-drop:hover { border-color: var(--ad-accent); background: #fff; }
        .wa-drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .wa-drop img { display: block; width: 100%; max-height: 260px; object-fit: contain; background: #F0EDE8; }
        .wa-drop-hint { padding: 10px 14px; line-height: 1.6; }

        .wa-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
        .wa-actions .wa-btn { flex: 1 1 auto; }

        .wa-list-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .wa-count { color: var(--ad-muted); font-size: 11.5px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }

        .wa-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 520px)  { .wa-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1280px) { .wa-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

        .wa-item { display: flex; flex-direction: column; overflow: hidden; }
        .wa-item.is-editing { border-color: var(--ad-accent); box-shadow: 0 0 0 2px rgba(192, 101, 43, 0.25); }
        .wa-item.is-inactive img { filter: grayscale(1); opacity: 0.55; }

        .wa-thumb { position: relative; aspect-ratio: 4 / 3; background: #EFEBE6; }
        .wa-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; transition: filter 200ms ease, opacity 200ms ease; }

        .wa-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #1B6B3A;
          color: #fff;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .wa-badge.is-inactive { background: #6B6B6B; }

        .wa-order {
          position: absolute;
          top: 10px;
          right: 10px;
          min-width: 28px;
          padding: 4px 9px;
          border-radius: 999px;
          background: rgba(10, 10, 10, 0.75);
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          text-align: center;
        }

        .wa-item-body { display: flex; flex: 1; flex-direction: column; gap: 6px; padding: 14px; }
        .wa-item-title { margin: 0; font-size: 12.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; line-height: 1.4; }
        .wa-item-desc { margin: 0; color: var(--ad-muted); font-size: 12px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .wa-item-price { color: var(--ad-accent); font-size: 13px; font-weight: 700; }
        .wa-item-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; padding-top: 10px; }
        .wa-item-actions .wa-btn { flex: 1 1 auto; }

        .wa-empty { padding: 56px 16px; color: var(--ad-muted); font-size: 13px; text-align: center; }

        .wa-spin { animation: wa-spin 900ms linear infinite; }
        @keyframes wa-spin { to { transform: rotate(360deg); } }

        .wa-admin button:focus-visible,
        .wa-admin input:focus-visible,
        .wa-admin select:focus-visible,
        .wa-admin textarea:focus-visible {
          outline: 2px solid var(--ad-accent);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .wa-admin * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="wa-admin-inner">
        {/* ---------- HEADER ---------- */}
        <div className="wa-admin-head">
          <div>
            <h1 className="wa-admin-title">
              Wardrobe <span>Accessories</span> Admin
            </h1>
            <p className="wa-admin-sub">
              Add, edit or remove wardrobe accessories. Changes appear on the
              website instantly.
            </p>
          </div>

          <button
            type="button"
            className="wa-btn wa-btn-ghost"
            onClick={fetchItems}
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? "wa-spin" : ""} />
            Refresh
          </button>
        </div>

        {notice && (
          <div
            role={notice.type === "error" ? "alert" : "status"}
            className={`wa-notice ${
              notice.type === "error" ? "is-error" : "is-success"
            }`}
          >
            {notice.text}
          </div>
        )}

        <div className="wa-layout">
          {/* ---------- FORM ---------- */}
          <section className="wa-card wa-form-card" ref={formRef}>
            <h2 className="wa-card-title">
              {editing ? (
                <>
                  Edit <span>Product</span>
                </>
              ) : (
                <>
                  Add <span>New Product</span>
                </>
              )}
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="wa-field">
                <span className="wa-label">
                  Image {editing ? "(optional - replace)" : "*"}
                </span>

                <label className="wa-drop">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_TYPES.join(",")}
                    onChange={handleFile}
                  />

                  {shownImage ? (
                    <img src={shownImage} alt="Selected preview" />
                  ) : (
                    <>
                      <ImagePlus size={26} strokeWidth={1.6} />
                      <span className="wa-drop-hint">
                        Click to choose an image
                        <br />
                        JPG, PNG, WEBP or AVIF - max {MAX_FILE_MB} MB
                      </span>
                    </>
                  )}
                </label>
              </div>

              <div className="wa-field">
                <label className="wa-label" htmlFor="wa-title">
                  Title *
                </label>
                <input
                  id="wa-title"
                  name="title"
                  type="text"
                  className="wa-input"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Pull-out Trouser Rack"
                  maxLength={120}
                />
              </div>

              <div className="wa-field">
                <label className="wa-label" htmlFor="wa-description">
                  Description
                </label>
                <textarea
                  id="wa-description"
                  name="description"
                  className="wa-textarea"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short details about this accessory"
                  maxLength={600}
                />
              </div>

              <div className="wa-row wa-field">
                <div>
                  <label className="wa-label" htmlFor="wa-price">
                    Price (PKR)
                  </label>
                  <input
                    id="wa-price"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    className="wa-input"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="wa-label" htmlFor="wa-sort">
                    Sort Order
                  </label>
                  <input
                    id="wa-sort"
                    name="sortOrder"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    className="wa-input"
                    value={form.sortOrder}
                    onChange={handleChange}
                    placeholder={String(nextSort)}
                  />
                </div>
              </div>

              <div className="wa-field">
                <label className="wa-label" htmlFor="wa-delivery">
                  Delivery Text
                </label>
                <input
                  id="wa-delivery"
                  name="deliveryText"
                  type="text"
                  className="wa-input"
                  value={form.deliveryText}
                  onChange={handleChange}
                  maxLength={120}
                />
              </div>

              <div className="wa-row wa-field">
                <div>
                  <label className="wa-label" htmlFor="wa-status">
                    Status
                  </label>
                  <select
                    id="wa-status"
                    name="status"
                    className="wa-select"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active (visible)</option>
                    <option value="inactive">Inactive (hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="wa-label" htmlFor="wa-alt">
                    Image Alt Text
                  </label>
                  <input
                    id="wa-alt"
                    name="alt"
                    type="text"
                    className="wa-input"
                    value={form.alt}
                    onChange={handleChange}
                    placeholder="Defaults to title"
                    maxLength={160}
                  />
                </div>
              </div>

              <div className="wa-actions">
                <button type="submit" className="wa-btn" disabled={saving}>
                  {saving ? (
                    <Loader2 size={16} className="wa-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving
                    ? "Saving..."
                    : editing
                    ? "Update Product"
                    : "Add Product"}
                </button>

                {editing && (
                  <button
                    type="button"
                    className="wa-btn wa-btn-ghost"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* ---------- LIST ---------- */}
          <section>
            <div className="wa-list-head">
              <h2 className="wa-card-title" style={{ margin: 0 }}>
                All <span>Products</span>
              </h2>
              <span className="wa-count">{items.length} total</span>
            </div>

            {loading ? (
              <div className="wa-card wa-empty">Loading products...</div>
            ) : items.length === 0 ? (
              <div className="wa-card wa-empty">
                No products yet. Add your first wardrobe accessory using the
                form.
              </div>
            ) : (
              <div className="wa-grid">
                {items.map((item) => {
                  const inactive = item.status === "inactive";
                  const busy = busyId === item.id;

                  return (
                    <article
                      key={item.id}
                      className={`wa-card wa-item ${
                        editing?.id === item.id ? "is-editing" : ""
                      } ${inactive ? "is-inactive" : ""}`}
                    >
                      <div className="wa-thumb">
                        <img
                          src={item.image_url}
                          alt={item.alt || item.title || "Wardrobe accessory"}
                          loading="lazy"
                        />
                        <span
                          className={`wa-badge ${inactive ? "is-inactive" : ""}`}
                        >
                          {inactive ? "Hidden" : "Active"}
                        </span>
                        <span className="wa-order">#{item.sort_order ?? 0}</span>
                      </div>

                      <div className="wa-item-body">
                        <h3 className="wa-item-title">
                          {item.title || "Untitled"}
                        </h3>
                        <p className="wa-item-desc">
                          {item.description || "No description"}
                        </p>
                        <span className="wa-item-price">
                          {formatPrice(item.price)}
                        </span>

                        <div className="wa-item-actions">
                          <button
                            type="button"
                            className="wa-btn wa-btn-ghost wa-btn-sm"
                            onClick={() => startEdit(item)}
                            disabled={busy}
                          >
                            <Pencil size={13} />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="wa-btn wa-btn-ghost wa-btn-sm"
                            onClick={() => toggleStatus(item)}
                            disabled={busy}
                          >
                            {inactive ? "Show" : "Hide"}
                          </button>

                          <button
                            type="button"
                            className="wa-btn wa-btn-danger wa-btn-sm"
                            onClick={() => handleDelete(item)}
                            disabled={busy}
                            aria-label={`Delete ${item.title || "product"}`}
                          >
                            {busy ? (
                              <Loader2 size={13} className="wa-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}