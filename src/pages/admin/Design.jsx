import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

const TABLE = "design_images";
const BUCKET = "design";
const PAGE_SIZE = 12;
const MAX_FILE_MB = 15;
const MAX_WIDTH = 1800;
const WEBP_QUALITY = 0.86;

const makeId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `project-${Date.now()}-${Math.random().toString(36).slice(2)}`);

/* Number ho to "PKR 15,000", text ho to jaisa likha hai waisa hi (public page jaisa) */
const formatPrice = (price) => {
  if (price === null || price === undefined) return "";
  const text = String(price).trim();
  if (!text) return "";
  const numeric = Number(text.replace(/,/g, ""));
  if (Number.isFinite(numeric)) return numeric > 0 ? `PKR ${numeric.toLocaleString("en-PK")}` : "";
  return text;
};

const toWebp = (file) => new Promise((resolve) => {
  if (!file.type.startsWith("image/") || ["image/gif", "image/svg+xml"].includes(file.type)) return resolve(file);
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, MAX_WIDTH / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      URL.revokeObjectURL(url);
      if (!blob) return resolve(file);
      const base = file.name.replace(/\.[^.]+$/, "") || "image";
      resolve(new File([blob], `${base}.webp`, { type: "image/webp" }));
    }, "image/webp", WEBP_QUALITY);
  };
  img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
  img.src = url;
});

const isValidImage = (file) => file.type.startsWith("image/") && file.size <= MAX_FILE_MB * 1024 * 1024;

const uploadToStorage = async (file) => {
  const processed = await toWebp(file);
  const ext = processed.type === "image/webp" ? "webp" : (processed.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, processed, { cacheControl: "31536000", contentType: processed.type || undefined, upsert: false });
  if (error) throw error;
  return { path, url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
};

export default function AdminDesign() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [delivery, setDelivery] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [addingTo, setAddingTo] = useState(null);
  const [editing, setEditing] = useState(null); // { project, title, description, price, delivery }
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  const createInputRef = useRef(null);
  const addInputRef = useRef(null);
  const toastTimer = useRef(null);

  const notify = useCallback((type, message) => {
    setToast({ type, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(TABLE).select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    if (error) {
      console.error(error);
      notify("error", `Images load nahi hui: ${error.message}`);
    } else setRows(data || []);
    setLoading(false);
  }, [notify]);
  useEffect(() => { load(); }, [load]);

  const projects = useMemo(() => {
    const map = new Map();
    rows.forEach((row, index) => {
      const key = row.project_id || `legacy-${row.id}`;
      if (!map.has(key)) map.set(key, {
        id: key, project_id: row.project_id || null,
        title: row.project_title || row.alt || `2D/3D Design ${index + 1}`,
        description: "", price: "", delivery: "",
        rows: [], sort_order: row.sort_order ?? index,
      });
      const p = map.get(key);
      if (!p.description && row.project_description) p.description = row.project_description;
      if (!p.price && row.project_price) p.price = row.project_price;
      if (!p.delivery && row.project_delivery) p.delivery = row.project_delivery;
      p.rows.push(row);
    });
    return [...map.values()].map((p) => ({ ...p, rows: [...p.rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) })).sort((a, b) => a.sort_order - b.sort_order);
  }, [rows]);

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  const pageProjects = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalImages = rows.length;

  const uploadFiles = async (filesInput, project) => {
    const files = Array.from(filesInput || []);
    if (!files.length || busy) return;
    const valid = files.filter(isValidImage);
    const skipped = files.length - valid.length;
    if (!valid.length) {
      notify("error", `Valid image select karein. Har image maximum ${MAX_FILE_MB}MB honi chahiye.`);
      return;
    }
    setBusy(true);
    setProgress({ done: 0, total: valid.length });
    let success = 0;
    let lastError = "";
    let projectId = project?.project_id || null;
    const projectTitle = project?.title || title.trim();
    const projectDescription = project ? (project.description || "") : description.trim();
    const projectPrice = project ? (project.price || "") : price.trim();
    const projectDelivery = project ? (project.delivery || "") : delivery.trim();
    try {
      if (!projectId) {
        projectId = makeId();
        // Purani single image ko project mein convert karte waqt uski details bhi set hoti hain.
        if (project?.rows?.length) {
          const { error } = await supabase.from(TABLE).update({
            project_id: projectId, project_title: projectTitle,
            project_description: projectDescription || null,
            project_price: projectPrice || null,
            project_delivery: projectDelivery || null,
          }).in("id", project.rows.map((r) => r.id));
          if (error) throw error;
        }
      }
      let sort = rows.length ? Math.max(...rows.map((r) => Number(r.sort_order) || 0)) + 1 : 0;
      for (let i = 0; i < valid.length; i += 1) {
        let uploadedPath = null;
        try {
          const { path, url } = await uploadToStorage(valid[i]);
          uploadedPath = path;
          const { error } = await supabase.from(TABLE).insert({
            image_url: url, storage_path: path,
            alt: `${projectTitle} — image ${((project?.rows?.length || 0) + i + 1)}`,
            project_id: projectId, project_title: projectTitle,
            project_description: projectDescription || null,
            project_price: projectPrice || null,
            project_delivery: projectDelivery || null,
            sort_order: sort++,
          });
          if (error) {
            await supabase.storage.from(BUCKET).remove([path]);
            throw error;
          }
          success += 1;
        } catch (err) {
          if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
          lastError = err.message || "Upload failed";
          console.error(err);
        }
        setProgress({ done: i + 1, total: valid.length });
      }
      await load();
      setTitle("");
      setDescription("");
      setPrice("");
      setDelivery("");
      setNewFiles([]);
      setAddingTo(null);
      if (createInputRef.current) createInputRef.current.value = "";
      if (success && !lastError) notify("success", `${success} image(s) add ho gayi.${skipped ? ` ${skipped} invalid file(s) skip hui.` : ""}`);
      else if (success) notify("error", `${success} images add hui; kuch fail: ${lastError}`);
      else notify("error", `Upload fail: ${lastError || "Please try again."}`);
    } catch (err) {
      console.error(err);
      notify("error", `Project save nahi hua: ${err.message}`);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const openEdit = (project) => setEditing({
    project,
    title: project.title || "",
    description: project.description || "",
    price: project.price || "",
    delivery: project.delivery || "",
  });

  const saveDetails = async () => {
    if (!editing) return;
    const nextTitle = editing.title.trim();
    if (!nextTitle) return notify("error", "Project title khali nahi ho sakta.");
    setBusy(true);
    try {
      const ids = editing.project.rows.map((r) => r.id);
      const { error } = await supabase.from(TABLE).update({
        project_title: nextTitle,
        project_description: editing.description.trim() || null,
        project_price: editing.price.trim() || null,
        project_delivery: editing.delivery.trim() || null,
      }).in("id", ids);
      if (error) throw error;
      await load();
      setEditing(null);
      notify("success", "Project details update ho gayi.");
    } catch (err) {
      notify("error", `Update nahi hua: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const deleteImage = async (row) => {
    if (!window.confirm("Kya aap ye image delete karna chahte hain?")) return;
    setBusy(true);
    try {
      const { error } = await supabase.from(TABLE).delete().eq("id", row.id);
      if (error) throw error;
      if (row.storage_path) await supabase.storage.from(BUCKET).remove([row.storage_path]);
      await load();
      notify("success", "Image delete ho gayi.");
    } catch (err) { notify("error", `Delete nahi hui: ${err.message}`); }
    finally { setBusy(false); }
  };

  const replaceImage = async (row, file) => {
    if (!file) return;
    if (!isValidImage(file)) return notify("error", `Image ${MAX_FILE_MB}MB se chhoti honi chahiye.`);
    setBusy(true);
    let path;
    try {
      const uploaded = await uploadToStorage(file);
      path = uploaded.path;
      const { error } = await supabase.from(TABLE).update({ image_url: uploaded.url, storage_path: uploaded.path }).eq("id", row.id);
      if (error) throw error;
      if (row.storage_path) await supabase.storage.from(BUCKET).remove([row.storage_path]);
      await load();
      notify("success", "Image replace ho gayi.");
    } catch (err) {
      if (path) await supabase.storage.from(BUCKET).remove([path]);
      notify("error", `Replace nahi hui: ${err.message}`);
    } finally { setBusy(false); }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`"${project.title}" aur iski ${project.rows.length} image(s) delete karni hain? Ye action undo nahi hoga.`)) return;
    setBusy(true);
    try {
      const ids = project.rows.map((r) => r.id);
      const paths = project.rows.map((r) => r.storage_path).filter(Boolean);
      const { error } = await supabase.from(TABLE).delete().in("id", ids);
      if (error) throw error;
      if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
      await load();
      notify("success", "Project delete ho gaya.");
    } catch (err) { notify("error", `Project delete nahi hua: ${err.message}`); }
    finally { setBusy(false); }
  };

  return (
    <div className="adg-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        .adg-page,.adg-page *{box-sizing:border-box;font-family:'Montserrat',system-ui,-apple-system,'Segoe UI',sans-serif}
        .adg-page{--accent:#c0652b;--ink:#191919;--muted:#737373;--line:#e7e5e4;min-height:100vh;padding:24px 16px 64px;background:#f7f7f5;color:var(--ink);-webkit-font-smoothing:antialiased}
        .adg-page button,.adg-page input,.adg-page textarea{font-family:inherit}
        @media(min-width:768px){.adg-page{padding:38px 36px 80px}}
        .adg-header{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:24px}.adg-eyebrow{margin:0;color:#999;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase}.adg-title{margin:8px 0 0;font-size:clamp(25px,4vw,34px);font-weight:700;letter-spacing:-.03em}.adg-sub{max-width:650px;margin:8px 0 0;color:var(--muted);font-size:13px;line-height:1.7}.adg-stats{display:flex;gap:8px;flex-wrap:wrap}.adg-stat{padding:10px 14px;border:1px solid var(--line);border-radius:9px;background:#fff;font-size:12px}.adg-stat strong{font-size:15px;margin-right:4px}
        .adg-create{padding:18px;border:1px solid var(--line);border-radius:14px;background:#fff;box-shadow:0 8px 25px #00000004}.adg-section-title{margin:0 0 14px;font-size:14px;font-weight:700}
        .adg-form{display:grid;grid-template-columns:1fr;gap:12px}@media(min-width:760px){.adg-form{grid-template-columns:repeat(3,1fr)}}
        .adg-span2{grid-column:1/-1}
        .adg-field label{display:block;margin-bottom:7px;font-size:11px;font-weight:700;color:#525252}
        .adg-field input[type=text],.adg-field textarea{width:100%;min-height:42px;padding:10px 12px;border:1px solid #d6d3d1;border-radius:8px;background:#fff;color:#171717;font-size:13px;outline:none}
        .adg-field textarea{min-height:96px;resize:vertical;line-height:1.6}
        .adg-field input:focus,.adg-field textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px #c0652b18}
        .adg-filebox{display:flex;align-items:center;min-height:42px;padding:8px 10px;border:1px dashed #c7c3bf;border-radius:8px;color:#666;font-size:12px;cursor:pointer}.adg-filebox:hover{border-color:var(--accent);background:#fffaf6}
        .adg-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:36px;padding:0 12px;border:1px solid #dedbd7;border-radius:7px;background:#fff;color:#242424;font-size:11px;font-weight:700;cursor:pointer;transition:.2s}.adg-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}.adg-btn:disabled{opacity:.42;cursor:not-allowed}.adg-primary{border-color:#191919;background:#191919;color:#fff}.adg-primary:hover:not(:disabled){border-color:var(--accent);background:var(--accent);color:#fff}.adg-danger:hover:not(:disabled){border-color:#dc2626;color:#dc2626}.adg-submit{min-height:44px;padding:0 20px}
        .adg-help{margin:12px 0 0;color:#85817c;font-size:11px;line-height:1.6}
        .adg-progress{margin-top:14px;padding:12px;border:1px solid var(--line);border-radius:9px;background:#fff;font-size:12px}.adg-progress-head{display:flex;justify-content:space-between;margin-bottom:8px}.adg-track{height:5px;overflow:hidden;border-radius:99px;background:#eee}.adg-track span{display:block;height:100%;background:var(--accent);transition:width .2s}
        .adg-list-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin:32px 0 14px}.adg-list-head h2{margin:0;font-size:17px;font-weight:700}.adg-list-head p{margin:5px 0 0;color:var(--muted);font-size:12px}
        .adg-grid{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:14px}@media(min-width:600px){.adg-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(min-width:960px){.adg-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(min-width:1350px){.adg-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
        .adg-card{overflow:hidden;border:1px solid var(--line);border-radius:12px;background:#fff}.adg-cover{position:relative;aspect-ratio:4/3;background:#f1efeb}.adg-cover img{width:100%;height:100%;display:block;object-fit:cover}.adg-count{position:absolute;top:10px;left:10px;padding:6px 9px;border-radius:999px;background:#171717d9;color:#fff;font-size:10px;font-weight:700;letter-spacing:.03em}
        .adg-card-body{padding:12px}.adg-card-title{margin:0;overflow-wrap:anywhere;font-size:14px;font-weight:700}
        .adg-card-price{margin:6px 0 0;color:var(--accent);font-size:13px;font-weight:700}
        .adg-card-desc{margin:6px 0 0;color:#666;font-size:12px;line-height:1.55;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
        .adg-card-delivery{margin:6px 0 0;color:#85817c;font-size:11px;overflow-wrap:anywhere}
        .adg-card-meta{margin:8px 0 12px;color:#85817c;font-size:11px}
        .adg-actions{display:flex;flex-wrap:wrap;gap:6px}.adg-actions .adg-btn{flex:1 1 auto}
        .adg-mini-gallery{display:flex;gap:6px;padding:0 12px 12px;overflow-x:auto}.adg-mini-gallery img{width:50px;height:50px;flex:0 0 50px;object-fit:cover;border-radius:5px;background:#f2f2f2}
        .adg-empty{padding:42px 16px;border:1px solid var(--line);border-radius:12px;background:#fff;text-align:center;color:var(--muted);font-size:13px}
        .adg-pagination{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:24px;font-size:12px;color:var(--muted)}
        .adg-toast{position:fixed;right:16px;bottom:16px;z-index:100;max-width:min(92vw,420px);padding:13px 16px;border-radius:9px;color:#fff;font-size:12px;line-height:1.5;box-shadow:0 12px 30px #0003}.adg-toast.success{background:#166534}.adg-toast.error{background:#b91c1c}
        .adg-modal-backdrop{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:16px;background:#0009}.adg-modal{width:min(100%,480px);max-height:92vh;overflow-y:auto;padding:20px;border-radius:14px;background:#fff;box-shadow:0 24px 80px #0004}.adg-modal h3{margin:0 0 14px;font-size:18px;font-weight:700}.adg-modal .adg-field{margin-bottom:12px}.adg-modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}
      `}</style>

      <header className="adg-header">
        <div><p className="adg-eyebrow">Gohar Kitchen / Admin</p><h1 className="adg-title">2D / 3D Design Projects</h1><p className="adg-sub">Har project ke andar multiple images manage karein. Title, description, price aur delivery text yahan se change karein; website par card, preview aur WhatsApp inquiry mein yahi details nazar aayengi.</p></div>
        <div className="adg-stats"><span className="adg-stat"><strong>{projects.length}</strong> projects</span><span className="adg-stat"><strong>{totalImages}</strong> images</span></div>
      </header>

      <section className="adg-create">
        <h2 className="adg-section-title">＋ Create a new design project</h2>
        <div className="adg-form">
          <div className="adg-field"><label htmlFor="adg-project-title">Project name / title</label><input id="adg-project-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Modern Kitchen — 3D Design" /></div>
          <div className="adg-field"><label htmlFor="adg-project-price">Price</label><input id="adg-project-price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 15000 ya Starting from Rs. 10,000" /></div>
          <div className="adg-field"><label htmlFor="adg-project-delivery">Delivery text (optional)</label><input id="adg-project-delivery" type="text" value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="e.g. Delivery All Over Pakistan" /></div>
          <div className="adg-field adg-span2"><label htmlFor="adg-project-desc">Description</label><textarea id="adg-project-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Is design project ke baare mein likhein…" /></div>
          <div className="adg-field adg-span2"><label>Project images (select multiple)</label><label className="adg-filebox" htmlFor="adg-create-files">{newFiles.length ? `${newFiles.length} image(s) selected` : "Choose multiple images…"}</label><input ref={createInputRef} id="adg-create-files" type="file" accept="image/*" multiple hidden onChange={(e) => setNewFiles(Array.from(e.target.files || []))} /></div>
          <div className="adg-span2"><button className="adg-btn adg-primary adg-submit" type="button" disabled={busy || !title.trim() || !newFiles.length} onClick={() => uploadFiles(newFiles, null)}>{busy ? "Please wait…" : "Create project & upload"}</button></div>
        </div>
        <p className="adg-help">Price sirf number likhein (jaise 15000) to website par "PKR 15,000" dikhega; text likhein to wahi dikhega. Multiple images select karne ke liye Ctrl (Windows) press karein. Maximum {MAX_FILE_MB}MB per image. Description, price aur delivery optional hain.</p>
        {progress && <div className="adg-progress"><div className="adg-progress-head"><span>Uploading project images…</span><strong>{progress.done}/{progress.total}</strong></div><div className="adg-track"><span style={{ width: `${Math.round(progress.done / progress.total * 100)}%` }} /></div></div>}
      </section>

      <div className="adg-list-head"><div><h2>Existing projects</h2><p>More images add karein, title / description / price / delivery edit karein, ya individual images manage karein.</p></div><span className="adg-stat">{projects.length} total</span></div>

      {loading ? <div className="adg-empty">Projects load ho rahe hain…</div> : projects.length === 0 ? <div className="adg-empty">Abhi koi project nahi. Upar se pehla project create karein.</div> : <>
        <div className="adg-grid">
          {pageProjects.map((project) => (
            <article className="adg-card" key={project.id}>
              <div className="adg-cover"><img src={project.rows[0]?.image_url} alt={project.title} loading="lazy" /><span className="adg-count">{project.rows.length} {project.rows.length === 1 ? "image" : "images"}</span></div>
              <div className="adg-card-body">
                <h3 className="adg-card-title">{project.title}</h3>
                {formatPrice(project.price) && <p className="adg-card-price">{formatPrice(project.price)}</p>}
                {project.description && <p className="adg-card-desc">{project.description}</p>}
                {project.delivery && <p className="adg-card-delivery">🚚 {project.delivery}</p>}
                <p className="adg-card-meta">Customer ko click par {project.rows.length} image(s) nazar aayengi.</p>
                <div className="adg-actions">
                  <button type="button" className="adg-btn adg-primary" disabled={busy} onClick={() => { setAddingTo(project); addInputRef.current?.click(); }}>＋ Add images</button>
                  <button type="button" className="adg-btn" disabled={busy} onClick={() => openEdit(project)}>Edit details</button>
                  <button type="button" className="adg-btn adg-danger" disabled={busy} onClick={() => deleteProject(project)}>Delete project</button>
                </div>
              </div>
              <div className="adg-mini-gallery">
                {project.rows.map((row) => <div key={row.id} style={{ position: "relative", flex: "0 0 50px" }}>
                  <img src={row.image_url} alt={row.alt || project.title} title="Project image" />
                  <button type="button" title="Delete image" aria-label="Delete image" disabled={busy} onClick={() => deleteImage(row)} style={{ position: "absolute", top: -5, right: -5, width: 19, height: 19, border: 0, borderRadius: "50%", background: "#b91c1c", color: "#fff", cursor: "pointer", fontSize: 12 }}>×</button>
                  <label title="Replace image" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "3px 0", background: "#171717d9", color: "#fff", textAlign: "center", fontSize: 9, cursor: busy ? "not-allowed" : "pointer" }}>Replace<input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => { replaceImage(row, e.target.files?.[0]); e.target.value = ""; }} /></label>
                </div>)}
              </div>
            </article>
          ))}
        </div>
        {totalPages > 1 && <nav className="adg-pagination" aria-label="Project pagination"><button type="button" className="adg-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹ Previous</button><span>Page {page} / {totalPages}</span><button type="button" className="adg-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next ›</button></nav>}
      </>}

      {editing && (
        <div className="adg-modal-backdrop" onClick={() => !busy && setEditing(null)}>
          <div className="adg-modal" role="dialog" aria-modal="true" aria-label="Edit project details" onClick={(e) => e.stopPropagation()}>
            <h3>Edit project details</h3>
            <div className="adg-field"><label htmlFor="adg-edit-title">Title</label><input id="adg-edit-title" type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div className="adg-field"><label htmlFor="adg-edit-price">Price</label><input id="adg-edit-price" type="text" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="e.g. 15000 ya Starting from Rs. 10,000" /></div>
            <div className="adg-field"><label htmlFor="adg-edit-delivery">Delivery text (optional)</label><input id="adg-edit-delivery" type="text" value={editing.delivery} onChange={(e) => setEditing({ ...editing, delivery: e.target.value })} placeholder="e.g. Delivery All Over Pakistan" /></div>
            <div className="adg-field"><label htmlFor="adg-edit-desc">Description</label><textarea id="adg-edit-desc" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Project description…" /></div>
            <div className="adg-modal-actions">
              <button type="button" className="adg-btn" disabled={busy} onClick={() => setEditing(null)}>Cancel</button>
              <button type="button" className="adg-btn adg-primary" disabled={busy || !editing.title.trim()} onClick={saveDetails}>{busy ? "Saving…" : "Save changes"}</button>
            </div>
          </div>
        </div>
      )}

      <input ref={addInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { const files = Array.from(e.target.files || []); e.target.value = ""; if (files.length && addingTo) uploadFiles(files, addingTo); }} />
      {toast && <div className={`adg-toast ${toast.type}`} role="status" aria-live="polite">{toast.message}</div>}
    </div>
  );
}