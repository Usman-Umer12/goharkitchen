// admin/Sheets.jsx  (AdminSheets)
// Supabase table: sheets_images
// Columns: id, image_url, storage_path, title, description, price, delivery_text, status, alt, sort_order, created_at
// Storage bucket: sheets

import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */

const TABLE = "sheets_images";
const BUCKET = "sheets";
const PAGE_SIZE = 24;
const MAX_FILE_MB = 15;
const MAX_WIDTH = 1800;
const WEBP_QUALITY = 0.86;

const DEFAULT_DELIVERY = "Delivery All Over Pakistan";
const MAX_TITLE = 80;
const MAX_DESC = 300;

/* Purani website images (sirf "Import existing images" ke liye) */
const localGroups = [{ prefix: "kitchen", count: 30 }];

const localAssets = import.meta.glob("../../assets/*.{webp,png,jpg,jpeg,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const findLocalUrl = (filename) => {
  const match = Object.keys(localAssets).find((p) => p.endsWith(`/${filename}`));
  return match ? localAssets[match] : null;
};

/* =========================================================
   HELPERS
========================================================= */

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
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);

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

const isValidImage = (file) =>
  file.type.startsWith("image/") && file.size <= MAX_FILE_MB * 1024 * 1024;

const formatPrice = (price) => {
  const value = Number(price);
  return Number.isFinite(value) && value > 0
    ? `PKR ${value.toLocaleString("en-PK")}`
    : "Price on request";
};

/* =========================================================
   COMPONENT
========================================================= */

const AdminSheets = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null); // {done,total,label}
  const [busyId, setBusyId] = useState(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  /* edit modal */
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    delivery_text: DEFAULT_DELIVERY,
    status: "active",
  });
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);

  const locked = Boolean(progress) || Boolean(busyId) || saving;

  const notify = useCallback((type, text) => {
    setToast({ type, text });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      notify("error", `Images load nahi hui: ${error.message}`);
      setLoading(false);
      return;
    }

    setRows(data || []);
    setLoading(false);
  }, [notify]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageStart = (page - 1) * PAGE_SIZE;
  const pageRows = rows.slice(pageStart, pageStart + PAGE_SIZE);

  const nextSortOrder = rows.length
    ? Math.max(...rows.map((r) => r.sort_order || 0)) + 1
    : 0;

  /* ---------- EDIT DETAILS (title / description / price / delivery) ---------- */

  const openEdit = (row) => {
    if (locked) return;
    setEditRow(row);
    setForm({
      title: row.title || "",
      description: row.description || "",
      price:
        row.price === null || row.price === undefined || Number(row.price) === 0
          ? ""
          : String(row.price),
      delivery_text: row.delivery_text || DEFAULT_DELIVERY,
      status: row.status || "active",
    });
  };

  const closeEdit = () => {
    if (saving) return;
    setEditRow(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!editRow || saving) return;

    const priceNumber = form.price === "" ? 0 : Number(form.price);

    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      notify("error", "Price sahi number hona chahiye (0 ya us se zyada).");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim() || null,
        description: form.description.trim() || null,
        price: priceNumber,
        delivery_text: form.delivery_text.trim() || DEFAULT_DELIVERY,
        status: form.status,
      };

      const { error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", editRow.id);

      if (error) throw error;

      setRows((prev) =>
        prev.map((r) => (r.id === editRow.id ? { ...r, ...payload } : r))
      );

      setEditRow(null);
      notify("success", "Details save ho gayi. Website par update nazar aayega.");
    } catch (err) {
      console.error(err);
      notify("error", `Save nahi hua: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  /* Escape se modal band */
  useEffect(() => {
    if (!editRow) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape" && !saving) setEditRow(null);
    };

    const previousOverflow = document.body.style.overflow;
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [editRow, saving]);

  /* ---------- ADD NEW IMAGES ---------- */

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length || locked) return;

    const valid = files.filter(isValidImage);
    const skipped = files.length - valid.length;

    if (!valid.length) {
      notify("error", `Sirf image files (max ${MAX_FILE_MB}MB) upload ho sakti hain.`);
      return;
    }

    let sort = nextSortOrder;
    let success = 0;
    let lastError = "";

    setProgress({ done: 0, total: valid.length, label: "Uploading" });

    for (let i = 0; i < valid.length; i += 1) {
      try {
        const processed = await toWebp(valid[i]);
        const { path, url } = await uploadToStorage(processed);

        const { error } = await supabase.from(TABLE).insert({
          image_url: url,
          storage_path: path,
          alt: null,
          title: null,
          description: null,
          price: 0,
          delivery_text: DEFAULT_DELIVERY,
          status: "active",
          sort_order: sort,
        });

        if (error) {
          await supabase.storage.from(BUCKET).remove([path]);
          throw error;
        }

        sort += 1;
        success += 1;
      } catch (err) {
        console.error(err);
        lastError = err.message || "Unknown error";
      }

      setProgress({ done: i + 1, total: valid.length, label: "Uploading" });
    }

    setProgress(null);
    await load();

    if (success && !lastError) {
      notify(
        "success",
        `${success} image(s) add ho gayi. Ab "Edit" se title, description aur price likhein.${
          skipped ? ` ${skipped} skip hui.` : ""
        }`
      );
    } else if (success) {
      notify("error", `${success} add hui, baaki fail: ${lastError}`);
    } else {
      notify("error", `Upload fail: ${lastError}`);
    }
  };

  /* ---------- REPLACE IMAGE ---------- */

  const handleReplace = async (row, file) => {
    if (!file || locked) return;

    if (!isValidImage(file)) {
      notify("error", `Sirf image file (max ${MAX_FILE_MB}MB) select karein.`);
      return;
    }

    setBusyId(row.id);
    let newPath = null;

    try {
      const processed = await toWebp(file);
      const { path, url } = await uploadToStorage(processed);
      newPath = path;

      const { error } = await supabase
        .from(TABLE)
        .update({ image_url: url, storage_path: path })
        .eq("id", row.id);

      if (error) throw error;

      if (row.storage_path) {
        await supabase.storage.from(BUCKET).remove([row.storage_path]);
      }

      await load();
      notify("success", "Image change ho gayi.");
    } catch (err) {
      console.error(err);
      if (newPath) await supabase.storage.from(BUCKET).remove([newPath]);
      notify("error", `Image change nahi hui: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  };

  /* ---------- DELETE ---------- */

  const handleDelete = async (row) => {
    if (locked) return;
    if (!window.confirm("Ye design delete karna hai? Ye wapas nahi aayega.")) return;

    setBusyId(row.id);

    try {
      const { error } = await supabase.from(TABLE).delete().eq("id", row.id);
      if (error) throw error;

      if (row.storage_path) {
        await supabase.storage.from(BUCKET).remove([row.storage_path]);
      }

      await load();
      notify("success", "Design delete ho gaya.");
    } catch (err) {
      console.error(err);
      notify("error", `Delete nahi hua: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  };

  /* ---------- MOVE (ORDER) ---------- */

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
    } catch (err) {
      console.error(err);
      notify("error", `Order change nahi hua: ${err.message}`);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  /* ---------- IMPORT EXISTING WEBSITE IMAGES ---------- */

  const handleImportExisting = async () => {
    if (locked || rows.length) return;

    const list = localGroups.flatMap(({ prefix, count }) =>
      Array.from({ length: count }, (_, i) => ({
        filename: `${prefix}${i + 1}.webp`,
      }))
    );

    if (
      !window.confirm(
        `Website ki ${list.length} purani Sheets images Supabase mein import karni hain?`
      )
    ) {
      return;
    }

    let success = 0;
    let missing = 0;
    let lastError = "";

    setProgress({ done: 0, total: list.length, label: "Importing" });

    for (let i = 0; i < list.length; i += 1) {
      const item = list[i];
      const url = findLocalUrl(item.filename);

      if (!url) {
        missing += 1;
      } else {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`${item.filename} nahi mili`);
          const blob = await res.blob();
          const file = new File([blob], item.filename, {
            type: blob.type || "image/webp",
          });

          const { path, url: publicUrl } = await uploadToStorage(file);

          const { error } = await supabase.from(TABLE).insert({
            image_url: publicUrl,
            storage_path: path,
            alt: `Sheets ${i + 1}`,
            title: `Sheet Design ${i + 1}`,
            description: null,
            price: 0,
            delivery_text: DEFAULT_DELIVERY,
            status: "active",
            sort_order: success,
          });

          if (error) {
            await supabase.storage.from(BUCKET).remove([path]);
            throw error;
          }

          success += 1;
        } catch (err) {
          console.error(err);
          lastError = err.message || "Unknown error";
        }
      }

      setProgress({ done: i + 1, total: list.length, label: "Importing" });
    }

    setProgress(null);
    await load();

    if (lastError) {
      notify("error", `${success} import hui, kuch fail: ${lastError}`);
    } else {
      notify(
        "success",
        `${success} images import ho gayi.${missing ? ` ${missing} file nahi mili.` : ""}`
      );
    }
  };

  /* ---------- DRAG & DROP ---------- */

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const percent = progress
    ? Math.round((progress.done / progress.total) * 100)
    : 0;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="aa-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

        .aa-page, .aa-page * { box-sizing: border-box; }
        .aa-page {
          --aa-ink: #171717;
          --aa-muted: #737373;
          --aa-line: #e5e5e5;
          --aa-accent: #C0652B;
          --aa-danger: #DC2626;
          min-height: 100vh;
          padding: 24px 16px 64px;
          background: #f7f7f5;
          color: var(--aa-ink);
          font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
        }
        .aa-page button, .aa-page input, .aa-page textarea, .aa-page select, .aa-page label {
          font-family: inherit;
        }
        @media (min-width: 768px) { .aa-page { padding: 40px 40px 80px; } }

        .aa-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px; margin-bottom: 24px; }
        .aa-eyebrow { margin: 0; font-size: 11px; font-weight: 600; letter-spacing: .25em; text-transform: uppercase; color: #a1a1aa; }
        .aa-title { margin: 8px 0 0; font-size: 28px; font-weight: 600; letter-spacing: -.01em; }
        .aa-sub { max-width: 560px; margin: 8px 0 0; font-size: 13px; line-height: 1.7; color: var(--aa-muted); }
        .aa-count { padding: 8px 14px; border: 1px solid var(--aa-line); border-radius: 999px; background: #fff; font-size: 12px; font-weight: 600; }

        .aa-drop {
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
          padding: 36px 20px; border: 2px dashed #cfcfcf; border-radius: 12px; background: #fff;
          text-align: center; cursor: pointer; transition: border-color .2s ease, background-color .2s ease;
        }
        .aa-drop:hover, .aa-drop.is-over { border-color: var(--aa-accent); background: rgba(192,101,43,.04); }
        .aa-drop.is-locked { opacity: .6; pointer-events: none; }
        .aa-drop-icon { font-size: 28px; line-height: 1; color: var(--aa-accent); }
        .aa-drop-title { margin: 0; font-size: 14px; font-weight: 600; }
        .aa-drop-text { margin: 0; font-size: 12px; color: var(--aa-muted); }

        .aa-progress { margin-top: 16px; padding: 14px 16px; border: 1px solid var(--aa-line); border-radius: 10px; background: #fff; }
        .aa-progress-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; font-weight: 600; }
        .aa-bar { height: 6px; overflow: hidden; border-radius: 999px; background: #eee; }
        .aa-bar > span { display: block; height: 100%; background: var(--aa-accent); transition: width .25s ease; }

        .aa-import { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; padding: 16px 18px; border: 1px solid rgba(192,101,43,.35); border-radius: 10px; background: rgba(192,101,43,.06); }
        .aa-import p { margin: 0; max-width: 520px; font-size: 13px; line-height: 1.6; }

        .aa-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          min-height: 34px; padding: 0 12px; border: 1px solid var(--aa-line); border-radius: 6px;
          background: #fff; color: var(--aa-ink); font-size: 12px; font-weight: 600; cursor: pointer;
          transition: border-color .2s ease, color .2s ease, background-color .2s ease;
        }
        .aa-btn:hover:not(:disabled):not(.is-disabled) { border-color: var(--aa-accent); color: var(--aa-accent); }
        .aa-btn:disabled, .aa-btn.is-disabled { opacity: .4; cursor: not-allowed; pointer-events: none; }
        .aa-btn-primary { border-color: #171717; background: #171717; color: #fff; }
        .aa-btn-primary:hover:not(:disabled) { border-color: var(--aa-accent); background: var(--aa-accent); color: #fff; }
        .aa-btn-accent { border-color: var(--aa-accent); background: var(--aa-accent); color: #fff; }
        .aa-btn-accent:hover:not(:disabled) { background: #D2743A; border-color: #D2743A; color: #fff; }
        .aa-btn-danger:hover:not(:disabled) { border-color: var(--aa-danger); color: var(--aa-danger); }
        .aa-btn:focus-visible, .aa-drop:focus-visible { outline: 2px solid var(--aa-accent); outline-offset: 2px; }

        .aa-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 24px; }
        @media (min-width: 640px)  { .aa-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; } }
        @media (min-width: 1024px) { .aa-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
        @media (min-width: 1280px) { .aa-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } }

        .aa-card { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--aa-line); border-radius: 10px; background: #fff; }
        .aa-card.is-hidden-item { opacity: .75; }
        .aa-thumb { position: relative; aspect-ratio: 1 / 1; background: #f3f0ec; }
        .aa-thumb img { display: block; width: 100%; height: 100%; object-fit: contain; }
        .aa-badge { position: absolute; top: 8px; left: 8px; min-width: 26px; padding: 3px 8px; border-radius: 999px; background: rgba(0,0,0,.72); color: #fff; font-size: 11px; font-weight: 600; text-align: center; }
        .aa-status { position: absolute; top: 8px; right: 8px; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
        .aa-status.is-active { background: #dcfce7; color: #166534; }
        .aa-status.is-hidden { background: #fee2e2; color: #991b1b; }
        .aa-card-busy { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,.7); }
        .aa-spinner { width: 24px; height: 24px; border: 3px solid #ddd; border-top-color: var(--aa-accent); border-radius: 50%; animation: aa-spin .8s linear infinite; }
        @keyframes aa-spin { to { transform: rotate(360deg); } }

        .aa-info { padding: 10px 10px 2px; }
        .aa-info-title { margin: 0; overflow: hidden; font-size: 12px; font-weight: 700; letter-spacing: .02em; text-transform: uppercase; text-overflow: ellipsis; white-space: nowrap; }
        .aa-info-title.is-empty { color: #a1a1aa; font-weight: 500; text-transform: none; }
        .aa-info-price { margin: 4px 0 0; font-size: 12px; font-weight: 700; color: var(--aa-accent); }
        .aa-info-price.is-empty { color: #a1a1aa; font-weight: 500; }
        .aa-info-meta { margin: 4px 0 0; overflow: hidden; font-size: 11px; color: var(--aa-muted); text-overflow: ellipsis; white-space: nowrap; }

        .aa-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 8px; margin-top: auto; }
        .aa-actions .aa-btn { min-height: 32px; padding: 0 6px; }
        .aa-actions .aa-span-2 { grid-column: span 2; }

        .aa-empty { margin-top: 24px; padding: 40px 20px; border: 1px solid var(--aa-line); border-radius: 10px; background: #fff; text-align: center; font-size: 13px; color: var(--aa-muted); }

        .aa-pagination { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; margin-top: 28px; }
        .aa-pagination span { font-size: 12px; font-weight: 600; color: var(--aa-muted); }

        /* EDIT MODAL */
        .aa-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(0,0,0,.6); backdrop-filter: blur(3px); }
        .aa-modal { width: 100%; max-width: 520px; max-height: 92vh; overflow-y: auto; border-radius: 12px; background: #fff; box-shadow: 0 30px 80px rgba(0,0,0,.35); }
        .aa-modal-head { display: flex; align-items: center; gap: 14px; padding: 18px 20px; border-bottom: 1px solid var(--aa-line); }
        .aa-modal-thumb { width: 56px; height: 56px; flex: 0 0 auto; overflow: hidden; border-radius: 8px; background: #f3f0ec; }
        .aa-modal-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .aa-modal-title { margin: 0; font-size: 16px; font-weight: 700; }
        .aa-modal-sub { margin: 2px 0 0; font-size: 12px; color: var(--aa-muted); }
        .aa-modal-close { margin-left: auto; display: flex; width: 34px; height: 34px; flex: 0 0 auto; align-items: center; justify-content: center; border: 1px solid var(--aa-line); border-radius: 50%; background: #fff; font-size: 14px; cursor: pointer; }
        .aa-modal-close:hover { border-color: var(--aa-accent); color: var(--aa-accent); }
        .aa-form { display: grid; gap: 16px; padding: 20px; }
        .aa-field label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #525252; }
        .aa-field label small { font-size: 10px; font-weight: 500; letter-spacing: 0; text-transform: none; color: #a1a1aa; }
        .aa-input { width: 100%; padding: 11px 12px; border: 1px solid #d4d4d4; border-radius: 8px; background: #fafafa; color: var(--aa-ink); font-size: 14px; outline: none; transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease; }
        .aa-input:focus { border-color: var(--aa-accent); background: #fff; box-shadow: 0 0 0 3px rgba(192,101,43,.15); }
        textarea.aa-input { min-height: 96px; resize: vertical; line-height: 1.6; }
        .aa-hint { margin: 6px 0 0; font-size: 11px; color: var(--aa-muted); }
        .aa-form-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; padding-top: 4px; }
        .aa-form-actions .aa-btn { min-height: 40px; padding: 0 20px; }

        .aa-toast { position: fixed; right: 16px; bottom: 16px; z-index: 200; max-width: min(92vw, 380px); padding: 12px 16px; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 500; line-height: 1.5; box-shadow: 0 12px 30px -10px rgba(0,0,0,.4); }
        .aa-toast.is-success { background: #166534; }
        .aa-toast.is-error { background: #B91C1C; }

        @media (prefers-reduced-motion: reduce) {
          .aa-spinner { animation-duration: 2s; }
          .aa-page * { transition: none !important; }
        }
      `}</style>

      <div className="aa-head">
        <div>
          <p className="aa-eyebrow">Gohar Kitchen / Admin</p>
          <h1 className="aa-title">Sheets Designs</h1>
          <p className="aa-sub">
            Yahan se Sheets page ke designs add, change, delete aur reorder
            karein. Har design ka title, description, price aur delivery text
            "Edit" button se khud badal sakte hain. Changes website par foran
            nazar aate hain.
          </p>
        </div>
        <span className="aa-count">{rows.length} designs</span>
      </div>

      {/* UPLOAD */}
      <div
        className={`aa-drop ${dragOver ? "is-over" : ""} ${locked ? "is-locked" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Upload images"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <span className="aa-drop-icon" aria-hidden="true">＋</span>
        <p className="aa-drop-title">Naye designs add karein</p>
        <p className="aa-drop-text">
          Click karein ya images yahan drag karein (ek saath kayi). Max {MAX_FILE_MB}MB har image.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

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

      {/* IMPORT (sirf jab table khali ho) */}
      {!loading && rows.length === 0 && !progress && (
        <div className="aa-import">
          <p>
            Abhi Supabase mein koi design nahi hai. Website ki purani Sheets
            images ek click mein import kar sakte hain, uske baad unhein yahan
            se manage kar sakte hain.
          </p>
          <button
            type="button"
            className="aa-btn aa-btn-primary"
            onClick={handleImportExisting}
            disabled={locked}
          >
            Import existing images
          </button>
        </div>
      )}

      {/* GRID */}
      {loading ? (
        <div className="aa-empty">Designs load ho rahe hain...</div>
      ) : rows.length === 0 ? (
        <div className="aa-empty">Abhi koi design nahi hai.</div>
      ) : (
        <>
          <div className="aa-grid">
            {pageRows.map((row, i) => {
              const globalIndex = pageStart + i;
              const isBusy = busyId === row.id;
              const isHiddenItem = row.status === "hidden";
              const hasPrice = Number(row.price) > 0;

              return (
                <article
                  className={`aa-card ${isHiddenItem ? "is-hidden-item" : ""}`}
                  key={row.id}
                >
                  <div className="aa-thumb">
                    <img
                      src={row.image_url}
                      alt={row.title || row.alt || `Sheets ${globalIndex + 1}`}
                      loading="lazy"
                    />
                    <span className="aa-badge">{globalIndex + 1}</span>
                    <span
                      className={`aa-status ${isHiddenItem ? "is-hidden" : "is-active"}`}
                    >
                      {isHiddenItem ? "Hidden" : "Live"}
                    </span>
                    {isBusy && (
                      <div className="aa-card-busy" aria-hidden="true">
                        <span className="aa-spinner" />
                      </div>
                    )}
                  </div>

                  <div className="aa-info">
                    <p className={`aa-info-title ${row.title ? "" : "is-empty"}`}>
                      {row.title || "Title nahi likha"}
                    </p>
                    <p className={`aa-info-price ${hasPrice ? "" : "is-empty"}`}>
                      {formatPrice(row.price)}
                    </p>
                    <p className="aa-info-meta">
                      {row.delivery_text || DEFAULT_DELIVERY}
                    </p>
                  </div>

                  <div className="aa-actions">
                    <button
                      type="button"
                      className="aa-btn aa-btn-accent aa-span-2"
                      onClick={() => openEdit(row)}
                      disabled={locked}
                    >
                      Edit Details
                    </button>

                    <button
                      type="button"
                      className="aa-btn"
                      onClick={() => handleMove(globalIndex, -1)}
                      disabled={locked || globalIndex === 0}
                      aria-label="Pehle le jayein"
                      title="Pehle le jayein"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="aa-btn"
                      onClick={() => handleMove(globalIndex, 1)}
                      disabled={locked || globalIndex === rows.length - 1}
                      aria-label="Baad mein le jayein"
                      title="Baad mein le jayein"
                    >
                      →
                    </button>

                    <label className={`aa-btn ${locked ? "is-disabled" : ""}`}>
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={locked}
                        onChange={(e) => {
                          handleReplace(row, e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      className="aa-btn aa-btn-danger"
                      onClick={() => handleDelete(row)}
                      disabled={locked}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav className="aa-pagination" aria-label="Admin pagination">
              <button
                type="button"
                className="aa-btn"
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
                className="aa-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next ›
              </button>
            </nav>
          )}
        </>
      )}

      {/* EDIT DETAILS MODAL */}
      {editRow && (
        <div
          className="aa-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEdit();
          }}
        >
          <div
            className="aa-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="aa-edit-title"
          >
            <div className="aa-modal-head">
              <div className="aa-modal-thumb">
                <img src={editRow.image_url} alt="" />
              </div>
              <div>
                <h2 className="aa-modal-title" id="aa-edit-title">
                  Design Details
                </h2>
                <p className="aa-modal-sub">
                  Ye details website ke card aur preview mein dikhengi.
                </p>
              </div>
              <button
                type="button"
                className="aa-modal-close"
                onClick={closeEdit}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form className="aa-form" onSubmit={handleSaveDetails}>
              <div className="aa-field">
                <label htmlFor="aa-title">
                  Title
                  <small>
                    {form.title.length}/{MAX_TITLE}
                  </small>
                </label>
                <input
                  id="aa-title"
                  name="title"
                  type="text"
                  className="aa-input"
                  maxLength={MAX_TITLE}
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Jaise: Premium Kitchen Sheet"
                />
              </div>

              <div className="aa-field">
                <label htmlFor="aa-description">
                  Description
                  <small>
                    {form.description.length}/{MAX_DESC}
                  </small>
                </label>
                <textarea
                  id="aa-description"
                  name="description"
                  className="aa-input"
                  maxLength={MAX_DESC}
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Design ke baare mein chhoti si detail likhein"
                />
              </div>

              <div className="aa-field">
                <label htmlFor="aa-price">Price (PKR)</label>
                <input
                  id="aa-price"
                  name="price"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  className="aa-input"
                  value={form.price}
                  onChange={handleFormChange}
                  placeholder="Jaise: 25000"
                />
                <p className="aa-hint">
                  Khali ya 0 chhodein to website par price nahi dikhegi (inquiry
                  message mein "Price on request" jayega).
                </p>
              </div>

              <div className="aa-field">
                <label htmlFor="aa-delivery">Delivery Text</label>
                <input
                  id="aa-delivery"
                  name="delivery_text"
                  type="text"
                  className="aa-input"
                  value={form.delivery_text}
                  onChange={handleFormChange}
                  placeholder={DEFAULT_DELIVERY}
                />
              </div>

              <div className="aa-field">
                <label htmlFor="aa-status">Website par dikhana hai?</label>
                <select
                  id="aa-status"
                  name="status"
                  className="aa-input"
                  value={form.status}
                  onChange={handleFormChange}
                >
                  <option value="active">Haan, website par dikhao (Live)</option>
                  <option value="hidden">Nahi, abhi chhupa do (Hidden)</option>
                </select>
              </div>

              <div className="aa-form-actions">
                <button
                  type="button"
                  className="aa-btn"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="aa-btn aa-btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`aa-toast ${toast.type === "success" ? "is-success" : "is-error"}`}
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default AdminSheets;