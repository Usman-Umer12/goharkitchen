  // src/pages/admin/Media.jsx
  import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
  import {
    Search, Plus, Pencil, Trash2, X, Upload, Image as ImageIcon,
    RefreshCw, ExternalLink, CheckCircle2, AlertCircle, Package,
    Eye, Download, Tv, IndianRupee,
  } from "lucide-react";
  import { supabase } from "../../lib/supabase";

  const TABLE = "media_products";
  const BUCKET = "media-products";
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const DELIVERY_DEFAULT = "Delivery All Over Pakistan";

  const titles = [
    "Modern Media Wall", "Luxury Fluted Media Wall", "Marble Finish Media Wall",
    "Classic Wooden Media Wall", "Floating TV Unit Wall", "Contemporary LED Media Wall",
    "Elegant Panel Media Wall", "Minimal Wall-Mount TV Unit", "Premium Glossy Media Wall",
    "Warm Walnut Media Wall",
  ];
  const descriptions = [
    "A statement feature wall with concealed wiring, display shelves and a flawless finish, built to measure for your lounge.",
    "Refined panelling with premium boards and integrated lighting, designed to frame your TV beautifully.",
    "Elegant finishes with practical storage and cable management, made to order in materials and colours of your choice.",
    "Timeless styling with durable construction and thoughtful space for your TV, decor and media devices.",
    "A balanced mix of style and function, crafted with care and installed neatly on site.",
  ];
  // Suggested starting prices in PKR; edit each price in the admin panel as needed.
  const defaultPrices = [95000, 125000, 115000, 90000, 95000, 135000, 105000, 75000, 145000, 110000, 98000, 128000, 118000, 92000, 88000, 138000, 108000, 78000, 148000, 112000, 102000, 132000, 120000, 94000, 89000, 140000, 109000, 80000, 150000, 115000, 105000, 135000, 122000];
  const localAssets = import.meta.glob("../../assets/*.webp", { eager: true, query: "?url", import: "default" });
  const getLocalImage = (filename) => {
    const key = Object.keys(localAssets).find((path) => path.endsWith(`/${filename}`));
    return key ? localAssets[key] : null;
  };
  const emptyForm = {
    title: "", description: "", image_url: "", price: "", delivery_text: DELIVERY_DEFAULT,
    category: "Media Wall", status: "active", sort_order: 1,
  };
  const money = (value) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? `PKR ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(n)}` : "Price on request";
  };

  export default function MediaAdmin() {
    const fileInputRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [message, setMessage] = useState(null);

    const notify = (type, text) => {
      setMessage({ type, text });
      window.setTimeout(() => setMessage(null), 4500);
    };

    const loadProducts = useCallback(async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from(TABLE)
          .select("id, title, description, image_url, price, delivery_text, category, status, sort_order, created_at, updated_at")
          .order("sort_order", { ascending: true }).order("created_at", { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Media products loading error:", error);
        notify("error", error.message || "Could not load media products. Check the media_products table and Supabase policies.");
      } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    const activeCount = products.filter((p) => p.status === "active").length;
    const filteredProducts = useMemo(() => {
      const term = search.trim().toLowerCase();
      return products.filter((p) => {
        const matches = !term || p.title?.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term);
        return matches && (filter === "all" || p.status === filter);
      });
    }, [products, search, filter]);

    const openCreate = () => {
      setEditingProduct(null);
      setForm({ ...emptyForm, sort_order: products.length + 1 });
      setSelectedFile(null); setPreview(""); setModalOpen(true);
    };
    const openEdit = (product) => {
      setEditingProduct(product);
      setForm({ title: product.title || "", description: product.description || "", image_url: product.image_url || "", price: product.price ?? "", delivery_text: product.delivery_text || DELIVERY_DEFAULT, category: product.category || "Media Wall", status: product.status || "active", sort_order: product.sort_order ?? 0 });
      setSelectedFile(null); setPreview(product.image_url || ""); setModalOpen(true);
    };
    const closeModal = () => { if (saving) return; setModalOpen(false); setEditingProduct(null); setSelectedFile(null); setPreview(""); };
    const handleFile = (file) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) { notify("error", "Please select a valid image file."); return; }
      if (file.size > MAX_IMAGE_SIZE) { notify("error", "Image must be 5 MB or smaller. Please compress the image and try again."); return; }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    };
    const uploadImage = async (file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
      const path = `media-walls/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return data.publicUrl;
    };
    const saveProduct = async (event) => {
      event.preventDefault();
      if (!form.title.trim()) { notify("error", "Please enter a product title."); return; }
      if (!form.image_url && !selectedFile && !editingProduct) { notify("error", "Please upload a product image."); return; }
      if (form.price !== "" && (!Number.isFinite(Number(form.price)) || Number(form.price) < 0)) { notify("error", "Enter a valid price."); return; }
      setSaving(true);
      try {
        let imageUrl = form.image_url;
        if (selectedFile) imageUrl = await uploadImage(selectedFile);
        const payload = {
          title: form.title.trim(), description: form.description.trim(), image_url: imageUrl || null,
          price: form.price === "" ? null : Number(form.price), delivery_text: form.delivery_text.trim() || DELIVERY_DEFAULT,
          category: "Media Wall", status: form.status, sort_order: Number(form.sort_order) || 0, updated_at: new Date().toISOString(),
        };
        const result = editingProduct
          ? await supabase.from(TABLE).update(payload).eq("id", editingProduct.id).select().single()
          : await supabase.from(TABLE).insert({ ...payload, created_at: new Date().toISOString() }).select().single();
        if (result.error) throw result.error;
        notify("success", editingProduct ? "Media wall design updated." : "Media wall design added.");
        setModalOpen(false); setEditingProduct(null); setSelectedFile(null); setPreview("");
        await loadProducts();
      } catch (error) {
        console.error("Saving media product failed:", error);
        notify("error", error.message || "Could not save the product. Check Supabase table and storage permissions.");
      } finally { setSaving(false); }
    };
    const deleteProduct = async (product) => {
      if (!window.confirm(`Delete “${product.title}”? This cannot be undone.`)) return;
      try {
        const { error } = await supabase.from(TABLE).delete().eq("id", product.id);
        if (error) throw error;
        setProducts((old) => old.filter((p) => p.id !== product.id));
        notify("success", "Media wall design deleted.");
      } catch (error) { notify("error", error.message || "Could not delete this design."); }
    };
    const toggleStatus = async (product) => {
      const next = product.status === "active" ? "inactive" : "active";
      try {
        const { error } = await supabase.from(TABLE).update({ status: next, updated_at: new Date().toISOString() }).eq("id", product.id);
        if (error) throw error;
        setProducts((old) => old.map((p) => p.id === product.id ? { ...p, status: next } : p));
        notify("success", `Design is now ${next}.`);
      } catch (error) { notify("error", error.message || "Could not update status."); }
    };
    const importDesigns = async () => {
      if (!window.confirm("Import the 33 local media wall designs (media1.webp to media33.webp) into Supabase? Existing designs with the same sort order will be skipped. The suggested prices are starting prices and can be edited anytime.")) return;
      setImporting(true); setImportProgress("Preparing designs…");
      let imported = 0, skipped = 0, failed = 0;
      const importErrors = [];
      try {
        const { data: existing, error: existingError } = await supabase.from(TABLE).select("id, title, sort_order");
        if (existingError) throw existingError;
        const existingOrders = new Set((existing || []).map((p) => Number(p.sort_order)));
        for (let i = 1; i <= 33; i++) {
          const order = i;
          if (existingOrders.has(order)) { skipped++; setImportProgress(`Design ${i}/33 — already exists`); continue; }
          setImportProgress(`Importing design ${i}/33…`);
          try {
            const image = getLocalImage(`media${i}.webp`);
            if (!image) { failed++; importErrors.push(`media${i}.webp not found in src/assets`); continue; }
            const response = await fetch(image);
            const blob = await response.blob();
            const ext = blob.type.includes("png") ? "png" : blob.type.includes("jpeg") ? "jpg" : "webp";
            const path = `media-walls/media${i}-${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, blob, { upsert: false, contentType: blob.type || "image/webp", cacheControl: "3600" });
            if (uploadError) throw uploadError;
            const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
            const payload = {
              title: titles[(i - 1) % titles.length], description: descriptions[(i - 1) % descriptions.length],
              image_url: publicData.publicUrl, price: defaultPrices[i - 1], delivery_text: DELIVERY_DEFAULT,
              category: "Media Wall", status: "active", sort_order: i,
            };
            const { error: insertError } = await supabase.from(TABLE).insert(payload);
            if (insertError) throw insertError;
            imported++; existingOrders.add(order);
          } catch (error) { console.error(`Media Wall import failed for design ${i}:`, error); failed++; importErrors.push(`Design ${i}: ${error?.message || "Unknown error"}`); }
        }
        await loadProducts();
        const detail = importErrors.length ? ` First error: ${importErrors[0]}` : "";
        notify(failed ? "error" : "success", `Import complete: ${imported} added, ${skipped} skipped, ${failed} failed.${detail}`);
      } catch (error) {
        console.error("Media Wall import failed:", error);
        notify("error", error.message || "Import failed. Create the table and bucket first.");
      } finally { setImporting(false); setImportProgress(""); }
    };
    const exportCsv = () => {
      const rows = [["Title", "Description", "Price PKR", "Delivery", "Status", "Order", "Image URL"], ...filteredProducts.map((p) => [p.title, p.description, p.price ?? "", p.delivery_text, p.status, p.sort_order, p.image_url])];
      const csv = rows.map((row) => row.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
      const a = document.createElement("a"); a.href = url; a.download = "gohar-media-products.csv"; a.click(); URL.revokeObjectURL(url);
    };

    const inputClass = "mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
    return (
      <div className="min-h-screen bg-[#f7f7f5] p-4 text-neutral-900 sm:p-6 lg:p-8">
        {message && <div className={`fixed right-4 top-4 z-[200] flex max-w-[calc(100%-2rem)] items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-xl ${message.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}><span className="mt-0.5">{message.type === "error" ? <AlertCircle size={17}/> : <CheckCircle2 size={17}/>}</span><span>{message.text}</span><button onClick={() => setMessage(null)} aria-label="Dismiss message"><X size={16}/></button></div>}
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">Gohar Media Wall / Admin</p><h1 className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl"><Tv className="text-orange-600"/> Media Wall Management</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">Manage media designs, photos, descriptions, editable PKR prices and website visibility.</p></div>
            <div className="flex flex-wrap gap-2"><button onClick={importDesigns} disabled={importing || loading} className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"><Download size={16}/>{importing ? "Importing…" : "Import 33 Designs"}</button><button onClick={exportCsv} disabled={!products.length} className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"><Download size={16}/>Export CSV</button><button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"><Plus size={17}/>Add Media Wall</button></div>
          </div>
          {importProgress && <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">{importProgress}</div>}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Total designs" value={products.length} icon={<Package size={19}/>} />
            <Stat label="Active on website" value={activeCount} icon={<Eye size={19}/>} />
            <Stat label="Inactive designs" value={products.length-activeCount} icon={<AlertCircle size={19}/>} />
            <Stat label="Prices configured" value={products.filter((p) => p.price !== null && p.price !== "" && Number(p.price) > 0).length} icon={<IndianRupee size={19}/>} />
          </div>
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by design name or description…" className="w-full rounded-xl border border-neutral-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500"/></div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
            <button onClick={loadProducts} className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm hover:bg-neutral-50"><RefreshCw size={15}/>Refresh</button>
          </div>
          {loading ? <div className="rounded-2xl border border-neutral-200 bg-white p-16 text-center text-sm text-neutral-500"><RefreshCw className="mx-auto mb-3 animate-spin"/>Loading media wall products…</div> : products.length === 0 ? <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-5 py-14 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-700"><Tv size={25}/></div><h2 className="mt-4 text-lg font-semibold">No media wall designs in Supabase yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">Import the 33 local media images, or add a design manually. After importing, active designs will appear on the public media page.</p><button onClick={importDesigns} disabled={importing} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"><Download size={16}/>Import 33 Designs</button></div> : filteredProducts.length === 0 ? <div className="rounded-2xl bg-white p-12 text-center text-sm text-neutral-500">No products match your search.</div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{filteredProducts.map((p) => <article key={p.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"><div className="relative aspect-[4/3] bg-neutral-100">{p.image_url ? <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" loading="lazy"/> : <div className="flex h-full items-center justify-center text-neutral-400"><ImageIcon size={35}/></div>}<span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${p.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-700"}`}>{p.status}</span><span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">Design {String(p.sort_order || 0).padStart(2,"0")}</span></div><div className="p-4"><h3 className="line-clamp-1 font-semibold">{p.title}</h3><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-neutral-500">{p.description || "No description added."}</p><p className="mt-3 text-base font-semibold text-orange-700">{money(p.price)}</p><p className="mt-1 text-xs text-neutral-500">{p.delivery_text || DELIVERY_DEFAULT}</p><div className="mt-4 flex gap-2 border-t border-neutral-100 pt-3"><button onClick={() => openEdit(p)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-50"><Pencil size={14}/>Edit</button><button onClick={() => toggleStatus(p)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50">{p.status === "active" ? "Hide" : "Publish"}</button><button onClick={() => deleteProduct(p)} aria-label={`Delete ${p.title}`} className="rounded-lg border border-red-100 px-3 py-2 text-red-600 hover:bg-red-50"><Trash2 size={15}/></button></div></div></article>)}</div>}
          {!loading && products.length > 0 && <p className="mt-5 text-center text-xs text-neutral-500">Showing {filteredProducts.length} of {products.length} media designs</p>}
        </div>
        {modalOpen && <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}><div className="max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4 sm:px-7"><div><h2 className="text-lg font-semibold">{editingProduct ? "Edit media design" : "Add media design"}</h2><p className="mt-1 text-xs text-neutral-500">Changes sync to the public media page.</p></div><button onClick={closeModal} disabled={saving} className="rounded-full p-2 hover:bg-neutral-100"><X size={19}/></button></div><form onSubmit={saveProduct} className="grid gap-5 p-5 sm:grid-cols-[1fr_240px] sm:p-7"><div className="space-y-4"><Field label="Design title *"><input required value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} className={inputClass} placeholder="e.g. Modern Modular Media Wall"/></Field><Field label="Description"><textarea rows={4} value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} className={inputClass} placeholder="Describe the design, materials and features…"/></Field><Field label="Price in PKR"><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500">PKR</span><input type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({...form,price:e.target.value})} className={`${inputClass} pl-12`} placeholder="95000"/></div><p className="mt-1 text-xs text-neutral-500">This price is shown below the description on the website. Leave blank to show “Price on request”.</p></Field><Field label="Delivery text"><input value={form.delivery_text} onChange={(e) => setForm({...form,delivery_text:e.target.value})} className={inputClass}/></Field><div className="grid grid-cols-2 gap-3"><Field label="Display order"><input type="number" value={form.sort_order} onChange={(e) => setForm({...form,sort_order:e.target.value})} className={inputClass}/></Field><Field label="Website status"><select value={form.status} onChange={(e) => setForm({...form,status:e.target.value})} className={inputClass}><option value="active">Active / Published</option><option value="inactive">Inactive / Hidden</option></select></Field></div></div><div><p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Product image *</p><div className="mt-2 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-neutral-50">{preview ? <img src={preview} alt="Media Wall preview" className="h-full w-full object-cover"/> : <div className="text-center text-neutral-400"><ImageIcon className="mx-auto" size={32}/><p className="mt-2 text-xs">No image selected</p></div>}</div><input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])}/><button type="button" onClick={() => fileInputRef.current?.click()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-medium hover:bg-neutral-50"><Upload size={16}/>{selectedFile ? "Choose another image" : "Upload / Replace image"}</button><p className="mt-2 text-xs leading-5 text-neutral-500">JPG, PNG or WEBP. Maximum size 5 MB.</p>{editingProduct && !selectedFile && <p className="mt-2 break-all text-[11px] text-neutral-400">Current image: {form.image_url ? "Stored in Supabase" : "No image URL"}</p>}</div><div className="flex gap-3 border-t border-neutral-100 pt-4 sm:col-span-2"><button type="button" onClick={closeModal} disabled={saving} className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium hover:bg-neutral-50">Cancel</button><button type="submit" disabled={saving} className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">{saving ? "Saving…" : editingProduct ? "Save changes" : "Add design"}</button></div></form></div></div>}
      </div>
    );
  }
  function Stat({ label, value, icon }) { return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><div className="flex items-center justify-between text-sm text-neutral-500"><span>{label}</span><span className="text-orange-600">{icon}</span></div><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p></div>; }
  function Field({ label, children }) { return <label className="block text-sm font-medium text-neutral-700">{label}{children}</label>; }
