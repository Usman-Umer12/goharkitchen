import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

/* =========================================================
   SETTINGS
   ---------------------------------------------------------
   Supabase table: site_marquee  (sirf 1 row, id = 1)
     id         int   (hamesha 1)
     items      jsonb (["Word 1", "Word 2", ...])
     updated_at timestamptz
========================================================= */
const TABLE = "site_marquee";
const ROW_ID = 1;

const DEFAULT_ITEMS = [
  "Bespoke Kitchens",
  "Custom Wardrobes",
  "Luxury Beds",
  "Media Walls",
  "Premium Finishes",
  "Made to Measure",
];

const MAX_ITEMS = 12;
const MAX_LENGTH = 40;

/* =========================================================
   HELPERS
========================================================= */
const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const toRows = (texts) => texts.map((text) => ({ id: makeId(), text }));

const cleanList = (list) =>
  Array.isArray(list)
    ? list
        .map((entry) => (typeof entry === "string" ? entry : entry?.text || ""))
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

/* =========================================================
   LIVE PREVIEW (Home page jaisa marquee)
========================================================= */
const MarqueePreview = ({ words }) => {
  if (words.length === 0) {
    return (
      <div className="flex h-12 items-center justify-center text-[12px] text-white/50">
        Preview ke liye kam az kam ek word likhein
      </div>
    );
  }

  /* Kam words hon to repeat karte hain taake patti poori bhare
     (Home page par bhi aisa hi hota hai) */
  const repeatCount = Math.max(1, Math.ceil(8 / words.length));
  const group = Array.from({ length: repeatCount }).flatMap(() => words);

  return (
    <div
      className="overflow-hidden py-3.5"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%)",
      }}
    >
      <div
        className="flex w-max items-center"
        style={{ animation: "gkAdminMarquee 40s linear infinite" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {group.map((word, index) => (
              <div
                key={`${copy}-${index}-${word}`}
                className="flex items-center gap-7 pr-7"
              >
                <span className="whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.18em] text-white">
                  {word}
                </span>
                <span
                  aria-hidden="true"
                  className="block h-[5px] w-[5px] shrink-0 rotate-45 bg-white/60"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */
const Marquee = () => {
  const [rows, setRows] = useState(() => toRows(DEFAULT_ITEMS));
  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify(DEFAULT_ITEMS)
  );
  const [newWord, setNewWord] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text }

  const texts = useMemo(() => rows.map((row) => row.text), [rows]);
  const isDirty = JSON.stringify(texts.map((t) => t.trim())) !== savedSnapshot;

  const previewWords = useMemo(
    () => texts.map((text) => text.trim()).filter(Boolean),
    [texts]
  );

  /* ---------- Load (Supabase) ---------- */
  const loadItems = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("items")
        .eq("id", ROW_ID)
        .maybeSingle();

      if (error) throw error;

      const items = cleanList(data?.items);
      const finalItems = items.length > 0 ? items : DEFAULT_ITEMS;

      setRows(toRows(finalItems));
      setSavedSnapshot(JSON.stringify(finalItems));
    } catch (error) {
      console.error("Marquee load failed:", error);

      setRows(toRows(DEFAULT_ITEMS));
      setSavedSnapshot(JSON.stringify(DEFAULT_ITEMS));
      setNotice({
        type: "error",
        text: "Saved words load nahi ho sakay. Check karein ke site_marquee table Supabase mein bana hua hai. Abhi default words dikhaye ja rahe hain.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  /* Success message khud hide ho jaye */
  useEffect(() => {
    if (notice?.type !== "success") return;

    const timer = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  /* Unsaved changes ke saath page band karne par warning */
  useEffect(() => {
    if (!isDirty) return;

    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  /* ---------- Edit actions ---------- */
  const updateRow = (id, text) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, text } : row))
    );
  };

  const removeRow = (id) => {
    setRows((current) =>
      current.length <= 1 ? current : current.filter((row) => row.id !== id)
    );
  };

  const moveRow = (index, direction) => {
    setRows((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;

      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addRow = () => {
    const word = newWord.trim();

    if (!word) return;

    if (rows.length >= MAX_ITEMS) {
      setNotice({
        type: "error",
        text: `Zyada se zyada ${MAX_ITEMS} words add ho sakte hain.`,
      });
      return;
    }

    setRows((current) => [...current, { id: makeId(), text: word }]);
    setNewWord("");
    setNotice(null);
  };

  const resetToDefault = () => {
    setRows(toRows(DEFAULT_ITEMS));
    setNotice(null);
  };

  /* ---------- Save (Supabase) ---------- */
  const validate = () => {
    const cleaned = texts.map((text) => text.trim());

    if (cleaned.some((text) => !text)) {
      return "Koi word khali nahi hona chahiye. Khali word delete kar dein ya likh dein.";
    }

    const lower = cleaned.map((text) => text.toLowerCase());
    if (new Set(lower).size !== lower.length) {
      return "Ek hi word do dafa likha hua hai. Duplicate hata dein.";
    }

    return null;
  };

  const handleSave = async () => {
    const problem = validate();

    if (problem) {
      setNotice({ type: "error", text: problem });
      return;
    }

    const cleaned = texts.map((text) => text.trim());

    setSaving(true);
    setNotice(null);

    try {
      const { error } = await supabase.from(TABLE).upsert(
        {
          id: ROW_ID,
          items: cleaned,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) throw error;

      setRows(toRows(cleaned));
      setSavedSnapshot(JSON.stringify(cleaned));
      setNotice({
        type: "success",
        text: "Marquee save ho gaya. Home page par naye words nazar aayenge.",
      });
    } catch (error) {
      console.error("Marquee save failed:", error);

      setNotice({
        type: "error",
        text: "Save nahi ho saka. Dobara login karke try karein, aur check karein ke Supabase mein site_marquee ki policies lagi hui hain.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 font-[Montserrat] text-neutral-900 sm:px-6 sm:py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

        @keyframes gkAdminMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes gkAdminMarquee {
            0%, 100% { transform: none; }
          }
        }
      `}</style>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] sm:text-[26px]">
          Home Page Marquee
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-600">
          Home page par chalne wali patti ke words yahan se change karein. Save
          dabane ke baad website par foran update ho jata hai.
        </p>
      </header>

      {/* Live preview */}
      <section aria-label="Live preview" className="mb-6">
        <div className="mb-2 text-[12px] font-semibold text-neutral-700">
          Live Preview
        </div>
        <div className="overflow-hidden rounded-lg border border-neutral-800 bg-[#0B0A09]">
          <MarqueePreview words={previewWords} />
        </div>
      </section>

      {/* Words list */}
      <section
        aria-label="Marquee words"
        className="rounded-lg border border-neutral-200 bg-white"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 sm:px-5">
          <div className="text-[13px] font-semibold">
            Words{" "}
            <span className="font-normal text-neutral-500">
              ({rows.length}/{MAX_ITEMS})
            </span>
          </div>

          <button
            type="button"
            onClick={resetToDefault}
            disabled={loading || saving}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Default words
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-12 text-[13px] text-neutral-500">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Words load ho rahe hain...
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {rows.map((row, index) => (
              <li
                key={row.id}
                className="flex items-center gap-2 px-3 py-2.5 sm:px-5"
              >
                <span className="w-5 shrink-0 text-center text-[12px] font-medium text-neutral-400">
                  {index + 1}
                </span>

                <input
                  type="text"
                  value={row.text}
                  maxLength={MAX_LENGTH}
                  onChange={(event) => updateRow(row.id, event.target.value)}
                  aria-label={`Word ${index + 1}`}
                  className="min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-[14px] text-neutral-900 outline-none transition-colors focus:border-[#C0652B] focus:ring-2 focus:ring-[#C0652B]/20"
                />

                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    onClick={() => moveRow(index, -1)}
                    disabled={index === 0}
                    aria-label={`Word ${index + 1} upar karein`}
                    className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowUp size={16} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveRow(index, 1)}
                    disabled={index === rows.length - 1}
                    aria-label={`Word ${index + 1} neeche karein`}
                    className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowDown size={16} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length <= 1}
                    aria-label={`Word ${index + 1} delete karein`}
                    className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Add new word */}
        {!loading && (
          <div className="flex items-center gap-2 border-t border-neutral-200 px-3 py-3 sm:px-5">
            <input
              type="text"
              value={newWord}
              maxLength={MAX_LENGTH}
              onChange={(event) => setNewWord(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addRow();
                }
              }}
              placeholder="Naya word likhein, jaise Modern Vanities"
              aria-label="Naya word"
              className="min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-[14px] text-neutral-900 outline-none transition-colors focus:border-[#C0652B] focus:ring-2 focus:ring-[#C0652B]/20"
            />

            <button
              type="button"
              onClick={addRow}
              disabled={!newWord.trim() || rows.length >= MAX_ITEMS}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-neutral-300 px-3.5 py-2 text-[13px] font-medium transition-colors hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Plus size={15} aria-hidden="true" />
              Add
            </button>
          </div>
        )}
      </section>

      {/* Notice */}
      {notice && (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          className={`mt-4 flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-[13px] leading-relaxed ${
            notice.type === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {notice.type === "error" ? (
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <Check size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Save bar */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-[12.5px] text-neutral-500">
          {isDirty ? "Unsaved changes hain" : "Sab kuch saved hai"}
        </span>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading || saving || !isDirty}
          className="inline-flex items-center gap-2 rounded-md bg-[#C0652B] px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#A9561F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C0652B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          ) : (
            <Save size={16} aria-hidden="true" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Marquee;