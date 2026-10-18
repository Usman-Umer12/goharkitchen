import React, { useState } from "react";
import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";

/* =========================================================
   CONTACT DETAILS
========================================================= */

const WHATSAPP_NUMBER = "923007023202";
const PHONE_DISPLAY = "+923007023202";
const PHONE_LINK = "+923007023202";

const services = [
  "Kitchens",
  "Wardrobes",
  "Media Walls",
  "Bedroom Walls",
  "Beds & Furniture",
  "Accessories",
  "Sheets",
  "Corian",
  "Vanities",
  "2D / 3D Design",
];

const initialForm = {
  name: "",
  phone: "",
  address: "",
  city: "",
  country: "Pakistan",
  services: [],
  message: "",
};

/* =========================================================
   PAGE
========================================================= */

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (error) setError("");
  };

  const toggleService = (name) => {
    setForm((previous) => ({
      ...previous,
      services: previous.services.includes(name)
        ? previous.services.filter((item) => item !== name)
        : [...previous.services, name],
    }));
    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your full name.");
    if (!form.phone.trim()) return setError("Please enter your phone number.");
    if (!/^[+()\d\s-]{7,20}$/.test(form.phone.trim()))
      return setError("Please enter a valid phone number.");
    if (!form.address.trim()) return setError("Please enter your address.");
    if (!form.city.trim()) return setError("Please enter your city.");
    if (!form.country.trim()) return setError("Please enter your country.");
    if (form.services.length === 0)
      return setError("Please select at least one service.");

    const message = [
      "Hello Gohar Kitchen Interior!",
      "I would like to discuss a new project.",
      "",
      "CUSTOMER DETAILS",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Address: ${form.address.trim()}`,
      `City: ${form.city.trim()}`,
      `Country: ${form.country.trim()}`,
      "",
      "REQUIRED SERVICES",
      ...form.services.map((service, index) => `${index + 1}. ${service}`),
      ...(form.message.trim()
        ? ["", "ADDITIONAL DETAILS", form.message.trim()]
        : []),
      "",
      "Please contact me to discuss the details.",
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="gk-contact">
      <Styles />

      {/* ---------- PAGE HEADER ---------- */}
      <header className="gk-c-header">
        <div className="gk-c-container">
          <div className="gk-c-eyebrow-row">
            <span className="gk-c-eyebrow-line" />
            <span className="gk-c-eyebrow">Contact Us</span>
          </div>

          <h1 className="gk-c-h1">
            Let&apos;s Discuss <em>Your Project</em>
          </h1>

          <p className="gk-c-lead">
            Share a few details about your space and the services you need. We
            will continue the conversation with you on WhatsApp.
          </p>
        </div>
      </header>

      {/* ---------- FORM + DETAILS ---------- */}
      <section className="gk-c-main">
        <div className="gk-c-container gk-c-grid">
          {/* FORM */}
          <div className="gk-c-card">
            <h2 className="gk-c-h2">Send Your Enquiry</h2>

            <form onSubmit={handleSubmit} noValidate>
              {/* 01 – details */}
              <div className="gk-c-group">
                <div className="gk-c-group-head">
                  <span className="gk-c-step">01</span>
                  <h3>Your Details</h3>
                </div>

                <div className="gk-c-fields">
                  <div className="gk-c-field">
                    <label htmlFor="c-name">Full Name *</label>
                    <input
                      id="c-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>

                  <div className="gk-c-field">
                    <label htmlFor="c-phone">Phone Number *</label>
                    <input
                      id="c-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+92 300 1234567"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>

                  <div className="gk-c-field gk-c-full">
                    <label htmlFor="c-address">Address *</label>
                    <input
                      id="c-address"
                      type="text"
                      autoComplete="street-address"
                      placeholder="House, street, area or society"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                  </div>

                  <div className="gk-c-field">
                    <label htmlFor="c-city">City *</label>
                    <input
                      id="c-city"
                      type="text"
                      autoComplete="address-level2"
                      placeholder="e.g. Lahore"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                    />
                  </div>

                  <div className="gk-c-field">
                    <label htmlFor="c-country">Country *</label>
                    <input
                      id="c-country"
                      type="text"
                      autoComplete="country-name"
                      placeholder="Country"
                      value={form.country}
                      onChange={(e) => updateField("country", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 02 – services */}
              <div className="gk-c-group">
                <div className="gk-c-group-head">
                  <span className="gk-c-step">02</span>
                  <h3>Services Needed</h3>
                </div>

                <div className="gk-c-services">
                  {services.map((name) => {
                    const selected = form.services.includes(name);

                    return (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleService(name)}
                        className={`gk-c-service ${selected ? "is-on" : ""}`}
                      >
                        <span className="gk-c-dot" aria-hidden="true" />
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 03 – message */}
              <div className="gk-c-group">
                <div className="gk-c-group-head">
                  <span className="gk-c-step">03</span>
                  <h3>Project Details</h3>
                </div>

                <div className="gk-c-field">
                  <label htmlFor="c-message">Message (optional)</label>
                  <textarea
                    id="c-message"
                    rows={4}
                    maxLength={1200}
                    placeholder="Tell us about your space, size or any special requirements"
                    value={form.message}
                    onChange={(e) => updateField("message", e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div role="alert" className="gk-c-error">
                  {error}
                </div>
              )}

              <button type="submit" className="gk-c-submit">
                Send Enquiry on WhatsApp
                <ArrowRight size={16} />
              </button>

              <p className="gk-c-note">
                Your details open as a WhatsApp message. You can review it
                before sending.
              </p>
            </form>
          </div>

          {/* DETAILS */}
          <aside className="gk-c-card gk-c-side">
            <h2 className="gk-c-h2">Contact Details</h2>

            <ul className="gk-c-info">
              <li>
                <span className="gk-c-icon">
                  <Phone />
                </span>
                <div>
                  <p className="gk-c-label">Call Us</p>
                  <a href={`tel:${PHONE_LINK}`}>{PHONE_DISPLAY}</a>
                </div>
              </li>

              <li>
                <span className="gk-c-icon">
                  <MessageCircle />
                </span>
                <div>
                  <p className="gk-c-label">WhatsApp</p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat with our team
                  </a>
                </div>
              </li>

              <li>
                <span className="gk-c-icon">
                  <MapPin />
                </span>
                <div>
                  <p className="gk-c-label">Service Area</p>
                  <p className="gk-c-text">Customers across Pakistan</p>
                </div>
              </li>
            </ul>

            <div className="gk-c-links">
              <a href="/kitchen">Kitchen</a>
              <a href="/wardrobe">Wardrobe</a>
              <a href="/media-walls">Media Walls</a>
              <a href="/projects">Our Projects</a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   STYLES
========================================================= */

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500;600&display=swap');

      .gk-contact {
        --gk-display: 'Cormorant Garamond', Georgia, serif;
        --gk-sans: 'Jost', Arial, sans-serif;
        --gk-bg: #0A0A0A;
        --gk-bg-alt: #0F0E0D;
        --gk-card: #121110;
        --gk-field: #181614;
        --gk-accent: #C0652B;
        --gk-accent-soft: #E08A4F;
        --gk-border: rgba(255,255,255,.12);
        min-height: 100vh;
        background: var(--gk-bg);
        color: #fff;
        font-family: var(--gk-sans);
        -webkit-font-smoothing: antialiased;
      }

      .gk-contact *,
      .gk-contact *::before,
      .gk-contact *::after {
        box-sizing: border-box;
      }

      .gk-c-container {
        width: min(100% - 48px, 1200px);
        margin-inline: auto;
      }

      /* ---------- Header ---------- */
      .gk-c-header {
        padding: 150px 0 56px;
        background: var(--gk-bg-alt);
        border-bottom: 1px solid var(--gk-border);
      }

      .gk-c-eyebrow-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .gk-c-eyebrow-line {
        width: 32px;
        height: 1px;
        background: var(--gk-accent);
      }

      .gk-c-eyebrow {
        font-size: 11px;
        font-weight: 500;
        letter-spacing: .24em;
        text-transform: uppercase;
        color: var(--gk-accent-soft);
      }

      .gk-c-h1 {
        margin: 0;
        font-family: var(--gk-display);
        font-weight: 500;
        font-size: clamp(1.35rem, 7vw, 3.25rem);
        line-height: 1.1;
        letter-spacing: -.01em;
        white-space: nowrap;
        color: #fff;
      }

      .gk-c-h1 em {
        font-style: italic;
        color: var(--gk-accent-soft);
      }

      .gk-c-lead {
        max-width: 520px;
        margin: 18px 0 0;
        font-size: 15px;
        font-weight: 300;
        line-height: 1.8;
        color: rgba(255,255,255,.65);
      }

      /* ---------- Layout ---------- */
      .gk-c-main {
        padding: 64px 0 96px;
      }

      .gk-c-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(0, .8fr);
        align-items: start;
        gap: 28px;
      }

      .gk-c-card {
        padding: 36px;
        border: 1px solid var(--gk-border);
        border-radius: 4px;
        background: var(--gk-card);
      }

      .gk-c-h2 {
        margin: 0 0 28px;
        font-family: var(--gk-display);
        font-weight: 500;
        font-size: clamp(1.4rem, 5.4vw, 2rem);
        line-height: 1.15;
        white-space: nowrap;
        color: #fff;
      }

      /* ---------- Form ---------- */
      .gk-c-group {
        margin-bottom: 30px;
      }

      .gk-c-group-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 18px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--gk-border);
      }

      .gk-c-step {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .16em;
        color: var(--gk-accent-soft);
      }

      .gk-c-group-head h3 {
        margin: 0;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: .14em;
        text-transform: uppercase;
        white-space: nowrap;
        color: rgba(255,255,255,.85);
      }

      .gk-c-fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .gk-c-full {
        grid-column: 1 / -1;
      }

      .gk-c-field label {
        display: block;
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: .03em;
        color: rgba(255,255,255,.75);
      }

      .gk-c-field input,
      .gk-c-field textarea {
        width: 100%;
        min-width: 0;
        padding: 0 16px;
        border: 1px solid var(--gk-border);
        border-radius: 3px;
        outline: none;
        background: var(--gk-field);
        color: #fff;
        font-family: var(--gk-sans);
        font-size: 14px;
        font-weight: 400;
        transition: border-color .25s ease;
      }

      .gk-c-field input {
        height: 50px;
      }

      .gk-c-field textarea {
        display: block;
        min-height: 120px;
        padding: 14px 16px;
        line-height: 1.6;
        resize: vertical;
      }

      .gk-c-field input::placeholder,
      .gk-c-field textarea::placeholder {
        color: rgba(255,255,255,.3);
      }

      .gk-c-field input:focus,
      .gk-c-field textarea:focus {
        border-color: var(--gk-accent);
      }

      /* ---------- Services ---------- */
      .gk-c-services {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      .gk-c-service {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 46px;
        padding: 0 14px;
        border: 1px solid var(--gk-border);
        border-radius: 3px;
        background: var(--gk-field);
        color: rgba(255,255,255,.75);
        font-family: var(--gk-sans);
        font-size: 13px;
        font-weight: 400;
        text-align: left;
        white-space: nowrap;
        cursor: pointer;
        transition: border-color .25s ease, color .25s ease, background-color .25s ease;
      }

      .gk-c-service:hover {
        border-color: rgba(224,138,79,.5);
        color: #fff;
      }

      .gk-c-service.is-on {
        border-color: var(--gk-accent);
        background: rgba(192,101,43,.1);
        color: #fff;
      }

      .gk-c-dot {
        flex: 0 0 8px;
        width: 8px;
        height: 8px;
        border: 1px solid rgba(255,255,255,.35);
        border-radius: 50%;
        transition: background-color .25s ease, border-color .25s ease;
      }

      .gk-c-service.is-on .gk-c-dot {
        border-color: var(--gk-accent);
        background: var(--gk-accent);
      }

      /* ---------- Error / submit ---------- */
      .gk-c-error {
        margin-bottom: 18px;
        padding: 12px 16px;
        border: 1px solid rgba(248,113,113,.3);
        border-radius: 3px;
        background: rgba(248,113,113,.07);
        font-size: 13px;
        line-height: 1.5;
        color: #fecaca;
      }

      .gk-c-submit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        height: 50px;
        padding: 0 32px;
        border: 1px solid var(--gk-accent);
        border-radius: 999px;
        background: var(--gk-accent);
        color: #fff;
        font-family: var(--gk-sans);
        font-size: 12px;
        font-weight: 500;
        letter-spacing: .13em;
        text-transform: uppercase;
        white-space: nowrap;
        cursor: pointer;
        transition: background-color .3s ease, border-color .3s ease;
      }

      .gk-c-submit:hover {
        border-color: #D2743A;
        background: #D2743A;
      }

      .gk-c-note {
        margin: 16px 0 0;
        font-size: 12px;
        font-weight: 300;
        line-height: 1.6;
        color: rgba(255,255,255,.45);
      }

      /* ---------- Side details ---------- */
      .gk-c-info {
        display: grid;
        gap: 0;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .gk-c-info li {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 18px 0;
        border-top: 1px solid var(--gk-border);
      }

      .gk-c-info li:first-child {
        padding-top: 0;
        border-top: 0;
      }

      .gk-c-icon {
        display: inline-flex;
        flex: 0 0 42px;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border: 1px solid rgba(192,101,43,.45);
        color: var(--gk-accent-soft);
      }

      .gk-c-icon svg {
        width: 18px;
        height: 18px;
        stroke-width: 1.4;
      }

      .gk-c-label {
        margin: 0 0 4px;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: .16em;
        text-transform: uppercase;
        color: rgba(255,255,255,.45);
      }

      .gk-c-info a,
      .gk-c-text {
        margin: 0;
        font-size: 15px;
        font-weight: 400;
        text-decoration: none;
        color: #fff;
        transition: color .25s ease;
      }

      .gk-c-info a:hover {
        color: var(--gk-accent-soft);
      }

      .gk-c-links {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 22px;
        margin-top: 8px;
        padding-top: 22px;
        border-top: 1px solid var(--gk-border);
      }

      .gk-c-links a {
        font-size: 11px;
        font-weight: 500;
        letter-spacing: .16em;
        text-transform: uppercase;
        text-decoration: none;
        color: rgba(255,255,255,.5);
        transition: color .25s ease;
      }

      .gk-c-links a:hover {
        color: var(--gk-accent-soft);
      }

      /* ---------- Desktop: full width ---------- */
      @media (min-width: 1024px) {
        .gk-c-container {
          width: calc(100% - 80px);
          max-width: none;
        }

        .gk-c-h1 {
          font-size: clamp(2.6rem, 4vw, 4rem);
        }

        .gk-c-lead {
          max-width: 620px;
          font-size: 16px;
        }

        .gk-c-header {
          padding: 160px 0 64px;
        }

        .gk-c-main {
          padding: 72px 0 104px;
        }

        .gk-c-grid {
          grid-template-columns: minmax(0, 1.7fr) minmax(0, .8fr);
          gap: 32px;
        }

        .gk-c-card {
          padding: 44px;
        }

        .gk-c-side {
          position: sticky;
          top: 120px;
        }
      }

      @media (min-width: 1280px) {
        .gk-c-container {
          width: calc(100% - 112px);
        }

        .gk-c-services {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }

      @media (min-width: 1536px) {
        .gk-c-container {
          width: calc(100% - 160px);
        }
      }

      /* ---------- Tablet ---------- */
      @media (max-width: 1023px) {
        .gk-c-header {
          padding: 130px 0 48px;
        }

        .gk-c-main {
          padding: 48px 0 80px;
        }

        .gk-c-grid {
          grid-template-columns: minmax(0, 1fr);
        }

        .gk-c-services {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      /* ---------- Mobile ---------- */
      @media (max-width: 640px) {
        .gk-c-container {
          width: calc(100% - 32px);
        }

        .gk-c-header {
          padding: 108px 0 36px;
        }

        .gk-c-lead {
          font-size: 14px;
        }

        .gk-c-main {
          padding: 32px 0 64px;
        }

        .gk-c-card {
          padding: 22px 18px;
        }

        .gk-c-h2 {
          margin-bottom: 22px;
        }

        .gk-c-fields {
          grid-template-columns: minmax(0, 1fr);
          gap: 16px;
        }

        .gk-c-services {
          gap: 8px;
        }

        .gk-c-service {
          min-height: 44px;
          padding: 0 10px;
          gap: 8px;
          font-size: 12px;
        }

        .gk-c-submit {
          width: 100%;
          padding: 0 16px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .gk-contact * {
          transition-duration: .01ms !important;
        }
      }
    `}</style>
  );
}