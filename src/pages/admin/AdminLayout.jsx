
import React, { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ChefHat,
  DoorOpen,
  BedDouble,
  PanelsTopLeft,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Layers,
  CircleCheck,
  CircleOff,
  RefreshCw,
  ContactRound,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

const navigation = [
  {
    label: "Main Menu",
    items: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Kitchen", path: "/admin/products", icon: ChefHat },
      { name: "Wardrobe", path: "/admin/wardrobe", icon: DoorOpen },
      { name: "Bed Walls", path: "/admin/bed", icon: BedDouble },
      { name: "Media Walls", path: "/admin/media-walls", icon: PanelsTopLeft },
    ],
  },
  {
    label: "Preferences",
    items: [
      {
        name: "Footer Settings",
        path: "/admin/footer",
        icon: ContactRound,
      },
    ],
  },
];

const categories = [
  {
    name: "Kitchen",
    description: "Kitchen designs",
    path: "/admin/products",
    icon: ChefHat,
    number: "01",
    table: "kitchen_products",
  },
  {
    name: "Wardrobe",
    description: "Wardrobe designs",
    path: "/admin/wardrobe",
    icon: DoorOpen,
    number: "02",
    table: "wardrobe_products",
  },
  {
    name: "Bed Walls",
    description: "Bedroom designs",
    path: "/admin/bed",
    icon: BedDouble,
    number: "03",
    table: "bed_products",
  },
  {
    name: "Media Walls",
    description: "Media wall designs",
    path: "/admin/media-walls",
    icon: PanelsTopLeft,
    number: "04",
    table: "media_products",
  },
];

/* -------------------------------------------------------------------------- */
/* Reusable components                                                        */
/* -------------------------------------------------------------------------- */

function StatCard({ label, value, hint, icon: Icon, dark = false, loading }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            dark ? "bg-neutral-900 text-white" : "bg-orange-50 text-orange-600"
          }`}
        >
          <Icon size={19} />
        </div>
      </div>

      <p
        className={`mt-3 text-3xl font-semibold tracking-tight text-neutral-900 ${
          loading ? "animate-pulse text-neutral-300" : ""
        }`}
      >
        {loading ? "—" : value}
      </p>

      <p className="mt-1 text-xs text-neutral-400">{hint}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard counts                                                           */
/* -------------------------------------------------------------------------- */

function useDashboardCounts() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const results = await Promise.all(
        categories.map(async (category) => {
          const { data, error } = await supabase
            .from(category.table)
            .select("status");

          if (error) {
            console.error(
              `Dashboard count failed for ${category.table}:`,
              error
            );
            return [category.table, null];
          }

          const total = data?.length ?? 0;
          const active = (data ?? []).filter(
            (row) => row.status === "active"
          ).length;

          return [
            category.table,
            { total, active, inactive: total - active },
          ];
        })
      );

      setCounts(Object.fromEntries(results));
    } catch (error) {
      console.error("Dashboard counts failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [load]);

  return { counts, loading, reload: load };
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

function DashboardHome() {
  const navigate = useNavigate();
  const { counts, loading, reload } = useDashboardCounts();

  const loaded = categories
    .map((category) => counts[category.table])
    .filter(Boolean);

  const totalDesigns = loaded.reduce((sum, item) => sum + item.total, 0);
  const totalActive = loaded.reduce((sum, item) => sum + item.active, 0);
  const totalInactive = loaded.reduce((sum, item) => sum + item.inactive, 0);
  const activePercent = totalDesigns
    ? Math.round((totalActive / totalDesigns) * 100)
    : 0;

  const hasFailed = categories.some(
    (category) =>
      Object.prototype.hasOwnProperty.call(counts, category.table) &&
      counts[category.table] === null
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-7 p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Overview of your products and categories.
          </p>
        </div>
        <button
          type="button"
          onClick={reload}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-700 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          title="Refresh dashboard"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total categories"
            value={String(categories.length).padStart(2, "0")}
            hint="Product categories"
            icon={PanelsTopLeft}
          />
          <StatCard
            label="Total designs"
            value={totalDesigns}
            hint="Across all categories"
            icon={Layers}
            loading={loading}
          />
          <StatCard
            label="Active designs"
            value={totalActive}
            hint={`${activePercent}% of all designs`}
            icon={CircleCheck}
            loading={loading}
          />
          <StatCard
            label="Inactive designs"
            value={totalInactive}
            hint="Not shown on the website"
            icon={CircleOff}
            loading={loading}
          />
        </div>

        {hasFailed && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Some product counts could not be loaded. Check your Supabase tables
            and permissions, then refresh the dashboard.
          </p>
        )}
      </section>

      {/* Product categories */}
      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
              Product categories
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Select a category to manage its products.
            </p>
          </div>
          <span className="text-xs text-neutral-400">4 categories</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const data = counts[category.table];
            const total = data?.total ?? 0;
            const active = data?.active ?? 0;
            const inactive = data?.inactive ?? 0;
            const percent = total ? Math.round((active / total) * 100) : 0;
            const isLoading = loading && data === undefined;

            return (
              <button
                key={category.path}
                type="button"
                onClick={() => navigate(category.path)}
                className="group rounded-xl border border-neutral-200 bg-white p-5 text-left transition hover:border-orange-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition group-hover:bg-orange-50 group-hover:text-orange-600">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <ChevronRight size={17} className="text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-orange-500" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-neutral-900">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {category.description}
                </p>

                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <p className={`text-3xl font-semibold tracking-tight ${isLoading ? "animate-pulse text-neutral-300" : "text-neutral-900"}`}>
                      {isLoading ? "—" : data === null ? "!" : total}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">Total products</p>
                  </div>
                  <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
                    {isLoading || data === null ? "—" : `${percent}% active`}
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-[width] duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 text-neutral-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {isLoading || data === null ? "—" : active} active
                  </span>
                  <span className="text-neutral-400">
                    {isLoading || data === null ? "—" : inactive} inactive
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-neutral-200 pt-4 text-xs text-neutral-400">
        Gohar Kitchen Admin
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Admin Layout                                                               */
/* -------------------------------------------------------------------------- */

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage =
    navigation
      .flatMap((section) => section.items)
      .find((item) => item.path === location.pathname)?.name || "Dashboard";

  const initial = (userEmail || "A").charAt(0).toUpperCase();

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.error("Could not load admin user:", error);
        return;
      }

      if (active && data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    const onKey = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        setUserMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const onClick = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);

    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      window.alert("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  const sidebarContent = (
    <div className="flex h-full flex-col border-r border-white/10 bg-[#0a0a0a] text-white">
      {/* Brand */}
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
            <ChefHat size={22} />
          </div>

          <div>
            <p className="text-sm font-bold tracking-[0.18em]">GOHAR</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">
              Admin Panel
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={closeSidebar}
          className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6 [scrollbar-width:thin] [scrollbar-color:#333_transparent]">
        {navigation.map((section) => (
          <div key={section.label}>
            <p className="mb-2.5 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              {section.label}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      [
                        "group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                        isActive
                          ? "bg-orange-500/10 font-semibold text-orange-400"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-orange-500" />
                        )}

                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              isActive
                                ? "bg-orange-500 text-white"
                                : "bg-white/[0.04] text-white/70 group-hover:bg-white/10"
                            }`}
                          >
                            <Icon size={17} strokeWidth={1.9} />
                          </span>

                          {item.name}
                        </span>

                        {isActive && (
                          <ChevronRight size={15} className="opacity-80" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.06] hover:text-white"
        >
          <ExternalLink size={18} />
          View Website
        </a>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-orange-400 transition hover:bg-orange-500/10 disabled:opacity-50"
        >
          <LogOut size={18} />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f4] lg:flex">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeSidebar}
          tabIndex={sidebarOpen ? 0 : -1}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute inset-y-0 left-0 w-[284px] max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </div>

      {/* Content column */}
      <div className="min-w-0 flex-1 lg:ml-[264px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-neutral-200 bg-white p-2.5 text-neutral-800 transition hover:border-orange-300 hover:text-orange-600 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900 sm:text-base">
                {currentPage}
              </p>

              <nav
                aria-label="Breadcrumb"
                className="hidden items-center gap-1.5 text-xs text-neutral-500 sm:flex"
              >
                <span>Gohar Kitchen</span>
                <ChevronRight size={12} />
                <span>Admin</span>
                <ChevronRight size={12} />
                <span className="font-medium text-orange-600">
                  {currentPage}
                </span>
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
{/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1.5 pl-1.5 pr-2.5 transition hover:border-orange-300"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-orange-400">
                  {initial}
                </span>

                <span className="hidden text-xs font-semibold text-neutral-800 sm:block">
                  Admin
                </span>

                <ChevronDown
                  size={14}
                  className={`text-neutral-500 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-black/10"
                >
                  <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      Signed in as
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-neutral-900">
                      {userEmail || "Administrator"}
                    </p>
                  </div>

                  <div className="p-1.5">
                    <a
                      href="/"
                      target="_blank"
                      rel="noreferrer"
                      role="menuitem"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-700 transition hover:bg-neutral-100"
                    >
                      <ExternalLink size={16} />
                      View Website
                    </a>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
                    >
                      <LogOut size={16} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-68px)]">
          {location.pathname === "/admin" ||
          location.pathname === "/admin/dashboard" ? (
            <DashboardHome />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
