// src/pages/admin/Bed.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BedDouble,
  Eye,
  EyeOff,
  Download,
  IndianRupee,
  Package,
  Truck,
  Save,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

/* =========================================================
   CONFIGURATION
========================================================= */

const TABLE = "bed_products";
const BUCKET = "bed-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const DELIVERY_DEFAULT = "Delivery All Over Pakistan";

const localAssets = import.meta.glob(
  "../../assets/*.webp",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const getLocalImage = (filename) => {
  const key = Object.keys(localAssets).find((path) =>
    path.endsWith(`/${filename}`)
  );

  return key ? localAssets[key] : null;
};

const bedTitles = [
  "Modern Luxury Bed",
  "Contemporary Upholstered Bed",
  "Premium Wooden Bed",
  "Elegant Bedroom Bed",
  "Minimalist Designer Bed",
  "Luxury King Size Bed",
  "Modern Panel Bed",
  "Classic Wooden Bed",
  "Premium Master Bedroom Bed",
];

const bedDescriptions = [
  "A refined bed design created to bring comfort and elegance to your bedroom.",
  "A contemporary design with a premium finish and carefully considered details.",
  "A timeless wooden bed design suitable for modern and classic interiors.",
  "A stylish bedroom centrepiece made with attention to quality and finishing.",
  "A clean, minimal design created for a sophisticated bedroom interior.",
  "A spacious king-size bed design with an elegant and premium appearance.",
  "A statement bed design with distinctive detailing and a modern finish.",
  "A classic design combining practical construction with timeless styling.",
  "A premium bedroom design tailored to your space and interior preferences.",
];

const defaultPrices = [
  85000,
  95000,
  105000,
  90000,
  88000,
  125000,
  98000,
  92000,
  135000,
];

const emptyForm = {
  title: "",
  description: "",
  image_url: "",
  price: "",
  delivery_text: DELIVERY_DEFAULT,
  status: "active",
  sort_order: 1,
};

const money = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(Number(value)) ||
    Number(value) <= 0
  ) {
    return "Price not set";
  }

  return `PKR ${new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(Number(value))}`;
};

/* =========================================================
   ADMIN BED
========================================================= */

export default function AdminBed() {
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

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const notify = useCallback((type, text) => {
    setMessage({ type, text });
  }, []);

  /* =======================================================
     LOAD PRODUCTS
  ======================================================= */

  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select(
          "id, title, description, image_url, price, delivery_text, status, sort_order, created_at, updated_at"
        )
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Bed products loading error:", error);

      notify(
        "error",
        error.message ||
          "Could not load bed designs. Check the bed_products table and Supabase permissions."
      );
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /* =======================================================
     PREVIEW URL CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* =======================================================
     FORM HELPERS
  ======================================================= */

  const resetForm = () => {
    setEditingProduct(null);
    setForm({
      ...emptyForm,
      sort_order: products.length + 1,
    });
    setSelectedFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openCreate = () => {
    setEditingProduct(null);

    setForm({
      ...emptyForm,
      sort_order: products.length + 1,
    });

    setSelectedFile(null);
    setPreview("");
    setModalOpen(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);

    setForm({
      title: product.title || "",
      description: product.description || "",
      image_url: product.image_url || "",
      price:
        product.price === null || product.price === undefined
          ? ""
          : String(product.price),
      delivery_text:
        product.delivery_text || DELIVERY_DEFAULT,
      status: product.status || "active",
      sort_order: product.sort_order ?? 0,
    });

    setSelectedFile(null);
    setPreview(product.image_url || "");
    setModalOpen(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingProduct(null);
    setSelectedFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const changeField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     IMAGE SELECTION
  ======================================================= */

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("error", "Please select a valid image file.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      notify(
        "error",
        "Image must be 5 MB or smaller. Compress the image and try again."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setMessage(null);
  };

  /* =======================================================
     IMAGE UPLOAD
  ======================================================= */

  const uploadImage = async (file) => {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "webp";

    const path =
      `beds/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

    return {
      path,
      url: data.publicUrl,
    };
  };

  /* =======================================================
     SAVE PRODUCT
  ======================================================= */

  const saveProduct = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!form.title.trim()) {
      notify("error", "Please enter a product title.");
      return;
    }

    if (
      form.price !== "" &&
      (
        !Number.isFinite(Number(form.price)) ||
        Number(form.price) < 0
      )
    ) {
      notify("error", "Please enter a valid price.");
      return;
    }

    if (
      !form.image_url &&
      !selectedFile &&
      !editingProduct
    ) {
      notify("error", "Please upload a product image.");
      return;
    }

    setSaving(true);

    let uploadedPath = "";

    try {
      let imageUrl = form.image_url;

      if (selectedFile) {
        const uploaded = await uploadImage(selectedFile);

        uploadedPath = uploaded.path;
        imageUrl = uploaded.url;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image_url: imageUrl || null,
        price: form.price === "" ? null : Number(form.price),
        delivery_text:
          form.delivery_text.trim() || DELIVERY_DEFAULT,
        status: form.status,
        sort_order: Number(form.sort_order) || 0,
        updated_at: new Date().toISOString(),
      };

      const result = editingProduct
        ? await supabase
            .from(TABLE)
            .update(payload)
            .eq("id", editingProduct.id)
            .select()
            .single()
        : await supabase
            .from(TABLE)
            .insert({
              ...payload,
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

      if (result.error) {
        throw result.error;
      }

      setModalOpen(false);
      setEditingProduct(null);
      setSelectedFile(null);
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      notify(
        "success",
        editingProduct
          ? "Bed design updated successfully."
          : "Bed design added successfully."
      );

      await loadProducts();
    } catch (error) {
      console.error("Saving bed product failed:", error);

      notify(
        "error",
        error.message ||
          "Could not save the bed design. Check Supabase permissions."
      );

      // Remove the newly uploaded image if saving the record failed.
      if (uploadedPath) {
        const { error: cleanupError } = await supabase.storage
          .from(BUCKET)
          .remove([uploadedPath]);

        if (cleanupError) {
          console.warn(
            "Uploaded image cleanup failed:",
            cleanupError.message
          );
        }
      }
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE PRODUCT
  ======================================================= */

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      setProducts((previous) =>
        previous.filter((item) => item.id !== product.id)
      );

      if (editingProduct?.id === product.id) {
        closeModal();
      }

      notify("success", "Bed design deleted successfully.");
    } catch (error) {
      console.error("Deleting bed product failed:", error);

      notify(
        "error",
        error.message || "Could not delete this bed design."
      );
    }
  };

  /* =======================================================
     TOGGLE ACTIVE / INACTIVE
  ======================================================= */

  const toggleStatus = async (product) => {
    const nextStatus =
      product.status === "active" ? "inactive" : "active";

    try {
      const { error } = await supabase
        .from(TABLE)
        .update({
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);

      if (error) throw error;

      setProducts((previous) =>
        previous.map((item) =>
          item.id === product.id
            ? { ...item, status: nextStatus }
            : item
        )
      );

      notify("success", `Design is now ${nextStatus}.`);
    } catch (error) {
      console.error("Updating bed status failed:", error);

      notify(
        "error",
        error.message || "Could not update product status."
      );
    }
  };

  /* =======================================================
     IMPORT LOCAL BED IMAGES
  ======================================================= */

  const importDesigns = async () => {
    const confirmed = window.confirm(
      "Import bed1.webp to bed9.webp from src/assets into Supabase? Existing designs with the same display order will be skipped."
    );

    if (!confirmed) return;

    setImporting(true);
    setImportProgress("Checking existing bed designs...");

    let imported = 0;
    let skipped = 0;
    let failed = 0;

    const errors = [];

    try {
      const { data: existing, error: existingError } =
        await supabase
          .from(TABLE)
          .select("id, sort_order");

      if (existingError) throw existingError;

      const existingOrders = new Set(
        (existing || []).map((product) =>
          Number(product.sort_order)
        )
      );

      for (let i = 1; i <= 9; i += 1) {
        if (existingOrders.has(i)) {
          skipped += 1;
          setImportProgress(
            `Design ${i}/9 — already exists, skipping...`
          );
          continue;
        }

        setImportProgress(`Importing bed design ${i}/9...`);

        let uploadedPath = "";

        try {
          const localImage = getLocalImage(`bed${i}.webp`);

          if (!localImage) {
            throw new Error(
              `bed${i}.webp was not found in src/assets.`
            );
          }

          const response = await fetch(localImage);

          if (!response.ok) {
            throw new Error(
              `Could not read bed${i}.webp.`
            );
          }

          const blob = await response.blob();

          if (blob.size > MAX_IMAGE_SIZE) {
            throw new Error(
              `bed${i}.webp exceeds the 5 MB image limit.`
            );
          }

          const extension = blob.type.includes("png")
            ? "png"
            : blob.type.includes("jpeg")
              ? "jpg"
              : "webp";

          const path =
            `beds/bed${i}-${crypto.randomUUID()}.${extension}`;

          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(path, blob, {
              upsert: false,
              contentType: blob.type || "image/webp",
              cacheControl: "3600",
            });

          if (uploadError) throw uploadError;

          uploadedPath = path;

          const { data: publicData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(path);

          const payload = {
            title: bedTitles[i - 1],
            description: bedDescriptions[i - 1],
            image_url: publicData.publicUrl,
            price: defaultPrices[i - 1],
            delivery_text: DELIVERY_DEFAULT,
            status: "active",
            sort_order: i,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { error: insertError } = await supabase
            .from(TABLE)
            .insert(payload);

          if (insertError) throw insertError;

          imported += 1;
          existingOrders.add(i);
        } catch (error) {
          console.error(
            `Import failed for bed${i}.webp:`,
            error
          );

          failed += 1;
          errors.push(
            `Design ${i}: ${error.message || "Import failed"}`
          );

          if (uploadedPath) {
            await supabase.storage
              .from(BUCKET)
              .remove([uploadedPath]);
          }
        }
      }

      await loadProducts();

      const summary =
        `Import finished: ${imported} added, ${skipped} skipped, ${failed} failed.`;

      notify(
        failed > 0 ? "error" : "success",
        errors.length
          ? `${summary} ${errors[0]}`
          : summary
      );
    } catch (error) {
      console.error("Bed designs import failed:", error);

      notify(
        "error",
        error.message ||
          "Import failed. Check the database table, storage bucket and permissions."
      );
    } finally {
      setImporting(false);
      setImportProgress("");
    }
  };

  /* =======================================================
     CSV EXPORT
  ======================================================= */

  const exportCsv = () => {
    const rows = [
      [
        "Title",
        "Description",
        "Price PKR",
        "Delivery",
        "Status",
        "Display Order",
        "Image URL",
      ],
      ...filteredProducts.map((product) => [
        product.title,
        product.description,
        product.price ?? "",
        product.delivery_text,
        product.status,
        product.sort_order,
        product.image_url,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "bed-products.csv";
    anchor.click();

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     FILTERS AND STATS
  ======================================================= */

  const activeCount = products.filter(
    (product) => product.status === "active"
  ).length;

  const pricedCount = products.filter(
    (product) =>
      product.price !== null &&
      product.price !== "" &&
      Number(product.price) > 0
  ).length;

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.title?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term);

      const matchesStatus =
        filter === "all" || product.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, filter]);

  /* =======================================================
     STYLES
  ======================================================= */

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f7f7f5] p-4 text-neutral-900 sm:p-6 lg:p-8">
      {/* NOTIFICATIONS */}
      {message && (
        <div
          role="status"
          className={`fixed right-4 top-4 z-[200] flex max-w-[calc(100%-2rem)] items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-xl ${
            message.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          <span className="mt-0.5">
            {message.type === "error" ? (
              <AlertCircle size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}
          </span>

          <span>{message.text}</span>

          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}
        <header className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">
              Gohar Bed Collection / Admin
            </p>

            <h1 className="mt-2 flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              <BedDouble className="text-orange-600" />
              Bed Design Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Manage bed designs, images, descriptions, PKR prices,
              delivery information and website visibility.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={importDesigns}
              disabled={importing || loading}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
            >
              <Download size={16} />
              {importing ? "Importing..." : "Import 9 Designs"}
            </button>

            <button
              type="button"
              onClick={exportCsv}
              disabled={!filteredProducts.length}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
            >
              <Download size={16} />
              Export CSV
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
            >
              <Plus size={17} />
              Add Bed Design
            </button>
          </div>
        </header>

        {/* IMPORT PROGRESS */}
        {importProgress && (
          <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            {importProgress}
          </div>
        )}

        {/* STATISTICS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Total designs"
            value={products.length}
            icon={<Package size={19} />}
          />

          <Stat
            label="Active on website"
            value={activeCount}
            icon={<Eye size={19} />}
          />

          <Stat
            label="Inactive designs"
            value={products.length - activeCount}
            icon={<EyeOff size={19} />}
          />

          <Stat
            label="Prices configured"
            value={pricedCount}
            icon={<IndianRupee size={19} />}
          />
        </div>

        {/* SEARCH AND FILTER */}
        <section className="mb-5 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={17}
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by design title or description..."
              className="w-full rounded-xl border border-neutral-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </section>

        {/* PRODUCT LIST */}
        {loading ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-16 text-center text-sm text-neutral-500">
            <RefreshCw className="mx-auto mb-3 animate-spin" />
            Loading bed designs...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
              <BedDouble size={25} />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              No bed designs in Supabase yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              Add your first bed design manually or import your
              local bed1.webp to bed9.webp images.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700"
              >
                <Plus size={16} />
                Add Bed Design
              </button>

              <button
                type="button"
                onClick={importDesigns}
                disabled={importing}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
              >
                <Download size={16} />
                Import Designs
              </button>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-sm text-neutral-500">
            No bed designs match your search or selected filter.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-neutral-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-400">
                      <ImageIcon size={35} />
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      product.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {product.status || "inactive"}
                  </span>

                  <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">
                    Order {String(product.sort_order ?? 0).padStart(2, "0")}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 font-semibold">
                    {product.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-neutral-500">
                    {product.description || "No description added."}
                  </p>

                  <p className="mt-3 text-base font-semibold text-orange-700">
                    {money(product.price)}
                  </p>

                  <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-neutral-500">
                    <Truck size={14} className="mt-0.5 shrink-0" />
                    {product.delivery_text || DELIVERY_DEFAULT}
                  </p>

                  <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium hover:bg-neutral-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleStatus(product)}
                      title={
                        product.status === "active"
                          ? "Hide from public page"
                          : "Publish on public page"
                      }
                      className="rounded-lg border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
                    >
                      {product.status === "active" ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProduct(product)}
                      aria-label={`Delete ${product.title}`}
                      className="rounded-lg border border-red-100 px-3 py-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && products.length > 0 && (
          <p className="mt-5 text-center text-xs text-neutral-500">
            Showing {filteredProducts.length} of {products.length} bed designs
          </p>
        )}
      </div>

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {modalOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingProduct
                    ? "Edit Bed Design"
                    : "Add Bed Design"}
                </h2>

                <p className="mt-1 text-xs text-neutral-500">
                  Changes sync with your public bed page.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close editor"
                className="rounded-full p-2 hover:bg-neutral-100 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={saveProduct}
              className="grid gap-5 p-5 sm:grid-cols-[1fr_240px] sm:p-7"
            >
              <div className="space-y-4">
                <Field label="Product title *">
                  <input
                    name="title"
                    required
                    maxLength={160}
                    value={form.title}
                    onChange={changeField}
                    className={inputClass}
                    placeholder="e.g. Modern Luxury Bed"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={changeField}
                    className={inputClass}
                    placeholder="Describe the design, materials and finish..."
                  />
                </Field>

                <Field label="Price in PKR">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500">
                      PKR
                    </span>

                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      value={form.price}
                      onChange={changeField}
                      className={`${inputClass} pl-12`}
                      placeholder="85000"
                    />
                  </div>

                  <p className="mt-1 text-xs font-normal leading-5 text-neutral-500">
                    The public page displays the price only when
                    a positive price is set. Leave blank to hide it.
                  </p>
                </Field>

                <Field label="Delivery text">
                  <div className="relative">
                    <Truck
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                      name="delivery_text"
                      value={form.delivery_text}
                      onChange={changeField}
                      className={`${inputClass} pl-9`}
                      placeholder={DELIVERY_DEFAULT}
                    />
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Display order">
                    <input
                      name="sort_order"
                      type="number"
                      step="1"
                      value={form.sort_order}
                      onChange={changeField}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Website status">
                    <select
                      name="status"
                      value={form.status}
                      onChange={changeField}
                      className={inputClass}
                    >
                      <option value="active">
                        Active / Published
                      </option>
                      <option value="inactive">
                        Inactive / Hidden
                      </option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Product image *
                </p>

                <div className="mt-2 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-neutral-50">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Bed design preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-neutral-400">
                      <ImageIcon className="mx-auto" size={32} />
                      <p className="mt-2 text-xs">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(event) =>
                    handleFile(event.target.files?.[0])
                  }
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-medium hover:bg-neutral-50"
                >
                  <Upload size={16} />
                  {selectedFile
                    ? "Choose another image"
                    : editingProduct
                      ? "Upload / Replace image"
                      : "Upload product image"}
                </button>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  JPG, PNG, WEBP or GIF. Maximum size 5 MB.
                </p>

                {editingProduct && (
                  <p className="mt-2 break-all text-[11px] text-neutral-400">
                    {selectedFile
                      ? "New image selected."
                      : form.image_url
                        ? "Current image will be retained."
                        : "No image uploaded yet."}
                  </p>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 border-t border-neutral-100 pt-4 sm:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium hover:bg-neutral-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save Changes"
                      : "Add Bed Design"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   REUSABLE STAT CARD
========================================================= */

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3 text-sm text-neutral-500">
        <span>{label}</span>
        <span className="text-orange-600">{icon}</span>
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   REUSABLE FORM FIELD
========================================================= */

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      {children}
    </label>
  );
}
