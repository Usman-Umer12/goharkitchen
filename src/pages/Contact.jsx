import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  CircleAlert,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const WHATSAPP_NUMBER = "923007023202";
const PHONE_DISPLAY = "+92 300 7023202";
const PHONE_LINK = "+923007023202";
const MESSAGE_LIMIT = 1200;

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

const quickLinks = [
  { label: "Kitchen", href: "/kitchen" },
  { label: "Wardrobe", href: "/wordrobe" },
  { label: "Media Walls", href: "/media-walls" },
  { label: "About Us", href: "/about" },
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

const fieldOrder = ["name", "phone", "address", "city", "country"];

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Please enter your full name.";
  if (!form.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!/^[+()\d\s-]{7,20}$/.test(form.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!form.address.trim()) errors.address = "Please enter your address.";
  if (!form.city.trim()) errors.city = "Please enter your city.";
  if (!form.country.trim()) errors.country = "Please enter your country.";
  if (!form.services.length) errors.services = "Please select at least one service.";
  return errors;
};

function TextField({ id, label, error, full = false, required = true, ...props }) {
  return (
    <div className={`gk-c-field ${full ? "gk-c-full" : ""}`}>
      <label htmlFor={id}>
        {label}{required && <span className="gk-c-required" aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={error ? "has-error" : ""}
        {...props}
      />
      {error && <p id={`${id}-error`} className="gk-c-field-error">{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [opened, setOpened] = useState(false);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
    }
    if (opened) setOpened(false);
  };

  const toggleService = (name) => {
    setForm((previous) => ({
      ...previous,
      services: previous.services.includes(name)
        ? previous.services.filter((item) => item !== name)
        : [...previous.services, name],
    }));
    if (errors.services) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next.services;
        return next;
      });
    }
    if (opened) setOpened(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);

    if (Object.keys(found).length) {
      const firstField = fieldOrder.find((field) => found[field]);
      if (firstField) {
        document.getElementById(`c-${firstField}`)?.focus();
      } else {
        document.getElementById("c-services")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

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
      ...(form.message.trim() ? ["", "ADDITIONAL DETAILS", form.message.trim()] : []),
      "",
      "Please contact me to discuss the details.",
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpened(true);
  };

  return (
    <main className="gk-contact">
      <Styles />
      <header className="gk-c-header">
        <div className="gk-c-container">
          <div className="gk-c-eyebrow-row">
            <span className="gk-c-eyebrow-line" />
            <span className="gk-c-eyebrow">Contact Us</span>
          </div>
          <h1 className="gk-c-h1">Let&apos;s Discuss <em>Your Project</em></h1>
          <p className="gk-c-lead">
            Share a few details about your space and the services you need. We will continue the conversation with you on WhatsApp.
          </p>
        </div>
      </header>

      <section className="gk-c-main">
        <div className="gk-c-container gk-c-grid">
          <div className="gk-c-card">
            <div className="gk-c-card-head">
              <h2 className="gk-c-h2">Send Your Enquiry</h2>
              <p className="gk-c-card-sub">Fields marked with * are required.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <fieldset className="gk-c-group">
                <legend className="gk-c-group-head">
                  <span className="gk-c-step">01</span>
                  <span className="gk-c-group-title">Your Details</span>
                </legend>
                <div className="gk-c-fields">
                  <TextField id="c-name" label="Full Name" type="text" autoComplete="name" placeholder="Your full name" value={form.name} error={errors.name} onChange={(e) => updateField("name", e.target.value)} />
                  <TextField id="c-phone" label="Phone Number" type="tel" inputMode="tel" autoComplete="tel" placeholder="+92 300 1234567" value={form.phone} error={errors.phone} onChange={(e) => updateField("phone", e.target.value)} />
                  <TextField id="c-address" label="Address" full type="text" autoComplete="street-address" placeholder="House, street, area or society" value={form.address} error={errors.address} onChange={(e) => updateField("address", e.target.value)} />
                  <TextField id="c-city" label="City" type="text" autoComplete="address-level2" placeholder="e.g. Lahore" value={form.city} error={errors.city} onChange={(e) => updateField("city", e.target.value)} />
                  <TextField id="c-country" label="Country" type="text" autoComplete="country-name" placeholder="Country" value={form.country} error={errors.country} onChange={(e) => updateField("country", e.target.value)} />
                </div>
              </fieldset>

              <fieldset className="gk-c-group" id="c-services">
                <legend className="gk-c-group-head">
                  <span className="gk-c-step">02</span>
                  <span className="gk-c-group-title">Services Needed <span className="gk-c-required">*</span></span>
                  <span className="gk-c-count" aria-live="polite">{form.services.length ? `${form.services.length} selected` : "Select one or more"}</span>
                </legend>
                <div className="gk-c-services">
                  {services.map((name) => {
                    const selected = form.services.includes(name);
                    return (
                      <button key={name} type="button" aria-pressed={selected} onClick={() => toggleService(name)} className={`gk-c-service ${selected ? "is-on" : ""}`}>
                        <span className="gk-c-check" aria-hidden="true">{selected && <Check size={11} strokeWidth={3} />}</span>
                        {name}
                      </button>
                    );
                  })}
                </div>
                {errors.services && <p className="gk-c-field-error gk-c-services-error">{errors.services}</p>}
              </fieldset>

              <fieldset className="gk-c-group">
                <legend className="gk-c-group-head">
                  <span className="gk-c-step">03</span>
                  <span className="gk-c-group-title">Project Details</span>
                </legend>
                <div className="gk-c-field">
                  <label htmlFor="c-message">Message (optional)</label>
                  <textarea id="c-message" rows={4} maxLength={MESSAGE_LIMIT} placeholder="Tell us about your space, size or any special requirements" value={form.message} onChange={(e) => updateField("message", e.target.value)} />
                  <p className="gk-c-counter">{form.message.length} / {MESSAGE_LIMIT}</p>
                </div>
              </fieldset>

              {Object.keys(errors).length > 0 && (
                <div role="alert" className="gk-c-alert"><CircleAlert size={16} aria-hidden="true" /><span>Please complete the highlighted fields to continue.</span></div>
              )}
              {opened && (
                <div role="status" className="gk-c-success"><Check size={16} aria-hidden="true" /><span>WhatsApp has opened with your enquiry. Please press send in WhatsApp to share it with our team.</span></div>
              )}

              <div className="gk-c-actions">
                <button type="submit" className="gk-c-submit">Send Enquiry on WhatsApp <ArrowRight size={16} aria-hidden="true" /></button>
                <p className="gk-c-note">Your details open as a WhatsApp message. You can review it before sending.</p>
              </div>
            </form>
          </div>

          <aside className="gk-c-card gk-c-side">
            <h2 className="gk-c-h2">Contact Details</h2>
            <ul className="gk-c-info">
              <li>
                <span className="gk-c-icon"><Phone aria-hidden="true" /></span>
                <div><p className="gk-c-label">Call Us</p><a href={`tel:${PHONE_LINK}`}>{PHONE_DISPLAY}</a></div>
              </li>
              <li>
                <span className="gk-c-icon"><MessageCircle aria-hidden="true" /></span>
                <div><p className="gk-c-label">WhatsApp</p><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">Chat with our team</a></div>
              </li>
              <li>
                <span className="gk-c-icon"><MapPin aria-hidden="true" /></span>
                <div><p className="gk-c-label">Service Area</p><p className="gk-c-text">Customers across Pakistan</p></div>
              </li>
            </ul>
            <nav className="gk-c-links" aria-label="Explore our work">
              {quickLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
            </nav>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600;700&display=swap');

      .gk-contact {
        --gk-display: 'Cormorant Garamond', Georgia, serif;
        --gk-sans: 'Jost', system-ui, -apple-system, 'Segoe UI', sans-serif;
        --gk-bg: #0A0A0A;
        --gk-bg-alt: #0F0E0D;
        --gk-card: #121110;
        --gk-field: #181614;
        --gk-accent: #C0652B;
        --gk-accent-hover: #D47A3E;
        --gk-border: rgba(255,255,255,.14);
        --gk-border-strong: rgba(255,255,255,.28);
        --gk-error: #F87171;
        min-height: 100vh;
        background: var(--gk-bg);
        color: #fff;
        font-family: var(--gk-sans);
        -webkit-font-smoothing: antialiased;
      }
      .gk-contact *, .gk-contact *::before, .gk-contact *::after { box-sizing: border-box; font-family: var(--gk-sans); }
      .gk-contact .gk-c-h1, .gk-contact .gk-c-h2 { font-family: var(--gk-display); }
      .gk-c-container { width: min(100% - 48px, 1200px); margin-inline: auto; }

      .gk-c-header { padding: 150px 0 56px; background: var(--gk-bg-alt); border-bottom: 1px solid var(--gk-border); }
      .gk-c-eyebrow-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
      .gk-c-eyebrow-line { width: 32px; height: 1px; background: var(--gk-accent); }
      .gk-c-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--gk-accent); }
      .gk-c-h1 { margin: 0; font-weight: 500; font-size: clamp(2.3rem, 5.2vw, 4.2rem); line-height: 1.02; letter-spacing: -.025em; color: #fff; }
      .gk-c-h1 em { font-style: normal; font-weight: 500; color: var(--gk-accent); }
      .gk-c-lead { max-width: 560px; margin: 18px 0 0; font-size: 14.5px; font-weight: 400; line-height: 1.85; color: rgba(255,255,255,.7); }

      .gk-c-main { padding: 64px 0 96px; }
      .gk-c-grid { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, .8fr); align-items: start; gap: 28px; }
      .gk-c-card { min-width: 0; padding: 36px; border: 1px solid var(--gk-border); border-radius: 5px; background: var(--gk-card); }
      .gk-c-card-head { margin-bottom: 30px; }
      .gk-c-h2 { margin: 0 0 28px; font-weight: 600; font-size: clamp(1.8rem, 3vw, 2.35rem); line-height: 1.08; letter-spacing: -.01em; color: #fff; }
      .gk-c-card-head .gk-c-h2 { margin-bottom: 8px; }
      .gk-c-card-sub { margin: 0; font-size: 12.5px; color: rgba(255,255,255,.5); }

      .gk-c-group { min-width: 0; margin: 0 0 32px; padding: 0; border: 0; }
      .gk-c-group-head { display: flex; align-items: center; gap: 12px; width: 100%; margin: 0 0 18px; padding: 0 0 12px; border-bottom: 1px solid var(--gk-border); }
      .gk-c-step { color: var(--gk-accent); font-size: 11px; font-weight: 700; letter-spacing: .14em; }
      .gk-c-group-title { font-size: 12px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.9); }
      .gk-c-count { margin-left: auto; font-size: 11.5px; font-weight: 500; color: rgba(255,255,255,.5); }
      .gk-c-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
      .gk-c-full { grid-column: 1 / -1; }
      .gk-c-field { min-width: 0; }
      .gk-c-field label { display: block; margin-bottom: 8px; font-size: 12px; font-weight: 500; letter-spacing: .02em; color: rgba(255,255,255,.82); }
      .gk-c-required { color: var(--gk-accent); }
      .gk-c-field input, .gk-c-field textarea { width: 100%; min-width: 0; padding: 0 16px; border: 1px solid var(--gk-border); border-radius: 3px; outline: none; background: var(--gk-field); color: #fff; font-size: 14px; font-weight: 400; transition: border-color .25s ease, box-shadow .25s ease; }
      .gk-c-field input { height: 50px; }
      .gk-c-field textarea { display: block; min-height: 120px; padding: 14px 16px; line-height: 1.6; resize: vertical; }
      .gk-c-field input::placeholder, .gk-c-field textarea::placeholder { color: rgba(255,255,255,.32); }
      .gk-c-field input:hover, .gk-c-field textarea:hover { border-color: var(--gk-border-strong); }
      .gk-c-field input:focus, .gk-c-field textarea:focus { border-color: var(--gk-accent); box-shadow: 0 0 0 3px rgba(192,101,43,.12); }
      .gk-c-field input.has-error { border-color: var(--gk-error); }
      .gk-c-field-error { margin: 7px 0 0; font-size: 12px; font-weight: 500; line-height: 1.4; color: var(--gk-error); }
      .gk-c-counter { margin: 6px 0 0; font-size: 11px; text-align: right; color: rgba(255,255,255,.4); }

      .gk-c-services { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
      .gk-c-services-error { margin-top: 12px; }
      .gk-c-service { display: flex; align-items: center; gap: 10px; min-height: 46px; padding: 0 14px; border: 1px solid var(--gk-border); border-radius: 3px; background: var(--gk-field); color: rgba(255,255,255,.78); font-size: 13px; font-weight: 500; text-align: left; cursor: pointer; transition: border-color .25s ease, color .25s ease, background-color .25s ease; }
      .gk-c-service:hover { border-color: rgba(192,101,43,.65); color: #fff; }
      .gk-c-service:focus-visible, .gk-c-submit:focus-visible, .gk-c-info a:focus-visible, .gk-c-links a:focus-visible { outline: 2px solid var(--gk-accent); outline-offset: 3px; }
      .gk-c-service.is-on { border-color: var(--gk-accent); background: rgba(192,101,43,.09); color: #fff; }
      .gk-c-check { display: inline-flex; flex: 0 0 16px; align-items: center; justify-content: center; width: 16px; height: 16px; border: 1px solid rgba(255,255,255,.4); border-radius: 2px; color: #111; transition: background-color .25s ease, border-color .25s ease; }
      .gk-c-service.is-on .gk-c-check { border-color: var(--gk-accent); background: var(--gk-accent); }

      .gk-c-alert, .gk-c-success { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; padding: 12px 16px; border-radius: 3px; font-size: 13px; line-height: 1.55; }
      .gk-c-alert svg, .gk-c-success svg { flex: 0 0 auto; margin-top: 2px; }
      .gk-c-alert { border: 1px solid rgba(248,113,113,.35); background: rgba(248,113,113,.08); color: #fecaca; }
      .gk-c-success { border: 1px solid rgba(192,101,43,.35); background: rgba(192,101,43,.07); color: #fff; }
      .gk-c-success svg { color: var(--gk-accent); }

      .gk-c-actions { display: flex; flex-direction: column; align-items: flex-start; }
      .gk-c-submit { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 50px; padding: 0 30px; border: 1px solid #fff; border-radius: 999px; background: #fff; color: #111; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; transition: background-color .25s ease, border-color .25s ease, color .25s ease; }
      .gk-c-submit svg { color: var(--gk-accent); transition: transform .25s ease; }
      .gk-c-submit:hover { border-color: var(--gk-accent); background: var(--gk-accent); color: #fff; }
      .gk-c-submit:hover svg { color: #fff; transform: translateX(3px); }
      .gk-c-note { margin: 16px 0 0; font-size: 12px; line-height: 1.6; color: rgba(255,255,255,.5); }

      .gk-c-info { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; }
      .gk-c-info li { display: flex; align-items: center; gap: 16px; padding: 18px 0; border-top: 1px solid var(--gk-border); }
      .gk-c-info li:first-child { padding-top: 0; border-top: 0; }
      .gk-c-icon { display: inline-flex; flex: 0 0 42px; align-items: center; justify-content: center; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.24); border-radius: 50%; color: var(--gk-accent); }
      .gk-c-icon svg { width: 18px; height: 18px; stroke-width: 1.5; }
      .gk-c-label { margin: 0 0 4px; font-size: 10.5px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.5); }
      .gk-c-info a, .gk-c-text { margin: 0; font-size: 14.5px; font-weight: 500; text-decoration: none; color: #fff; transition: color .25s ease; }
      .gk-c-info a:hover { color: var(--gk-accent); }
      .gk-c-links { display: flex; flex-wrap: wrap; gap: 10px 22px; margin-top: 8px; padding-top: 22px; border-top: 1px solid var(--gk-border); }
      .gk-c-links a { font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; text-decoration: none; color: rgba(255,255,255,.55); transition: color .25s ease; }
      .gk-c-links a:hover { color: var(--gk-accent); }

      @media (min-width: 1024px) {
        .gk-c-container { width: calc(100% - 80px); max-width: 1440px; }
        .gk-c-header { padding: 160px 0 64px; }
        .gk-c-main { padding: 72px 0 104px; }
        .gk-c-grid { grid-template-columns: minmax(0, 1.7fr) minmax(0, .8fr); gap: 32px; }
        .gk-c-card { padding: 44px; }
        .gk-c-side { position: sticky; top: 120px; }
      }
      @media (min-width: 1280px) { .gk-c-container { width: calc(100% - 112px); } .gk-c-services { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
      @media (min-width: 1536px) { .gk-c-container { width: calc(100% - 160px); } }
      @media (max-width: 1023px) {
        .gk-c-header { padding: 130px 0 48px; }
        .gk-c-main { padding: 48px 0 80px; }
        .gk-c-grid { grid-template-columns: minmax(0, 1fr); }
        .gk-c-services { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 640px) {
        .gk-c-container { width: calc(100% - 32px); }
        .gk-c-header { padding: 108px 0 36px; }
        .gk-c-h1 { font-size: clamp(2.15rem, 9vw, 3rem); line-height: 1.04; }
        .gk-c-lead { font-size: 13.5px; }
        .gk-c-main { padding: 32px 0 64px; }
        .gk-c-card { padding: 22px 18px; }
        .gk-c-card-head { margin-bottom: 24px; }
        .gk-c-h2 { margin-bottom: 22px; }
        .gk-c-fields { grid-template-columns: minmax(0, 1fr); gap: 16px; }
        .gk-c-count { display: none; }
        .gk-c-services { gap: 8px; }
        .gk-c-service { min-height: 44px; padding: 0 10px; gap: 8px; font-size: 12px; }
        .gk-c-actions { align-items: stretch; }
        .gk-c-submit { width: 100%; padding: 0 16px; font-size: 10px; letter-spacing: .07em; }
      }
      @media (max-width: 360px) { .gk-c-container { width: calc(100% - 26px); } .gk-c-card { padding: 18px 14px; } .gk-c-service { font-size: 11px; padding-inline: 8px; } }
      @media (prefers-reduced-motion: reduce) { .gk-contact * { transition-duration: .01ms !important; scroll-behavior: auto !important; } }
    `}</style>
  );
}
