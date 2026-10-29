import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */

const TABLE = "brand_logos";
const BUCKET = "brand-logos";
const MAX_SIZE_MB = 2;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

const DEFAULT_LOGOS = [
  { name: "NUOMI Pakistan", file: "brand1.webp" },
  { name: "DTC", file: "brand2.webp" },
  { name: "Brand Partner 3", file: "brand3.webp" },
  { name: "Corian Solid Surface", file: "brand4.webp" },
  { name: "Brand Partner 5", file: "brand5.webp" },
  { name: "Brand Partner 6", file: "brand6.webp" },
  { name: "Brand Partner 7", file: "brand7.webp" },
  { name: "Brand Partner 8", file: "brand8.webp" },
];

const localAssets = import.meta.glob("../../assets/*.{webp,png,jpg,jpeg,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const getLocalImage = (filename) => {
  const match = Object.keys(localAssets).find((path) =>
    path.endsWith(`/${filename}`)
  );
  return match ? localAssets[match] : `/assets/${filename}`;
};

const extFromType = (type, fallback = "webp") => {
  if (type === "image/png") return "png";
  if (type === "image/jpeg") return "jpg";
  if (type === "image/svg+xml") return "svg";
  if (type === "image/webp") return "webp";
  return fallback;
};

const makePath = (ext) =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

/* =========================================================
   COMPONENT
========================================================= */

const Brand = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [notice, setNotice] = useState(null); // { type, text }
  const fileRef = useRef(null);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    window.clearTimeout(showNotice.t);
    showNotice.t = window.setTimeout(() => setNotice(null), 4500);
  };

  /* ---------- load ---------- */
  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      showNotice("error", `Load failed: ${error.message}`);
      setItems([]);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  /* ---------- pick file ---------- */
  const onPickFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;

    if (!ACCEPTED.includes(picked.type)) {
      showNotice("error", "Sirf PNG, JPG, WEBP ya SVG image allowed hai.");
      e.target.value = "";
      return;
    }

    if (picked.size > MAX_SIZE_MB * 1024 * 1024) {
      showNotice("error", `Image ${MAX_SIZE_MB}MB se chhoti honi chahiye.`);
      e.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const resetForm = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    setName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ---------- upload helper ---------- */
  const uploadBlob = async (blob, contentType, ext) => {
    const path = makePath(ext);

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType, upsert: false });

    if (upErr) throw upErr;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { path, url: data.publicUrl };
  };

  const nextOrder = () =>
    items.length ? Math.max(...items.map((i) => i.sort_order || 0)) + 1 : 1;

  /* ---------- add ---------- */
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!file) {
      showNotice("error", "Pehle logo image select karein.");
      return;
    }

    setBusy(true);
    try {
      const { path, url } = await uploadBlob(
        file,
        file.type,
        extFromType(file.type)
      );

      const { error } = await supabase.from(TABLE).insert({
        name: name.trim() || "Brand Partner",
        image_url: url,
        storage_path: path,
        sort_order: nextOrder(),
      });

      if (error) throw error;

      resetForm();
      showNotice("success", "Logo add ho gaya.");
      await load();
    } catch (err) {
      showNotice("error", `Add failed: ${err.message || err}`);
    } finally {
      setBusy(false);
    }
  };

  /* ---------- delete ---------- */
  const handleDelete = async (item) => {
    const ok = window.confirm(
      `"${item.name || "Brand"}" logo delete karna hai?`
    );
    if (!ok) return;

    setBusy(true);
    try {
      const { error } = await supabase.from(TABLE).delete().eq("id", item.id);
      if (error) throw error;

      if (item.storage_path) {
        await supabase.storage.from(BUCKET).remove([item.storage_path]);
      }

      showNotice("success", "Logo delete ho gaya.");
      await load();
    } catch (err) {
      showNotice("error", `Delete failed: ${err.message || err}`);
    } finally {
      setBusy(false);
    }
  };

  /* ---------- load default 8 logos ---------- */
  const handleSeedDefaults = async () => {
    const ok = window.confirm(
      "Default 8 logos (brand1 - brand8) database mein add karne hain?"
    );
    if (!ok) return;

    setBusy(true);
    try {
      let order = nextOrder();

      for (const logo of DEFAULT_LOGOS) {
        const res = await fetch(getLocalImage(logo.file));
        if (!res.ok) throw new Error(`${logo.file} load nahi hui`);

        const blob = await res.blob();
        const type = blob.type || "image/webp";
        const { path, url } = await uploadBlob(blob, type, extFromType(type));

        const { error } = await supabase.from(TABLE).insert({
          name: logo.name,
          image_url: url,
          storage_path: path,
          sort_order: order,
        });

        if (error) throw error;
        order += 1;
      }

      showNotice("success", "Default logos add ho gaye.");
      await load();
    } catch (err) {
      showNotice("error", `Default logos failed: ${err.message || err}`);
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <style>{`
        .br-page,
        .br-page * { box-sizing: border-box; font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif; }

        .br-page { --br-accent: #C0652B; --br-ink: #141414; --br-line: rgba(20,20,20,.12); color: var(--br-ink); }

        .br-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px; margin-bottom: 24px; }
        .br-title { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: .03em; text-transform: uppercase; }
        .br-sub { margin: 6px 0 0; color: rgba(20,20,20,.62); font-size: 13px; line-height: 1.7; }

        .br-card { padding: 20px; border: 1px solid var(--br-line); border-radius: 6px; background: #fff; }
        .br-card + .br-card { margin-top: 20px; }
        .br-card-title { margin: 0 0 16px; font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }

        .br-form { display: grid; gap: 16px; grid-template-columns: 1fr; }
        @media (min-width: 768px) { .br-form { grid-template-columns: 1fr 1fr; align-items: start; } }

        .br-field { display: grid; gap: 8px; }
        .br-label { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: rgba(20,20,20,.7); }

        .br-input { width: 100%; height: 46px; padding: 0 14px; border: 1px solid var(--br-line); border-radius: 4px; background: #fff; font-size: 14px; color: var(--br-ink); outline: none; }
        .br-input:focus { border-color: var(--br-accent); }

        .br-drop { display: flex; min-height: 150px; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px; border: 1px dashed rgba(20,20,20,.3); border-radius: 4px; background: #FAF8F5; cursor: pointer; text-align: center; font-size: 12px; color: rgba(20,20,20,.65); transition: border-color .2s ease, background-color .2s ease; }
        .br-drop:hover { border-color: var(--br-accent); background: #FFF6EF; }
        .br-drop img { max-width: 100%; max-height: 110px; object-fit: contain; }
        .br-drop input { display: none; }

        .br-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }

        .br-btn { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; padding: 0 22px; border: 1px solid var(--br-ink); border-radius: 4px; background: var(--br-ink); color: #fff; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; cursor: pointer; transition: background-color .2s ease, border-color .2s ease, color .2s ease; }
        .br-btn:hover:not(:disabled) { background: var(--br-accent); border-color: var(--br-accent); }
        .br-btn:disabled { opacity: .5; cursor: not-allowed; }
        .br-btn-ghost { background: #fff; color: var(--br-ink); }
        .br-btn-ghost:hover:not(:disabled) { background: var(--br-ink); border-color: var(--br-ink); color: #fff; }

        .br-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        @media (min-width: 768px) { .br-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; } }

        .br-item { overflow: hidden; border: 1px solid var(--br-line); border-radius: 6px; background: #fff; }
        .br-item-img { display: flex; height: 110px; align-items: center; justify-content: center; padding: 16px; background: #fff; border-bottom: 1px solid var(--br-line); }
        .br-item-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .br-item-body { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 12px; }
        .br-item-name { min-width: 0; overflow: hidden; font-size: 12px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }

        .br-del { flex: 0 0 auto; padding: 7px 12px; border: 1px solid #C0392B; border-radius: 4px; background: #fff; color: #C0392B; font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background-color .2s ease, color .2s ease; }
        .br-del:hover:not(:disabled) { background: #C0392B; color: #fff; }
        .br-del:disabled { opacity: .5; cursor: not-allowed; }

        .br-empty { padding: 28px 8px; text-align: center; color: rgba(20,20,20,.6); font-size: 13px; line-height: 1.8; }

        .br-notice { margin-bottom: 16px; padding: 12px 14px; border-radius: 4px; font-size: 13px; }
        .br-notice-success { background: #EAF6EE; color: #1E6B3A; border: 1px solid #BFE3CC; }
        .br-notice-error { background: #FBEDEB; color: #A12A1E; border: 1px solid #F0C4BE; }
      `}</style>

      <div className="br-page">
        <div className="br-head">
          <div>
            <h1 className="br-title">Brand Partners</h1>
            <p className="br-sub">
              Home page ke "Our Brand Partners" section ke logos yahan se
              manage karein. Logos apne asli rang mein dikhte hain.
            </p>
          </div>
        </div>

        {notice && (
          <div
            className={`br-notice ${
              notice.type === "error" ? "br-notice-error" : "br-notice-success"
            }`}
            role="status"
          >
            {notice.text}
          </div>
        )}

        {/* ADD NEW */}
        <form className="br-card" onSubmit={handleAdd}>
          <h2 className="br-card-title">Add New Logo</h2>

          <div className="br-form">
            <div className="br-field">
              <label className="br-label" htmlFor="br-name">
                Brand Name
              </label>
              <input
                id="br-name"
                className="br-input"
                type="text"
                placeholder="e.g. NUOMI Pakistan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
              />

              <div className="br-actions">
                <button className="br-btn" type="submit" disabled={busy || !file}>
                  {busy ? "Please wait..." : "Add Logo"}
                </button>
                {file && (
                  <button
                    className="br-btn br-btn-ghost"
                    type="button"
                    onClick={resetForm}
                    disabled={busy}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="br-field">
              <span className="br-label">Logo Image</span>
              <label className="br-drop">
                {preview ? (
                  <img src={preview} alt="Preview" />
                ) : (
                  <>
                    <strong>Click karke logo select karein</strong>
                    <span>PNG, JPG, WEBP, SVG · max {MAX_SIZE_MB}MB</span>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept={ACCEPTED.join(",")}
                  onChange={onPickFile}
                />
              </label>
            </div>
          </div>
        </form>

        {/* CURRENT LOGOS */}
        <div className="br-card">
          <h2 className="br-card-title">
            Current Logos {!loading && `(${items.length})`}
          </h2>

          {loading ? (
            <p className="br-empty">Loading...</p>
          ) : items.length === 0 ? (
            <div className="br-empty">
              <p style={{ margin: 0 }}>
                Abhi database mein koi logo nahi hai, isliye website par
                default 8 logos dikh rahe hain.
              </p>
              <p style={{ margin: "6px 0 16px" }}>
                Default logos ko yahan manage karne ke liye neeche button
                dabayein, phir inhe delete ya naye add kar sakte hain.
              </p>
              <button
                type="button"
                className="br-btn"
                onClick={handleSeedDefaults}
                disabled={busy}
              >
                {busy ? "Please wait..." : "Load Default Logos"}
              </button>
            </div>
          ) : (
            <div className="br-grid">
              {items.map((item) => (
                <div className="br-item" key={item.id}>
                  <div className="br-item-img">
                    <img src={item.image_url} alt={item.name || "Brand logo"} />
                  </div>
                  <div className="br-item-body">
                    <span className="br-item-name" title={item.name}>
                      {item.name || "Brand Partner"}
                    </span>
                    <button
                      type="button"
                      className="br-del"
                      onClick={() => handleDelete(item)}
                      disabled={busy}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Brand;