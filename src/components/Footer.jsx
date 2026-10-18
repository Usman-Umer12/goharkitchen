
import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const mainLinks = [
  { title: "Home", href: "/" },
  { title: "Kitchen", href: "/kitchen" },
  { title: "Wardrobe", href: "/wordrobe" },
  { title: "Media Walls", href: "/media-walls" },
  { title: "Bedroom Walls", href: "/bedroom-walls" },
  { title: "About Us", href: "/about" },
];

/* =========================================================
   CUSTOM SOCIAL SVG ICONS
   Facebook, Instagram, TikTok and YouTube
   do not depend on lucide-react brand exports.
========================================================= */

function SocialSVG({ type, size = 17 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    focusable: "false",
  };

  switch ((type || "").toLowerCase().trim()) {
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
          <path d="m10 8.5 6 3.5-6 3.5v-7Z" fill="#0A0A0A" />
        </svg>
      );

    default:
      return null;
  }
}

const iconMap = {
  facebook: SocialSVG,
  instagram: SocialSVG,
  tiktok: SocialSVG,
  youtube: SocialSVG,
  whatsapp: MessageCircle,
  globe: Globe,
};

const DEFAULT_FOOTER = {
  phone_one: "+923007023202",
  phone_two: "",
  email: "Goharkitcheninterior@gmail.com",
  location: "Faisalabad, Pakistan",
  description:
    "We create beautifully designed kitchens, wardrobes, media walls and bespoke interiors that combine modern aesthetics, everyday functionality and quality craftsmanship.",
  quote_text: "Get a Quote",
  quote_link: "/contact",
  socials: [
    {
      id: "instagram",
      name: "Instagram",
      icon: "instagram",
      url: "https://www.instagram.com/goharkitcheninterior/",
      enabled: true,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "facebook",
      url: "https://www.facebook.com/share/19YWSVYAeQ/",
      enabled: true,
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "tiktok",
      url: "",
      enabled: false,
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "youtube",
      url: "",
      enabled: false,
    },
  ],
};

function getPhoneHref(value = "") {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

function normalizeFooter(data) {
  return {
    ...DEFAULT_FOOTER,
    ...data,
    socials: Array.isArray(data?.socials)
      ? data.socials.map((social, index) => ({
          id: social.id || `${social.name || "social"}-${index}`,
          name: social.name || "Social Media",
          icon: social.icon || "globe",
          url: social.url || "",
          enabled: social.enabled !== false,
        }))
      : DEFAULT_FOOTER.socials,
  };
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [footerData, setFooterData] = useState(DEFAULT_FOOTER);

  useEffect(() => {
    let active = true;

    async function loadFooterSettings() {
      const { data, error } = await supabase
        .from("footer_settings")
        .select(
          "phone_one, phone_two, email, location, description, quote_text, quote_link, socials"
        )
        .eq("id", 1)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error(
          "Unable to load footer settings:",
          error.message
        );
        return;
      }

      if (data) {
        setFooterData(normalizeFooter(data));
      }
    }

    loadFooterSettings();

    return () => {
      active = false;
    };
  }, []);

  const footer = footerData;

  return (
    <footer className="gk-footer">
      <Styles />

      <div className="gk-f-container">
        <div className="gk-f-cta">
          <div className="gk-f-cta-text">
            <h2>Ready to transform your space?</h2>
            <p>
              Get a consultation and a custom quote for your interior.
            </p>
          </div>

          <a
            href={footer.quote_link || "/contact"}
            className="gk-f-btn"
          >
            {footer.quote_text || "Get a Quote"}
            <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="gk-f-grid">
          <div className="gk-f-brand">
            <a
              href="/"
              aria-label="Gohar Kitchen Interior - Home"
              className="gk-f-logo"
            >
              <span className="gk-f-logo-name">
                <span>GOHAR</span> KITCHEN
              </span>

              <span className="gk-f-logo-sub">
                <i />
                Interior
                <i />
              </span>
            </a>

            <p className="gk-f-about">{footer.description}</p>

            <div className="gk-f-socials">
              {(footer.socials || [])
                .filter((social) => social.enabled && social.url)
                .map((social, index) => {
                  const iconName = (
                    social.icon || "globe"
                  ).toLowerCase();

                  const Icon = iconMap[iconName] || Globe;

                  return (
                    <a
                      key={social.id || `${iconName}-${index}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                    >
                      {[
                        "facebook",
                        "instagram",
                        "tiktok",
                        "youtube",
                      ].includes(iconName) ? (
                        <Icon type={iconName} size={17} />
                      ) : (
                        <Icon size={17} />
                      )}
                    </a>
                  );
                })}
            </div>
          </div>

          <nav
            aria-label="Quick links"
            className="gk-f-links"
          >
            <h3 className="gk-f-heading">Quick Links</h3>

            <ul className="gk-f-list">
              {mainLinks.map((link) => (
                <li key={link.title}>
                  <a href={link.href}>{link.title}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="gk-f-contact">
            <h3 className="gk-f-heading">Contact Us</h3>

            <ul className="gk-f-info">
              <li>
                <span className="gk-f-icon">
                  <Phone />
                </span>

                <div>
                  <p>Call Us</p>

                  {footer.phone_one?.trim() && (
                    <a href={getPhoneHref(footer.phone_one)}>
                      {footer.phone_one}
                    </a>
                  )}

                  {footer.phone_two?.trim() && (
                    <a
                      href={getPhoneHref(footer.phone_two)}
                      style={{
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      {footer.phone_two}
                    </a>
                  )}
                </div>
              </li>

              <li>
                <span className="gk-f-icon">
                  <Mail />
                </span>

                <div>
                  <p>Email Us</p>

                  {footer.email?.trim() && (
                    <a href={`mailto:${footer.email}`}>
                      {footer.email}
                    </a>
                  )}
                </div>
              </li>

              <li>
                <span className="gk-f-icon">
                  <MapPin />
                </span>

                <div>
                  <p>Location</p>
                  <span>{footer.location}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="gk-f-bottom">
          <p>
            © {year} Gohar Kitchen Interior. All Rights Reserved.
          </p>

          <div className="gk-f-bottom-links">
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500;600&display=swap');

      .gk-footer {
        --gk-display: 'Cormorant Garamond', Georgia, serif;
        --gk-sans: 'Jost', Arial, sans-serif;
        --gk-accent: #C0652B;
        --gk-accent-soft: #E08A4F;
        --gk-border: rgba(255,255,255,.12);
        width: 100%;
        max-width: 100%;
        margin: 0;
        overflow-x: hidden;
        border-top: 1px solid var(--gk-border);
        background: #0A0A0A;
        color: #fff;
        font-family: var(--gk-sans);
      }

      .gk-footer *,
      .gk-footer *::before,
      .gk-footer *::after {
        box-sizing: border-box;
      }

      .gk-footer a {
        text-decoration: none;
      }

      .gk-f-container {
        width: 100%;
        max-width: none;
        margin: 0;
        padding-inline: clamp(1.25rem, 4vw, 4.5rem);
      }

      .gk-f-cta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
        padding: 44px 0;
        border-bottom: 1px solid var(--gk-border);
      }

      .gk-f-cta-text {
        min-width: 0;
      }

      .gk-f-cta-text h2 {
        margin: 0;
        font-family: var(--gk-display);
        font-weight: 500;
        font-size: clamp(25px, 3vw, 38px);
        line-height: 1.15;
        color: #fff;
      }

      .gk-f-cta-text p {
        margin: 9px 0 0;
        font-size: 14px;
        font-weight: 300;
        line-height: 1.7;
        color: rgba(255,255,255,.6);
      }

      .gk-f-btn {
        display: inline-flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 48px;
        padding: 0 28px;
        border: 1px solid var(--gk-accent);
        border-radius: 999px;
        background: var(--gk-accent);
        color: #fff;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: .12em;
        text-transform: uppercase;
        white-space: nowrap;
        transition: background-color .25s ease, border-color .25s ease;
      }

      .gk-f-btn:hover {
        border-color: #D2743A;
        background: #D2743A;
      }

      .gk-f-grid {
        display: grid;
        grid-template-columns:
          minmax(0, 1.5fr)
          minmax(0, .8fr)
          minmax(0, 1.2fr);
        gap: clamp(32px, 4vw, 72px);
        padding: 58px 0;
      }

      .gk-f-grid > * {
        min-width: 0;
      }

      .gk-f-heading {
        margin: 0 0 21px;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: .17em;
        text-transform: uppercase;
        color: #fff;
      }

      .gk-f-logo {
        display: inline-flex;
        flex-direction: column;
        line-height: 1;
      }

      .gk-f-logo-name {
        font-size: 25px;
        font-weight: 600;
        letter-spacing: .03em;
        color: #fff;
      }

      .gk-f-logo-name span {
        color: var(--gk-accent);
      }

      .gk-f-logo-sub {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        font-size: 8px;
        font-weight: 500;
        letter-spacing: .48em;
        text-transform: uppercase;
        color: rgba(255,255,255,.7);
      }

      .gk-f-logo-sub i {
        flex: 1;
        height: 1px;
        background: rgba(192,101,43,.7);
      }

      .gk-f-about {
        max-width: 440px;
        margin: 22px 0 0;
        font-size: 14px;
        font-weight: 300;
        line-height: 1.85;
        color: rgba(255,255,255,.6);
      }

      .gk-f-socials {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 24px;
      }

      .gk-f-socials a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: 1px solid var(--gk-border);
        border-radius: 50%;
        color: rgba(255,255,255,.75);
        transition:
          color .25s ease,
          border-color .25s ease,
          background-color .25s ease;
      }

      .gk-f-socials a:hover {
        border-color: var(--gk-accent);
        background: var(--gk-accent);
        color: #fff;
      }

      .gk-f-socials svg {
        display: block;
        flex-shrink: 0;
      }

      .gk-f-list {
        display: grid;
        gap: 13px;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .gk-f-list a {
        display: inline-block;
        font-size: 14px;
        font-weight: 300;
        line-height: 1.6;
        color: rgba(255,255,255,.65);
        transition: color .25s ease, transform .25s ease;
      }

      .gk-f-list a:hover {
        color: var(--gk-accent-soft);
        transform: translateX(3px);
      }

      .gk-f-info {
        display: grid;
        gap: 19px;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .gk-f-info li {
        display: flex;
        align-items: center;
        gap: 13px;
        min-width: 0;
      }

      .gk-f-icon {
        display: inline-flex;
        flex: 0 0 42px;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border: 1px solid rgba(192,101,43,.45);
        color: var(--gk-accent-soft);
      }

      .gk-f-icon svg {
        width: 17px;
        height: 17px;
        stroke-width: 1.4;
      }

      .gk-f-info li > div {
        min-width: 0;
      }

      .gk-f-info p {
        margin: 0 0 4px;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: .14em;
        text-transform: uppercase;
        color: rgba(255,255,255,.45);
      }

      .gk-f-info a,
      .gk-f-info li > div > span {
        display: inline-block;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.7;
        color: #fff;
        overflow-wrap: anywhere;
        transition: color .25s ease;
      }

      .gk-f-info a:hover {
        color: var(--gk-accent-soft);
      }

      .gk-f-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 23px 0 27px;
        border-top: 1px solid var(--gk-border);
      }

      .gk-f-bottom p {
        margin: 0;
        font-size: 12px;
        font-weight: 300;
        line-height: 1.7;
        color: rgba(255,255,255,.45);
      }

      .gk-f-bottom-links {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
      }

      .gk-f-bottom-links a {
        font-size: 11px;
        font-weight: 500;
        letter-spacing: .12em;
        text-transform: uppercase;
        color: rgba(255,255,255,.55);
        transition: color .25s ease;
      }

      .gk-f-bottom-links a:hover {
        color: var(--gk-accent-soft);
      }

      @media (max-width: 1023px) {
        .gk-f-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 40px 32px;
          padding: 46px 0;
        }

        .gk-f-brand {
          grid-column: 1 / -1;
        }

        .gk-f-about {
          max-width: 560px;
        }
      }

      @media (max-width: 640px) {
        .gk-f-cta {
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          padding: 32px 0;
        }

        .gk-f-cta-text h2 {
          font-size: 30px;
          line-height: 1.15;
        }

        .gk-f-cta-text p {
          font-size: 13px;
        }

        .gk-f-btn {
          width: 100%;
        }

        .gk-f-grid {
          grid-template-columns: minmax(0, 1fr);
          gap: 34px;
          padding: 38px 0;
        }

        .gk-f-brand,
        .gk-f-links,
        .gk-f-contact {
          grid-column: 1 / -1;
        }

        .gk-f-list {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px 18px;
        }

        .gk-f-heading {
          margin-bottom: 17px;
          font-size: 11px;
          letter-spacing: .14em;
        }

        .gk-f-about {
          max-width: 100%;
          font-size: 13px;
        }

        .gk-f-list a {
          font-size: 13px;
        }

        .gk-f-info {
          gap: 17px;
        }

        .gk-f-info a,
        .gk-f-info li > div > span {
          font-size: 13px;
        }

        .gk-f-bottom {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          padding: 21px 0 25px;
        }

        .gk-f-bottom p {
          font-size: 11px;
        }

        .gk-f-bottom-links {
          gap: 18px;
        }

        .gk-f-bottom-links a {
          font-size: 10px;
          letter-spacing: .08em;
        }
      }

      @media (max-width: 360px) {
        .gk-f-logo-name {
          font-size: 22px;
        }

        .gk-f-list a {
          font-size: 12px;
        }

        .gk-f-bottom-links {
          gap: 13px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .gk-footer *,
        .gk-footer *::before,
        .gk-footer *::after {
          transition-duration: .01ms !important;
        }
      }
    `}</style>
  );
}
