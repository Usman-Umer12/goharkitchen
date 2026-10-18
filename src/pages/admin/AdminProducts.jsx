
import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  LogOut,
  Package,
  ImagePlus,
  X,
  LoaderCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const BUCKET = "kitchen-products";
const DEFAULT_DELIVERY = "Delivery Over Pakistan";

const emptyForm = {
  title: "",
  description: "",
  delivery_text: DEFAULT_DELIVERY,
  status: "active",
  image_url: "",
};

export default function AdminProducts() {
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    let alive = true;

    const checkSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (!alive) return;

      const currentSession = data?.session ?? null;
      setSession(currentSession);
      setIsAdmin(
        currentSession?.user?.app_metadata?.role === "admin"
      );

      if (sessionError) setError(sessionError.message);
      setAuthChecked(true);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!alive) return;

      setSession(newSession);
      setIsAdmin(newSession?.user?.app_metadata?.role === "admin");
      setAuthChecked(true);
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("kitchen_products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
    } else {
      setProducts(data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (authChecked && session && isAdmin) {
      loadProducts();
    } else if (authChecked) {
      setLoading(false);
    }
  }, [authChecked, session, isAdmin, loadProducts]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({ ...emptyForm });
    setImageFile(null);
    setImagePreview("");
    setError("");
    setNotice("");
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title ?? "",
      description: product.description ?? "",
      delivery_text: product.delivery_text ?? DEFAULT_DELIVERY,
      status: product.status ?? "active",
      image_url: product.image_url ?? "",
    });
    setImageFile(null);
    setImagePreview(product.image_url ?? "");
    setError("");
    setNotice("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview("");
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
    const filePath = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    let uploadedImageUrl = "";

    try {
      let imageUrl = editingProduct?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        uploadedImageUrl = imageUrl;
      }

      if (!imageUrl) {
        throw new Error("Please select a product image.");
      }

      const productData = {
        title: form.title.trim(),
        description: form.description.trim(),
        delivery_text: form.delivery_text.trim() || DEFAULT_DELIVERY,
        image_url: imageUrl,
        category: "Kitchen",
        status: form.status,
        updated_at: new Date().toISOString(),
      };

      if (!productData.title) {
        throw new Error("Product title is required.");
      }

      const result = editingProduct
        ? await supabase
            .from("kitchen_products")
            .update(productData)
            .eq("id", editingProduct.id)
            .select()
            .single()
        : await supabase
            .from("kitchen_products")
            .insert({
              ...productData,
              sort_order: products.length,
            })
            .select()
            .single();

      if (result.error) throw result.error;

      // Remove the old image only after a successful image replacement.
      if (
        editingProduct &&
        imageFile &&
        editingProduct.image_url &&
        editingProduct.image_url !== imageUrl
      ) {
        const marker = `/object/public/${BUCKET}/`;
        const oldPath = editingProduct.image_url.split(marker)[1];

        if (oldPath) {
          await supabase.storage.from(BUCKET).remove([oldPath]);
        }
      }

      setModalOpen(false);
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview("");
      setNotice(editingProduct ? "Product updated successfully." : "Product added successfully.");
      await loadProducts();
    } catch (saveError) {
      // If saving the database row failed, remove the newly uploaded image.
      if (uploadedImageUrl) {
        const marker = `/object/public/${BUCKET}/`;
        const uploadedPath = uploadedImageUrl.split(marker)[1];

        if (uploadedPath) {
          await supabase.storage.from(BUCKET).remove([uploadedPath]);
        }
      }

      setError(saveError.message || "Could not save the product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    const { error: deleteError } = await supabase
      .from("kitchen_products")
      .delete()
      .eq("id", product.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    const marker = `/object/public/${BUCKET}/`;
    const imagePath = product.image_url?.split(marker)[1];

    if (imagePath) {
      await supabase.storage.from(BUCKET).remove([imagePath]);
    }

    setProducts((previous) =>
      previous.filter((item) => item.id !== product.id)
    );
    setNotice("Product deleted successfully.");
  };

  const handleStatusChange = async (product) => {
    const newStatus = product.status === "active" ? "inactive" : "active";

    setError("");
    setNotice("");

    const { error: updateError } = await supabase
      .from("kitchen_products")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setProducts((previous) =>
      previous.map((item) =>
        item.id === product.id ? { ...item, status: newStatus } : item
      )
    );
    setNotice(`Product marked ${newStatus}.`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/admin/login");
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <LoaderCircle className="animate-spin text-[#f97316]" size={32} />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-black">Access denied</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            This account does not have administrator permissions.
          </p>
          <button
            onClick={handleLogout}
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-[#f97316] hover:text-black"
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    return (
      product.title?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f97316]">
              <Package size={23} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight sm:text-xl">
                GOHAR KITCHEN
              </h1>
              <p className="text-xs text-gray-500">Product Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/kitchen"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:border-[#f97316] sm:flex"
            >
              View website <ExternalLink size={15} />
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-bold text-white hover:bg-[#f97316] hover:text-black sm:px-4"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f97316]">
              Catalogue
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Kitchen Products
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Add and manage the products displayed on your website.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#f97316] px-5 py-3 font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            <Plus size={19} />
            Add Product
          </button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">Total products</p>
            <p className="mt-2 text-3xl font-black">{products.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">Active products</p>
            <p className="mt-2 text-3xl font-black">
              {products.filter((item) => item.status === "active").length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">Inactive products</p>
            <p className="mt-2 text-3xl font-black">
              {products.filter((item) => item.status === "inactive").length}
            </p>
          </div>
        </div>

        {(error || notice) && (
          <div
            role={error ? "alert" : "status"}
            className={`mt-5 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-800"
            }`}
          >
            <span>{error || notice}</span>
            <button
              onClick={() => {
                setError("");
                setNotice("");
              }}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h3 className="font-bold">All products</h3>
              <p className="mt-1 text-xs text-gray-500">
                {filteredProducts.length} product(s) found
              </p>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 sm:w-64">
                <Search size={17} className="text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
                />
              </div>
              <button
                onClick={loadProducts}
                title="Refresh products"
                className="rounded-lg border border-gray-200 p-2.5 hover:border-[#f97316]"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-gray-500">
              <LoaderCircle size={22} className="animate-spin text-[#f97316]" />
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Package className="mx-auto text-gray-300" size={40} />
              <h4 className="mt-4 text-lg font-bold">No products found</h4>
              <p className="mt-2 text-sm text-gray-500">
                Add your first product or try a different search.
              </p>
              <button
                onClick={openAddModal}
                className="mt-5 rounded-lg bg-[#f97316] px-4 py-2.5 text-sm font-bold text-black"
              >
                Add your first product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-bold">Product</th>
                    <th className="px-5 py-4 font-bold">Delivery</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/80">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="h-16 w-16 shrink-0 rounded-xl border border-gray-100 object-cover"
                          />
                          <div className="max-w-sm">
                            <p className="font-bold">{product.title}</p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                              {product.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {product.delivery_text || DEFAULT_DELIVERY}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleStatusChange(product)}
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            title="Edit product"
                            className="rounded-lg border border-gray-200 p-2.5 hover:border-[#f97316] hover:bg-orange-50"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            title="Delete product"
                            className="rounded-lg border border-gray-200 p-2.5 text-red-600 hover:border-red-200 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
              <div>
                <h3 className="text-xl font-black">
                  {editingProduct ? "Edit product" : "Add new product"}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Fields marked * are required.
                </p>
              </div>
              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-5 sm:p-7">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Product title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  required
                  maxLength={150}
                  placeholder="Enter product title"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={4}
                  maxLength={3000}
                  placeholder="Describe this kitchen design..."
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Product image *
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-5 text-center transition-colors hover:border-[#f97316]">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="mb-3 h-44 w-full rounded-lg object-contain"
                    />
                  ) : (
                    <ImagePlus size={32} className="mb-3 text-[#f97316]" />
                  )}
                  <span className="text-sm font-bold">
                    {imageFile ? imageFile.name : "Choose an image"}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WEBP · Maximum 5 MB
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                {editingProduct && !imageFile && (
                  <p className="mt-2 text-xs text-gray-500">
                    Leave the current image unchanged, or select a new one.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Delivery text
                </label>
                <input
                  name="delivery_text"
                  value={form.delivery_text}
                  onChange={updateField}
                  maxLength={200}
                  placeholder={DEFAULT_DELIVERY}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Product status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#f97316]"
                >
                  <option value="active">Active — show on website</option>
                  <option value="inactive">Inactive — hide on website</option>
                </select>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#f97316] px-6 py-3 text-sm font-black text-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <LoaderCircle size={17} className="animate-spin" />}
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save changes"
                      : "Add product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
