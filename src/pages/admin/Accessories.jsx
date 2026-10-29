// pages/admin/Accessories.jsx
// Admin panel: Accessories products manage karne ke liye
// Supabase table  : accessories_images
// Supabase bucket : accessories (public)
// Columns: id, image_url, storage_path, title, description, price,
//          delivery_text, status, alt, sort_order, created_at
//
// Features: Add | Edit (image replace optional) | Delete | Active/Inactive |
//           Reorder (← →) | Import existing website images

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
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

const TABLE = "accessories_images";
const BUCKET = "accessories";
const DEFAULT_DELIVERY = "Delivery All Over Pakistan";
const PAGE_SIZE = 24;
const MAX_FILE_MB = 15;
const MAX_WIDTH = 1800;
const WEBP_QUALITY = 0.86;

/* Purani website images (sirf "Import existing images" ke liye) */
const localGroups = [
  { prefix: "ac", count: 9 },
  { prefix: "af", count: 29 },
  { prefix: "ah", count: 17 },
  { prefix: "ak", count: 3 },
  { prefix: "ar", count: 4 },
  { prefix: "as", count: 5 },
  { prefix: "at", count: 3 },
  { prefix: "au", count: 3 },
  { prefix: "aw", count: 10 },
];

const localAssets = import.meta.glob("../../assets/*.{webp,png,jpg,jpeg,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const findLocalUrl = (filename) => {
  const match = Object.keys(localAssets).find((p) => p.endsWith(`/${filename}`));
  return match ? localAssets[match] : null;
};

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

const errorText = (error) =>
  error?.message || error?.error_description || "Something went wrong.";

const isValidImage = (file) =>
  file.type.startsWith("image/") && file.size <= MAX_FILE_MB * 1024 * 1024;

/* Image ko WebP mein convert + resize (fail ho to original file) */
const toWebp = (file) =>
  new Promise((resolve) => {
    if (
      !file.type.startsWith("image/") ||
      file.type === "image/gif" ||
      file.type === "image/svg+xml"
    ) {
      resolve(file);
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.min(1, MAX_WIDTH / img.naturalWidth);
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) {
            resolve(file);
            return;
          }
          const ext = blob.type === "image/webp" ? "webp" : "png";
          const base = file.name.replace(/\.[^.]+$/, "") || "image";
          resolve(new File([blob], `${base}.${ext}`, { type: blob.type }));
        },
        "image/webp",
        WEBP_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });

const uploadToStorage = async (file) => {
  const ext =
    file.type === "image/webp"
      ? "webp"
      : (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
};

const removeFromStorage = async (path) => {
  if (!path) return;
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (error) {
    console.error("Could not remove image from storage:", error);
  }
};

/* =========================================================
   COMPONENT
========================================================= */

export default function AccessoriesAdmin() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editing, setEditing] = useState(null);

  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [progress, setProgress] = useState(null); // {done,total,label}
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);

  const locked = saving || Boolean(progress) || Boolean(busyId);

  const notify = useCallback((type, text) => {
    setToast({ type, text });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ---------- fetch ---------- */
  const fetchRows = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      notify("error", `Load failed: ${errorText(error)}`);
      setRows([]);
    } else {
      setRows(data || []);
    }

    setLoading(false);
  }, [notify]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

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

  /* ---------- pagination ---------- */
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageStart = (page - 1) * PAGE_SIZE;
  const pageRows = rows.slice(pageStart, pageStart + PAGE_SIZE);

  const nextSort = useMemo(
    () =>
      rows.length
        ? rows.reduce((max, r) => Math.max(max, Number(r.sort_order) || 0), 0) + 1
        : 0,
    [rows]
  );

  const activeCount = rows.filter((r) => r.status !== "inactive").length;

  /* ---------- form helpers ---------- */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleFile = (event) => {
    const picked = event.target.files?.[0];
    if (!picked) return;

    if (!isValidImage(picked)) {
      notify("error", `Sirf image file select karein (max ${MAX_FILE_MB} MB).`);
      event.target.value = "";
      return;
    }

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

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------- submit (add / update) ---------- */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (locked) return;

    const title = form.title.trim();
    if (!title) {
      notify("error", "Title zaroori hai.");
      return;
    }

    const priceValue = form.price === "" ? 0 : Number(form.price);
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      notify("error", "Sahi price likhein.");
      return;
    }

    if (!editing && !file) {
      notify("error", "Pehle image select karein.");
      return;
    }

    const sortValue =
      form.sortOrder === ""
        ? editing
          ? Number(editing.sort_order) || 0
          : nextSort
        : Math.max(0, parseInt(form.sortOrder, 10) || 0);

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
    let uploaded = null;

    try {
      if (file) {
        const processed = await toWebp(file);
        uploaded = await uploadToStorage(processed);
      }

      if (editing) {
        const updates = uploaded
          ? { ...payload, image_url: uploaded.url, storage_path: uploaded.path }
          : payload;

        const { error } = await supabase
          .from(TABLE)
          .update(updates)
          .eq("id", editing.id);

        if (error) throw error;

        if (uploaded && editing.storage_path) {
          await removeFromStorage(editing.storage_path);
        }

        notify("success", "Product update ho gaya.");
      } else {
        const { error } = await supabase.from(TABLE).insert([
          { ...payload, image_url: uploaded.url, storage_path: uploaded.path },
        ]);

        if (error) throw error;
        notify("success", "Product add ho gaya.");
      }

      resetForm();
      await fetchRows();
    } catch (error) {
      console.error(error);
      if (uploaded) await removeFromStorage(uploaded.path);
      notify("error", `Save nahi hua: ${errorText(error)}`);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- delete ---------- */
  const handleDelete = async (item) => {
    if (locked) return;
    const ok = window.confirm(
      `"${item.title || "Ye product"}" delete karna hai? Ye wapas nahi aayega.`
    );
    if (!ok) return;

    setBusyId(item.id);

    try {
      const { error } = await supabase.from(TABLE).delete().eq("id", item.id);
      if (error) throw error;

      await removeFromStorage(item.storage_path);
      if (editing?.id === item.id) resetForm();

      await fetchRows();
      notify("success", "Product delete ho gaya.");
    } catch (error) {
      console.error(error);
      notify("error", `Delete nahi hua: ${errorText(error)}`);
    } finally {
      setBusyId(null);
    }
  };

  /* ---------- active / inactive ---------- */
  const toggleStatus = async (item) => {
    if (locked) return;
    const nextStatus = item.status === "inactive" ? "active" : "inactive";

    setBusyId(item.id);

    const { error } = await supabase
      .from(TABLE)
      .update({ status: nextStatus })
      .eq("id", item.id);

    if (error) {
      notify("error", `Update nahi hua: ${errorText(error)}`);
    } else {
      setRows((previous) =>
        previous.map((row) =>
          row.id === item.id ? { ...row, status: nextStatus } : row
        )
      );
    }

    setBusyId(null);
  };

  /* ---------- reorder ---------- */
  const handleMove = async (index, direction) => {
    const target = index + direction;
    if (locked || target < 0 || target >= rows.length) return;

    const reordered = [...rows];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    const changed = reordered
      .map((r, i) => ({ r, i }))
      .filter(({ r, i }) => r.sort_order !== i);

    setBusyId(rows[index].id);

    try {
      const results = await Promise.all(
        changed.map(({ r, i }) =>
          supabase.from(TABLE).update({ sort_order: i }).eq("id", r.id)
        )
      );

      const failed = results.find((res) => res.error);
      if (failed) throw failed.error;

      setRows(reordered.map((r, i) => ({ ...r, sort_order: i })));
    } catch (error) {
      console.error(error);
      notify("error", `Order change nahi hua: ${errorText(error)}`);
      await fetchRows();
    } finally {
      setBusyId(null);
    }
  };

  /* ---------- import existing website images ---------- */
  const handleImportExisting = async () => {
    if (locked || rows.length) return;

    const list = localGroups.flatMap(({ prefix, count }) =>
      Array.from({ length: count }, (_, i) => ({
        filename: `${prefix}${i + 1}.webp`,
      }))
    );

    if (
      !window.confirm(
        `Website ki ${list.length} purani Accessories images import karni hain? Har image ka title baad mein edit kar sakte hain.`
      )
    ) {
      return;
    }

    let success = 0;
    let missing = 0;
    let lastError = "";

    setProgress({ done: 0, total: list.length, label: "Importing" });

    for (let i = 0; i < list.length; i += 1) {
      const url = findLocalUrl(list[i].filename);

      if (!url) {
        missing += 1;
      } else {
        let storagePath = null;
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`${list[i].filename} nahi mili`);
          const blob = await res.blob();
          const imported = new File([blob], list[i].filename, {
            type: blob.type || "image/webp",
          });

          const { path, url: publicUrl } = await uploadToStorage(imported);
          storagePath = path;

          const { error } = await supabase.from(TABLE).insert({
            image_url: publicUrl,
            storage_path: path,
            title: `Accessory ${String(success + 1).padStart(2, "0")}`,
            description: "",
            price: 0,
            delivery_text: DEFAULT_DELIVERY,
            status: "active",
            alt: `Accessory ${success + 1}`,
            sort_order: success,
          });

          if (error) throw error;
          success += 1;
        } catch (error) {
          console.error(error);
          if (storagePath) await removeFromStorage(storagePath);
          lastError = errorText(error);
        }
      }

      setProgress({ done: i + 1, total: list.length, label: "Importing" });
    }

    setProgress(null);
    await fetchRows();

    if (lastError) {
      notify("error", `${success} import hui, kuch fail: ${lastError}`);
    } else {
      notify(
        "success",
        `${success} images import ho gayi.${missing ? ` ${missing} file nahi mili.` : ""}`
      );
    }
  };

  const shownImage = previewUrl || editing?.image_url || "";
  const percent = progress ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <main className="aa-admin">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

        .aa-admin,
        .aa-admin * {
          box-sizing: border-box;
          font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
        }

        .aa-admin {
          --ad-accent: #C0652B;
          --ad-ink: #141414;
          --ad-muted: rgba(20, 20, 20, 0.6);
          --ad-line: rgba(20, 20, 20, 0.14);

          min-height: 100vh;
          padding: 24px 16px 64px;
          background: #F6F4F1;
          color: var(--ad-ink);
        }
        @media (min-width: 640px)  { .aa-admin { padding: 32px 28px 80px; } }
        @media (min-width: 1024px) { .aa-admin { padding: 40px 48px 96px; } }

        .aa-inner { width: 100%; max-width: 1240px; margin: 0 auto; }

        .aa-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
        }

        .aa-title {
          margin: 0;
          font-size: clamp(1.2rem, 4vw, 1.7rem);
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .aa-title span { color: var(--ad-accent); }

        .aa-sub {
          margin: 6px 0 0;
          color: var(--ad-muted);
          font-size: 12.5px;
          line-height: 1.7;
        }

        .aa-head-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }

        .aa-stat {
          padding: 9px 14px;
          border: 1px solid var(--ad-line);
          border-radius: 999px;
          background: #fff;
          font-size: 11.5px;
          font-weight: 600;
        }

        .aa-btn {
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
        .aa-btn:hover:not(:disabled) { background: #D2743A; border-color: #D2743A; }
        .aa-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .aa-btn-ghost { background: #fff; color: var(--ad-ink); border-color: var(--ad-line); }
        .aa-btn-ghost:hover:not(:disabled) { background: #fff; color: var(--ad-accent); border-color: var(--ad-accent); }

        .aa-btn-danger { background: #fff; color: #B42318; border-color: rgba(180, 35, 24, 0.35); }
        .aa-btn-danger:hover:not(:disabled) { background: #B42318; color: #fff; border-color: #B42318; }

        .aa-btn-sm { min-height: 34px; padding: 0 12px; font-size: 10.5px; letter-spacing: 0.06em; }

        .aa-import {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
          padding: 16px 18px;
          border: 1px solid rgba(192, 101, 43, 0.35);
          border-radius: 12px;
          background: rgba(192, 101, 43, 0.06);
        }
        .aa-import p { margin: 0; max-width: 560px; font-size: 12.5px; line-height: 1.7; }

        .aa-progress { margin-bottom: 20px; padding: 14px 16px; border: 1px solid var(--ad-line); border-radius: 12px; background: #fff; }
        .aa-progress-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; font-weight: 600; }
        .aa-bar { height: 6px; overflow: hidden; border-radius: 999px; background: #eee; }
        .aa-bar > span { display: block; height: 100%; background: var(--ad-accent); transition: width 0.25s ease; }

        .aa-layout { display: grid; gap: 24px; }
        @media (min-width: 1024px) {
          .aa-layout { grid-template-columns: 380px minmax(0, 1fr); align-items: start; }
          .aa-form-card { position: sticky; top: 24px; }
        }

        .aa-card {
          border: 1px solid var(--ad-line);
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 1px 2px rgba(20, 20, 20, 0.04);
        }

        .aa-form-card { padding: 20px; }
        @media (min-width: 640px) { .aa-form-card { padding: 24px; } }

        .aa-card-title {
          margin: 0 0 18px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .aa-card-title span { color: var(--ad-accent); }

        .aa-field { margin-bottom: 14px; }
        .aa-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .aa-label {
          display: block;
          margin-bottom: 6px;
          color: var(--ad-muted);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .aa-input,
        .aa-textarea,
        .aa-select {
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
        .aa-textarea { min-height: 96px; resize: vertical; line-height: 1.6; }
        .aa-input:focus,
        .aa-textarea:focus,
        .aa-select:focus {
          border-color: var(--ad-accent);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(192, 101, 43, 0.15);
        }

        .aa-drop {
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
        .aa-drop:hover { border-color: var(--ad-accent); background: #fff; }
        .aa-drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .aa-drop img { display: block; width: 100%; max-height: 260px; object-fit: contain; background: #F0EDE8; }
        .aa-drop-hint { padding: 10px 14px; line-height: 1.6; }

        .aa-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
        .aa-actions .aa-btn { flex: 1 1 auto; }

        .aa-list-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
        .aa-count { color: var(--ad-muted); font-size: 11.5px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }

        .aa-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 520px)  { .aa-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1280px) { .aa-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

        .aa-item { display: flex; flex-direction: column; overflow: hidden; }
        .aa-item.is-editing { border-color: var(--ad-accent); box-shadow: 0 0 0 2px rgba(192, 101, 43, 0.25); }
        .aa-item.is-inactive .aa-thumb img { filter: grayscale(1); opacity: 0.55; }

        .aa-thumb { position: relative; aspect-ratio: 4 / 3; background: #EFEBE6; }
        .aa-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; transition: filter 200ms ease, opacity 200ms ease; }

        .aa-badge {
          position: absolute; top: 10px; left: 10px; padding: 4px 10px; border-radius: 999px;
          background: #1B6B3A; color: #fff; font-size: 9.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
        }
        .aa-badge.is-inactive { background: #6B6B6B; }

        .aa-order {
          position: absolute; top: 10px; right: 10px; min-width: 28px; padding: 4px 9px; border-radius: 999px;
          background: rgba(10, 10, 10, 0.75); color: #fff; font-size: 10px; font-weight: 600; text-align: center;
        }

        .aa-busy { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255, 255, 255, 0.7); }

        .aa-item-body { display: flex; flex: 1; flex-direction: column; gap: 6px; padding: 14px; }
        .aa-item-title { margin: 0; font-size: 12.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; line-height: 1.4; overflow-wrap: anywhere; }
        .aa-item-desc { margin: 0; color: var(--ad-muted); font-size: 12px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .aa-item-price { color: var(--ad-accent); font-size: 13px; font-weight: 700; }
        .aa-item-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; padding-top: 10px; }
        .aa-item-actions .aa-btn { flex: 1 1 auto; }

        .aa-empty { padding: 56px 16px; color: var(--ad-muted); font-size: 13px; text-align: center; }

        .aa-pagination { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; margin-top: 24px; }
        .aa-pagination span { font-size: 12px; font-weight: 600; color: var(--ad-muted); }

        .aa-toast { position: fixed; right: 16px; bottom: 16px; z-index: 100; max-width: min(92vw, 400px); padding: 13px 16px; border-radius: 9px; color: #fff; font-size: 12.5px; font-weight: 500; line-height: 1.5; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25); }
        .aa-toast.is-success { background: #166534; }
        .aa-toast.is-error { background: #B91C1C; }

        .aa-spin { animation: aa-spin 900ms linear infinite; }
        @keyframes aa-spin { to { transform: rotate(360deg); } }

        .aa-admin button:focus-visible,
        .aa-admin input:focus-visible,
        .aa-admin select:focus-visible,
        .aa-admin textarea:focus-visible {
          outline: 2px solid var(--ad-accent);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .aa-admin * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="aa-inner">
        {/* ---------- HEADER ---------- */}
        <div className="aa-head">
          <div>
            <h1 className="aa-title">
              <span>Accessories</span> Admin
            </h1>
            <p className="aa-sub">
              Products add, edit, hide ya delete karein. Title, description,
              price aur delivery text yahan se badlein; changes website par
              foran nazar aate hain.
            </p>
          </div>

          <div className="aa-head-actions">
            <span className="aa-stat">
              {rows.length} total · {activeCount} active
            </span>
            <button
              type="button"
              className="aa-btn aa-btn-ghost"
              onClick={fetchRows}
              disabled={loading || locked}
            >
              <RefreshCw size={15} className={loading ? "aa-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ---------- IMPORT (sirf jab table khali ho) ---------- */}
        {!loading && rows.length === 0 && !progress && (
          <div className="aa-import">
            <p>
              Abhi Supabase mein koi product nahi hai. Website ki purani
              Accessories images ek click mein import kar sakte hain, phir har
              product ka title, description aur price yahan se set karein.
            </p>
            <button
              type="button"
              className="aa-btn"
              onClick={handleImportExisting}
              disabled={locked}
            >
              Import existing images
            </button>
          </div>
        )}

        {progress && (
          <div className="aa-progress" role="status" aria-live="polite">
            <div className="aa-progress-row">
              <span>{progress.label}...</span>
              <span>
                {progress.done} / {progress.total}
              </span>
            </div>
            <div className="aa-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}

        <div className="aa-layout">
          {/* ---------- FORM ---------- */}
          <section className="aa-card aa-form-card" ref={formRef}>
            <h2 className="aa-card-title">
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
              <div className="aa-field">
                <span className="aa-label">
                  Image {editing ? "(optional - replace)" : "*"}
                </span>

                <label className="aa-drop">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                  />

                  {shownImage ? (
                    <img src={shownImage} alt="Selected preview" />
                  ) : (
                    <>
                      <ImagePlus size={26} strokeWidth={1.6} />
                      <span className="aa-drop-hint">
                        Click to choose an image
                        <br />
                        Max {MAX_FILE_MB} MB · WebP mein optimise hoti hai
                      </span>
                    </>
                  )}
                </label>
              </div>

              <div className="aa-field">
                <label className="aa-label" htmlFor="aa-title">
                  Title *
                </label>
                <input
                  id="aa-title"
                  name="title"
                  type="text"
                  className="aa-input"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Soft Close Hinges"
                  maxLength={120}
                />
              </div>

              <div className="aa-field">
                <label className="aa-label" htmlFor="aa-description">
                  Description
                </label>
                <textarea
                  id="aa-description"
                  name="description"
                  className="aa-textarea"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short details about this accessory"
                  maxLength={600}
                />
              </div>

              <div className="aa-row aa-field">
                <div>
                  <label className="aa-label" htmlFor="aa-price">
                    Price (PKR)
                  </label>
                  <input
                    id="aa-price"
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    className="aa-input"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="aa-label" htmlFor="aa-sort">
                    Sort Order
                  </label>
                  <input
                    id="aa-sort"
                    name="sortOrder"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    className="aa-input"
                    value={form.sortOrder}
                    onChange={handleChange}
                    placeholder={String(nextSort)}
                  />
                </div>
              </div>

              <div className="aa-field">
                <label className="aa-label" htmlFor="aa-delivery">
                  Delivery Text
                </label>
                <input
                  id="aa-delivery"
                  name="deliveryText"
                  type="text"
                  className="aa-input"
                  value={form.deliveryText}
                  onChange={handleChange}
                  maxLength={120}
                />
              </div>

              <div className="aa-row aa-field">
                <div>
                  <label className="aa-label" htmlFor="aa-status">
                    Status
                  </label>
                  <select
                    id="aa-status"
                    name="status"
                    className="aa-select"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active (visible)</option>
                    <option value="inactive">Inactive (hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="aa-label" htmlFor="aa-alt">
                    Image Alt Text
                  </label>
                  <input
                    id="aa-alt"
                    name="alt"
                    type="text"
                    className="aa-input"
                    value={form.alt}
                    onChange={handleChange}
                    placeholder="Defaults to title"
                    maxLength={160}
                  />
                </div>
              </div>

              <div className="aa-actions">
                <button type="submit" className="aa-btn" disabled={locked}>
                  {saving ? (
                    <Loader2 size={16} className="aa-spin" />
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
                    className="aa-btn aa-btn-ghost"
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
            <div className="aa-list-head">
              <h2 className="aa-card-title" style={{ margin: 0 }}>
                All <span>Products</span>
              </h2>
              <span className="aa-count">{rows.length} total</span>
            </div>

            {loading ? (
              <div className="aa-card aa-empty">Loading products...</div>
            ) : rows.length === 0 ? (
              <div className="aa-card aa-empty">
                Abhi koi product nahi. Form se pehla product add karein.
              </div>
            ) : (
              <>
                <div className="aa-grid">
                  {pageRows.map((item, i) => {
                    const globalIndex = pageStart + i;
                    const inactive = item.status === "inactive";
                    const busy = busyId === item.id;

                    return (
                      <article
                        key={item.id}
                        className={`aa-card aa-item ${
                          editing?.id === item.id ? "is-editing" : ""
                        } ${inactive ? "is-inactive" : ""}`}
                      >
                        <div className="aa-thumb">
                          <img
                            src={item.image_url}
                            alt={item.alt || item.title || "Accessory"}
                            loading="lazy"
                          />
                          <span className={`aa-badge ${inactive ? "is-inactive" : ""}`}>
                            {inactive ? "Hidden" : "Active"}
                          </span>
                          <span className="aa-order">#{globalIndex + 1}</span>
                          {busy && (
                            <div className="aa-busy" aria-hidden="true">
                              <Loader2 size={22} className="aa-spin" />
                            </div>
                          )}
                        </div>

                        <div className="aa-item-body">
                          <h3 className="aa-item-title">{item.title || "Untitled"}</h3>
                          <p className="aa-item-desc">
                            {item.description || "No description"}
                          </p>
                          <span className="aa-item-price">{formatPrice(item.price)}</span>

                          <div className="aa-item-actions">
                            <button
                              type="button"
                              className="aa-btn aa-btn-ghost aa-btn-sm"
                              onClick={() => startEdit(item)}
                              disabled={locked}
                            >
                              <Pencil size={13} />
                              Edit
                            </button>

                            <button
                              type="button"
                              className="aa-btn aa-btn-ghost aa-btn-sm"
                              onClick={() => toggleStatus(item)}
                              disabled={locked}
                            >
                              {inactive ? "Show" : "Hide"}
                            </button>

                            <button
                              type="button"
                              className="aa-btn aa-btn-ghost aa-btn-sm"
                              onClick={() => handleMove(globalIndex, -1)}
                              disabled={locked || globalIndex === 0}
                              aria-label="Pehle le jayein"
                              title="Pehle le jayein"
                            >
                              <ArrowLeft size={13} />
                            </button>

                            <button
                              type="button"
                              className="aa-btn aa-btn-ghost aa-btn-sm"
                              onClick={() => handleMove(globalIndex, 1)}
                              disabled={locked || globalIndex === rows.length - 1}
                              aria-label="Baad mein le jayein"
                              title="Baad mein le jayein"
                            >
                              <ArrowRight size={13} />
                            </button>

                            <button
                              type="button"
                              className="aa-btn aa-btn-danger aa-btn-sm"
                              onClick={() => handleDelete(item)}
                              disabled={locked}
                              aria-label={`Delete ${item.title || "product"}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <nav className="aa-pagination" aria-label="Admin pagination">
                    <button
                      type="button"
                      className="aa-btn aa-btn-ghost aa-btn-sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      ‹ Prev
                    </button>
                    <span>
                      Page {page} / {totalPages}
                    </span>
                    <button
                      type="button"
                      className="aa-btn aa-btn-ghost aa-btn-sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next ›
                    </button>
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {toast && (
        <div
          className={`aa-toast ${toast.type === "success" ? "is-success" : "is-error"}`}
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      )}
    </main>
  );
}