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

import useSmoothScroll from "./hooks/useSmoothScroll";

/* =========================================================
   HOME PAGE
========================================================= */

const HomePage = () => (
  <>
    <Home />
    <HomeExtras />
  </>
);

/* =========================================================
   ADMIN PLACEHOLDER
========================================================= */

const AdminCategoryPlaceholder = ({ title }) => (
  <div className="min-h-screen bg-[#f7f7f5] p-6 md:p-10">
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a1a1aa]">
      Gohar Kitchen / Admin
    </p>

    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171717]">
      {title}
    </h1>

    <p className="mt-3 max-w-xl text-sm leading-6 text-[#737373]">
      This category's product management page is not connected yet.
      Your existing website page remains available.
    </p>
  </div>
);

/* =========================================================
   APPLICATION LAYOUT
========================================================= */

const Layout = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  useSmoothScroll();

  /* =======================================================
     ADMIN ROUTES
  ======================================================= */

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Routes>
          {/* ADMIN LOGIN */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* ADMIN LAYOUT */}
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            {/* DEFAULT ADMIN ROUTE */}
            <Route
              index
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />

            {/* DASHBOARD */}
            <Route
              path="dashboard"
              element={
                <AdminCategoryPlaceholder
                  title="Dashboard Overview"
                />
              }
            />

            {/* KITCHEN PRODUCTS */}
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

            {/* WARDROBE PRODUCTS */}
            <Route
              path="wardrobe"
              element={<AdminWordrobe />}
            />

            {/* BEDROOM WALLS / BED PRODUCTS */}
            <Route
              path="bed"
              element={<AdminBed />}
            />

            {/* OLD BED WALLS URL */}
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

            {/* FOOTER MANAGEMENT */}
            <Route
              path="footer"
              element={<AdminFooter />}
            />

            {/* HOME PAGE MARQUEE MANAGEMENT */}
            <Route
              path="marquee"
              element={<AdminMarquee />}
            />

            {/* SETTINGS */}
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

  /* =======================================================
     PUBLIC WEBSITE ROUTES
  ======================================================= */

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={<HomePage />}
          />

          {/* KITCHEN */}
          <Route
            path="/kitchen"
            element={<Kitchen />}
          />

          {/* WARDROBE */}
          <Route
            path="/wordrobe"
            element={<Wordrobe />}
          />

          {/* CORRECT SPELLING -> EXISTING WARDROBE ROUTE */}
          <Route
            path="/wardrobe"
            element={
              <Navigate
                to="/wordrobe"
                replace
              />
            }
          />

          {/* MEDIA WALLS */}
          <Route
            path="/media-walls"
            element={<Media />}
          />

          {/* BEDROOM WALLS */}
          <Route
            path="/bedroom-walls"
            element={<Bed />}
          />

          {/* ABOUT US */}
          <Route
            path="/about"
            element={<AboutUs />}
          />

          {/* CONTACT */}
          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      <Footer key={location.pathname} />
    </div>
  );
};

/* =========================================================
   APP ROOT
========================================================= */

const App = () => (
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);

export default App;