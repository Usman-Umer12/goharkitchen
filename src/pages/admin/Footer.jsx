
import React, { useCallback, useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  Pencil,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Globe,
  ExternalLink,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

/* =========================================================
   SOCIAL MEDIA ICONS
========================================================= */

function SocialIcon({ type, size = 21 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "aria-hidden": true,
    focusable: "false",
  };

  switch ((type || "globe").toLowerCase()) {
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.12A22 22 0 0 0 14.3 3c-2.5 0-4.2 1.53-4.2 4.35V9.6H7.3v3.2h2.8V21h3.4Z" />
        </svg>
      );

    case "instagram":
      return (
        <svg {...common}>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.9"
          />
          <circle
            cx="12"
            cy="12"
            r="4.1"
            stroke="currentColor"
            strokeWidth="1.9"
          />
          <circle cx="17.5" cy="6.8" r="1.15" fill="currentColor" />
        </svg>
      );

    case "tiktok":
      return (
        <svg {...common} fill="currentColor">
          <path d="M19.3 8.1a6.5 6.5 0 0 1-4.1-1.5v7.1a5.5 5.5 0 1 1-5.5-5.5c.35 0 .7.04 1.05.1v3.1a2.5 2.5 0 1 0 1.5 2.3V2.5h3a6.5 6.5 0 0 0 4.05 4.1v1.5Z" />
        </svg>
      );

    case "youtube":
      return (
        <svg {...common}>
          <path
            d="M23 7.1a3 3 0 0 0-2.1-2.12C19.05 4.5 12 4.5 12 4.5s-7.05 0-8.9.48A3 3 0 0 0 1 7.1 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.12c1.85.48 8.9.48 8.9.48s7.05 0 8.9-.48A3 3 0 0 0 23 16.9a31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9Z"
            fill="currentColor"
            transform="translate(0.25 0)"
          />
          <path d="m10 8.5 6 3.5-6 3.5v-7Z" fill="#F3F4F6" />
        </svg>
      );

    case "linkedin":
      return <Linkedin size={size} />;

    case "whatsapp":
      return <MessageCircle size={size} />;

    default:
      return <Globe size={size} />;
  }
}

const ICON_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "globe", label: "Website / Other" },
];

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const EMPTY_FORM = {
  name: "",
  icon: "instagram",
  url: "",
  enabled: true,
};

const DEFAULT_SETTINGS = {
  phone_one: "+923007023202",
  phone_two: "",
  email: "Goharkitcheninterior@gmail.com",
  location: "Faisalabad, Pakistan",
  description:
    "We create beautifully designed kitchens, wardrobes, media walls and bespoke interiors that combine modern aesthetics, everyday functionality and quality craftsmanship.",
  quote_text: "Get a Quote",
  quote_link: "/contact",
  socials: [],
};

function makeId() {
  return `social-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function normalizeSettings(row) {
  return {
    ...DEFAULT_SETTINGS,
    ...row,
    phone_one: row?.phone_one ?? DEFAULT_SETTINGS.phone_one,
    phone_two: row?.phone_two ?? "",
    email: row?.email ?? DEFAULT_SETTINGS.email,
    location: row?.location ?? DEFAULT_SETTINGS.location,
    description: row?.description ?? DEFAULT_SETTINGS.description,
    quote_text: row?.quote_text ?? DEFAULT_SETTINGS.quote_text,
    quote_link: row?.quote_link ?? DEFAULT_SETTINGS.quote_link,
    socials: Array.isArray(row?.socials)
      ? row.socials.map((item, index) => ({
          id: item.id || `social-loaded-${index}`,
          name: item.name || "Social Media",
          icon: item.icon || "globe",
          url: item.url || "",
          enabled: item.enabled !== false,
        }))
      : [],
  };
}

function isValidSocialUrl(value) {
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      Boolean(parsed.hostname) &&
      parsed.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

/* =========================================================
   ADMIN FOOTER PAGE
========================================================= */

export default function AdminFooter() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [socialForm, setSocialForm] = useState(EMPTY_FORM);
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { data, error } = await supabase
        .from("footer_settings")
        .select(
          "id, phone_one, phone_two, email, location, description, quote_text, quote_link, socials"
        )
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setMessage({
          type: "error",
          text:
            "Footer settings not found. Create the footer_settings row with id = 1 in Supabase.",
        });
        return;
      }

      setSettings(normalizeSettings(data));
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Unable to load footer settings.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateField = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setSocialForm({ ...EMPTY_FORM });
    setShowSocialForm(true);
    setMessage({ type: "", text: "" });
  };

  const openEditForm = (social) => {
    setEditingId(social.id);
    setSocialForm({
      name: social.name,
      icon: social.icon,
      url: social.url,
      enabled: social.enabled,
    });
    setShowSocialForm(true);
    setMessage({ type: "", text: "" });
  };

  const closeSocialForm = () => {
    setShowSocialForm(false);
    setEditingId(null);
    setSocialForm({ ...EMPTY_FORM });
  };

  const saveSocial = (event) => {
    event.preventDefault();

    const name = socialForm.name.trim();
    const url = socialForm.url.trim();

    if (!name || !url) {
      setMessage({
        type: "error",
        text: "Platform name and URL are required.",
      });
      return;
    }

    if (!isValidSocialUrl(url)) {
      setMessage({
        type: "error",
        text: "Enter a valid website URL beginning with https:// or http://.",
      });
      return;
    }

    const item = {
      id: editingId || makeId(),
      name,
      icon: socialForm.icon,
      url,
      enabled: socialForm.enabled,
    };

    setSettings((previous) => ({
      ...previous,
      socials: editingId
        ? previous.socials.map((social) =>
            social.id === editingId ? item : social
          )
        : [...previous.socials, item],
    }));

    closeSocialForm();

    setMessage({
      type: "success",
      text: "Social icon updated. Click Save Changes to publish it.",
    });
  };

  const deleteSocial = (id) => {
    if (!window.confirm("Delete this social media icon?")) return;

    setSettings((previous) => ({
      ...previous,
      socials: previous.socials.filter((social) => social.id !== id),
    }));

    setMessage({
      type: "success",
      text: "Icon removed from the draft. Click Save Changes to publish.",
    });
  };

  const toggleSocial = (id) => {
    setSettings((previous) => ({
      ...previous,
      socials: previous.socials.map((social) =>
        social.id === id
          ? { ...social, enabled: !social.enabled }
          : social
      ),
    }));
  };

  const moveSocial = (index, direction) => {
    setSettings((previous) => {
      const socials = [...previous.socials];
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= socials.length) {
        return previous;
      }

      [socials[index], socials[nextIndex]] = [
        socials[nextIndex],
        socials[index],
      ];

      return { ...previous, socials };
    });
  };

  const saveSettings = async () => {
    if (saving) return;

    if (!settings.phone_one.trim()) {
      setMessage({
        type: "error",
        text: "The primary phone number is required.",
      });
      return;
    }

    if (
      settings.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email.trim())
    ) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    for (const social of settings.socials) {
      if (!social.name.trim() || !isValidSocialUrl(social.url.trim())) {
        setMessage({
          type: "error",
          text: `Check the name and URL for "${social.name || "Social Media"}".`,
        });
        return;
      }
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        phone_one: settings.phone_one.trim(),
        phone_two: settings.phone_two.trim(),
        email: settings.email.trim(),
        location: settings.location.trim(),
        description: settings.description.trim(),
        quote_text: settings.quote_text.trim() || "Get a Quote",
        quote_link: settings.quote_link.trim() || "/contact",
        socials: settings.socials,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("footer_settings")
        .update(payload)
        .eq("id", 1)
        .select("id")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error(
          "Nothing was saved. Check that row id = 1 exists and your Supabase RLS policies allow the logged-in admin to update it."
        );
      }

      setMessage({
        type: "success",
        text: "Footer settings saved successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Unable to save footer settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  const labelClass = "block text-sm font-medium text-gray-700";

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-gray-600">
        <RefreshCw className="animate-spin" size={20} />
        Loading footer settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-orange-600">
              <Settings size={20} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Website CMS
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Footer Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage contact information and social media links.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSettings}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* FEEDBACK */}
        {message.text && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              message.type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* CONTACT INFORMATION */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <Phone size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                Contact Information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                These details appear in your public footer.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Primary Phone Number *
              <input
                className={inputClass}
                value={settings.phone_one}
                onChange={(e) => updateField("phone_one", e.target.value)}
                placeholder="+923007023202"
                required
              />
            </label>

            <label className={labelClass}>
              Secondary Phone Number
              <input
                className={inputClass}
                value={settings.phone_two}
                onChange={(e) => updateField("phone_two", e.target.value)}
                placeholder="+92..."
              />
            </label>

            <label className={labelClass}>
              Email Address
              <input
                type="email"
                className={inputClass}
                value={settings.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="hello@example.com"
              />
            </label>

            <label className={labelClass}>
              Location
              <input
                className={inputClass}
                value={settings.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Faisalabad, Pakistan"
              />
            </label>
          </div>
        </section>

        {/* FOOTER CONTENT */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <Mail size={21} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                Footer Content
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your description and quote button.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <label className={labelClass}>
              Footer Description
              <textarea
                rows={4}
                className={inputClass}
                value={settings.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Write about your business..."
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Quote Button Text
                <input
                  className={inputClass}
                  value={settings.quote_text}
                  onChange={(e) => updateField("quote_text", e.target.value)}
                  placeholder="Get a Quote"
                />
              </label>

              <label className={labelClass}>
                Quote Button Link
                <input
                  className={inputClass}
                  value={settings.quote_link}
                  onChange={(e) => updateField("quote_link", e.target.value)}
                  placeholder="/contact"
                />
              </label>
            </div>
          </div>
        </section>

        {/* SOCIAL MEDIA */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-gray-900">
                Social Media Icons
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Add platforms, change links, hide icons or change their order.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-medium text-white hover:bg-orange-700"
            >
              <Plus size={17} />
              Add Social Icon
            </button>
          </div>

          {showSocialForm && (
            <form
              onSubmit={saveSocial}
              className="mt-6 rounded-xl border border-orange-200 bg-orange-50/50 p-4 sm:p-5"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900">
                  {editingId ? "Edit Social Icon" : "Add Social Icon"}
                </h3>

                <button
                  type="button"
                  onClick={closeSocialForm}
                  className="rounded-lg p-2 text-gray-500 hover:bg-white"
                  aria-label="Close form"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Platform Name
                  <input
                    className={inputClass}
                    value={socialForm.name}
                    onChange={(e) =>
                      setSocialForm((p) => ({
                        ...p,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Facebook"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Icon
                  <select
                    className={inputClass}
                    value={socialForm.icon}
                    onChange={(e) =>
                      setSocialForm((p) => ({
                        ...p,
                        icon: e.target.value,
                      }))
                    }
                  >
                    {ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Social Media URL
                    <input
                      type="url"
                      className={inputClass}
                      value={socialForm.url}
                      onChange={(e) =>
                        setSocialForm((p) => ({
                          ...p,
                          url: e.target.value,
                        }))
                      }
                      placeholder="https://www.instagram.com/yourpage/"
                      required
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:col-span-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <SocialIcon type={socialForm.icon} size={22} />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      {socialForm.name || "Social Media Preview"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Icon preview
                    </p>
                  </div>

                  <label className="ml-auto flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={socialForm.enabled}
                      onChange={(e) =>
                        setSocialForm((p) => ({
                          ...p,
                          enabled: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-orange-600"
                    />
                    Visible
                  </label>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  {editingId ? "Update Icon" : "Add Icon"}
                </button>

                <button
                  type="button"
                  onClick={closeSocialForm}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 space-y-3">
            {settings.socials.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No social icons added yet. Click Add Social Icon.
              </div>
            )}

            {settings.socials.map((social, index) => (
              <div
                key={social.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <SocialIcon type={social.icon} size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {social.name}
                      </p>

                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          social.enabled
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {social.enabled ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex max-w-full items-center gap-1 break-all text-xs text-gray-500 hover:text-orange-600"
                    >
                      <span className="break-all">{social.url}</span>
                      <ExternalLink size={12} className="shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveSocial(index, -1)}
                    disabled={index === 0}
                    title="Move up"
                    aria-label={`Move ${social.name} up`}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-30"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveSocial(index, 1)}
                    disabled={index === settings.socials.length - 1}
                    title="Move down"
                    aria-label={`Move ${social.name} down`}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-30"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSocial(social.id)}
                    title={social.enabled ? "Hide icon" : "Show icon"}
                    aria-label={social.enabled ? "Hide icon" : "Show icon"}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                  >
                    {social.enabled ? (
                      <Eye size={17} />
                    ) : (
                      <EyeOff size={17} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditForm(social)}
                    title="Edit icon"
                    aria-label={`Edit ${social.name}`}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteSocial(social.id)}
                    title="Delete icon"
                    aria-label={`Delete ${social.name}`}
                    className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SAVE SETTINGS */}
        <div className="sticky bottom-4 z-10 flex flex-col justify-between gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:p-5">
          <p className="text-sm text-gray-500">
            Save your changes to publish them to the website.
          </p>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
