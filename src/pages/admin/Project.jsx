import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, RefreshCw, Trash2, ImagePlus, ExternalLink, Pencil, X } from "lucide-react";

const emptyForm = { title: "", category: "Luxury Kitchen", description: "", imageUrls: "" };

function groupRows(rows) {
  const groups = new Map();
  (rows || []).forEach((row) => {
    const key = row.project_id || `legacy-${row.id}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        title: row.project_title || row.title || "Interior Project",
        category: row.category || "Interior Design",
        description: row.project_description || row.description || "",
        images: [],
        sort_order: row.sort_order ?? 0,
      });
    }
    if (row.image_url) groups.get(key).images.push(row.image_url);
  });
  return [...groups.values()];
}

export default function AdminProject() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("project_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (queryError) {
      console.error(queryError);
      setError("Could not load projects. Confirm the project_images table and its permissions in Supabase.");
      setProjects([]);
    } else {
      setProjects(groupRows(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
    setNotice("");
    setError("");
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category,
      description: project.description,
      imageUrls: project.images.join("\n"),
    });
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");
    setError("");

    const urls = form.imageUrls.split(/\n|,/).map((url) => url.trim()).filter(Boolean);
    if (!form.title.trim()) return setError("Please enter a project title.");
    if (!urls.length) return setError("Add at least one image URL. Use one URL per line.");
    if (urls.some((url) => !/^https?:\/\/\S+$/i.test(url))) return setError("Each image must be a valid http:// or https:// URL.");

    setSaving(true);
    try {
      if (editingId) {
        const { error: deleteError } = await supabase.from("project_images").delete().eq("project_id", editingId);
        if (deleteError) throw deleteError;
      }

      const projectId = editingId || (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `project-${Date.now()}`);
      const rows = urls.map((image_url, index) => ({
        project_id: projectId,
        project_title: form.title.trim(),
        project_description: form.description.trim(),
        category: form.category.trim() || "Interior Design",
        image_url,
        sort_order: index,
      }));

      const { error: insertError } = await supabase.from("project_images").insert(rows);
      if (insertError) throw insertError;

      setNotice(editingId ? "Project updated successfully." : "Project added successfully.");
      resetForm();
      await loadProjects();
    } catch (err) {
      console.error("Project save failed:", err);
      setError(err?.message || "Could not save this project. Check your Supabase table columns and permissions.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.title}" and all its project image records?`)) return;
    setNotice("");
    setError("");
    const { error: deleteError } = await supabase.from("project_images").delete().eq("project_id", project.id);
    if (deleteError) {
      console.error(deleteError);
      setError(deleteError.message || "Could not delete this project.");
      return;
    }
    setNotice("Project deleted.");
    await loadProjects();
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#f6f5f3] px-4 py-6 sm:px-6 lg:px-9">
      <div className="mx-auto max-w-[1450px] space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#c0652b]">Gohar Kitchen Interior / CMS</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Our Projects</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">Add a project with multiple image URLs. Each URL should be on its own line. Projects appear on the public portfolio page.</p>
          </div>
          <button type="button" onClick={loadProjects} disabled={loading} className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 hover:border-[#c0652b] disabled:opacity-60 sm:self-auto">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""}/> Refresh
          </button>
        </header>

        {(notice || error) && <div className={`rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{error || notice}</div>}

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">{editingId ? "Edit Project" : "Add New Project"}</h2>
              <p className="mt-1 text-xs text-neutral-500">Project details and gallery images</p>
            </div>
            {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-500 hover:bg-neutral-100"><X size={14}/> Cancel edit</button>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-neutral-600">Project title *</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Contemporary Luxury Kitchen" className="w-full rounded-xl border border-neutral-200 px-3.5 py-3 text-sm outline-none focus:border-[#c0652b] focus:ring-2 focus:ring-[#c0652b]/10"/></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-neutral-600">Category</span><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Luxury Kitchen" className="w-full rounded-xl border border-neutral-200 px-3.5 py-3 text-sm outline-none focus:border-[#c0652b] focus:ring-2 focus:ring-[#c0652b]/10"/></label>
            </div>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-neutral-600">Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe this completed project..." className="w-full resize-y rounded-xl border border-neutral-200 px-3.5 py-3 text-sm outline-none focus:border-[#c0652b] focus:ring-2 focus:ring-[#c0652b]/10"/></label>
            <label className="block"><span className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-neutral-600"><ImagePlus size={15}/> Image URLs * <span className="font-normal text-neutral-400">(one per line)</span></span><textarea value={form.imageUrls} onChange={(e) => setForm({ ...form, imageUrls: e.target.value })} required rows={5} placeholder={"https://your-image-url.com/project-1.webp\nhttps://your-image-url.com/project-2.webp"} className="w-full resize-y rounded-xl border border-neutral-200 px-3.5 py-3 text-sm outline-none focus:border-[#c0652b] focus:ring-2 focus:ring-[#c0652b]/10"/></label>
            <div className="flex flex-wrap gap-3 pt-1">
              <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#c0652b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a95020] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : <><Plus size={16}/>{editingId ? "Save Changes" : "Add Project"}</>}</button>
              <a href="/projects" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 hover:border-[#c0652b]"><ExternalLink size={15}/> View Public Page</a>
            </div>
          </form>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-lg font-bold text-neutral-900">Saved projects</h2><p className="mt-1 text-sm text-neutral-500">Manage existing portfolio entries.</p></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 ring-1 ring-neutral-200">{projects.length} projects</span></div>
          {loading ? <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">Loading projects...</div> :
            projects.length === 0 ? <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500">No projects found. Add your first project above.</div> :
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article key={project.id} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/10] bg-neutral-100"><img src={project.images[0]} alt={project.title} className="h-full w-full object-cover" loading="lazy"/><span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">{project.images.length} images</span></div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c0652b]">{project.category}</p>
                    <h3 className="mt-2 text-base font-bold text-neutral-900">{project.title}</h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-neutral-500">{project.description || "No description provided."}</p>
                    <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-3">
                      <button type="button" onClick={() => startEdit(project)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-700 hover:border-[#c0652b] hover:text-[#c0652b]"><Pencil size={14}/> Edit</button>
                      <button type="button" onClick={() => deleteProject(project)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"><Trash2 size={14}/> Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>}
        </section>
      </div>
    </div>
  );
}
