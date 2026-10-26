import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import HomeExtras from "./components/HomeExtras";
import Footer from "./components/Footer";

import Kitchen from "./pages/Kitchen";
import Wordrobe from "./pages/Wordrobe";
import Media from "./pages/Media";
import Bed from "./pages/Bed";
import Accessories from "./pages/Accessories";
import Corian from "./pages/Corian";
import Vanities from "./pages/Vanities";
import Sheets from "./pages/Sheets";
import Projects from "./pages/Projects";
import Design from "./pages/Design";
import AboutUs from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminKitchen from "./pages/admin/Kitchen";
import AdminWordrobe from "./pages/admin/Wordrobe";
import MediaAdmin from "./pages/admin/Media";
import AdminBed from "./pages/admin/Bed";
import AdminFooter from "./pages/admin/Footer";
import AdminMarquee from "./pages/admin/Marquee";
import AdminAccessories from "./pages/admin/Accessories";
import AdminSheets from "./pages/admin/Sheets";
import AdminCorian from "./pages/admin/Corian";
import AdminVanities from "./pages/admin/Vanities";
import AdminDesign from "./pages/admin/Design";

import useSmoothScroll from "./hooks/useSmoothScroll";

/* HOME PAGE */
function HomePage() {
  return (
    <>
      <Home />
      <HomeExtras />
    </>
  );
}

/* ADMIN PLACEHOLDER */
function AdminCategoryPlaceholder({ title, description }) {
  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#f7f7f5] p-5 sm:p-8 lg:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
        Gohar Kitchen / Admin
      </p>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        {title}
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
        {description ||
          "This management page has not been connected yet. The public website page remains available."}
      </p>
    </div>
  );
}

/* APPLICATION LAYOUT */
function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useSmoothScroll();

  // Footer sirf Home aur About pages par show hoga.
  const showFooter =
    location.pathname === "/" ||
    location.pathname === "/about";

  /* ADMIN ROUTES */
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Routes>
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route path="/admin" element={<AdminLayout />}>
            <Route
              index
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={
                <AdminCategoryPlaceholder
                  title="Dashboard Overview"
                  description="Review product counts and manage your website categories."
                />
              }
            />

            {/* KITCHEN */}
            <Route
              path="products"
              element={<AdminKitchen />}
            />

            <Route
              path="kitchen"
              element={
                <Navigate
                  to="/admin/products"
                  replace
                />
              }
            />

            {/* WARDROBE */}
            <Route
              path="wardrobe"
              element={<AdminWordrobe />}
            />

            {/* BED */}
            <Route
              path="bed"
              element={<AdminBed />}
            />

            <Route
              path="bed-walls"
              element={
                <Navigate
                  to="/admin/bed"
                  replace
                />
              }
            />

            {/* MEDIA WALLS */}
            <Route
              path="media-walls"
              element={<MediaAdmin />}
            />

            {/* FOOTER */}
            <Route
              path="footer"
              element={<AdminFooter />}
            />

            {/* MARQUEE */}
            <Route
              path="marquee"
              element={<AdminMarquee />}
            />

            {/* ACCESSORIES MANAGEMENT */}
            <Route
              path="accessories"
              element={<AdminAccessories />}
            />

            {/* SHEETS MANAGEMENT */}
            <Route
              path="sheets"
              element={<AdminSheets />}
            />

            {/* CORIAN MANAGEMENT */}
            <Route
              path="corian"
              element={<AdminCorian />}
            />

            {/* VANITIES MANAGEMENT */}
            <Route
              path="vanities"
              element={<AdminVanities />}
            />

            {/* 2D / 3D DESIGN MANAGEMENT */}
            <Route
              path="design"
              element={<AdminDesign />}
            />

            {/* PROJECTS MANAGEMENT (admin page abhi bana nahi) */}
            <Route
              path="projects"
              element={
                <AdminCategoryPlaceholder
                  title="Projects Management"
                />
              }
            />

            <Route
              path="settings"
              element={
                <AdminCategoryPlaceholder
                  title="Settings"
                />
              }
            />

            {/* UNKNOWN ADMIN ROUTES */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />
          </Route>
        </Routes>
      </div>
    );
  }

  /* PUBLIC WEBSITE ROUTES */
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/kitchen"
            element={<Kitchen />}
          />

          <Route
            path="/wordrobe"
            element={<Wordrobe />}
          />

          <Route
            path="/wardrobe"
            element={
              <Navigate
                to="/wordrobe"
                replace
              />
            }
          />

          <Route
            path="/media-walls"
            element={<Media />}
          />

          <Route
            path="/bedroom-walls"
            element={<Bed />}
          />

          <Route
            path="/accessories"
            element={<Accessories />}
          />

          <Route
            path="/corian"
            element={<Corian />}
          />

          <Route
            path="/vanities"
            element={<Vanities />}
          />

          {/* PUBLIC SHEETS GALLERY */}
          <Route
            path="/sheets"
            element={<Sheets />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/design-2d-3d"
            element={<Design />}
          />

          <Route
            path="/about"
            element={<AboutUs />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      {showFooter && (
        <Footer key={location.pathname} />
      )}
    </div>
  );
}

/* APP ROOT */
export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}