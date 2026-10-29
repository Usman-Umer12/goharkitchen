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
import Kitchenaccessories from "./pages/Kitchenaccessories";
import Wardrobeaccessories from "./pages/Wardrobeaccessories";
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
import KitchenaccessoriesAdmin from "./pages/admin/KitchenaccessoriesAdmin";
import WardrobeaccessoriesAdmin from "./pages/admin/WardrobeaccessoriesAdmin";
import AdminSheets from "./pages/admin/Sheets";
import AdminCorian from "./pages/admin/Corian";
import AdminVanities from "./pages/admin/Vanities";
import AdminDesign from "./pages/admin/Design";
import AdminProject from "./pages/admin/Project";
import AdminBrand from "./pages/admin/Brand";

import useSmoothScroll from "./hooks/useSmoothScroll";

function HomePage() {
  return (
    <>
      <Home />
      <HomeExtras />
    </>
  );
}

function AdminCategoryPlaceholder({ title, description }) {
  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#f7f7f5] p-5 sm:p-8 lg:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">Gohar Kitchen / Admin</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
        {description || "This management page has not been connected yet. The public website page remains available."}
      </p>
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  useSmoothScroll();

  const showFooter = location.pathname === "/" || location.pathname === "/about";

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-white text-black">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminCategoryPlaceholder title="Dashboard Overview" description="Review product counts and manage your website categories." />} />
            <Route path="products" element={<AdminKitchen />} />
            <Route path="kitchen" element={<Navigate to="/admin/products" replace />} />
            <Route path="wardrobe" element={<AdminWordrobe />} />
            <Route path="bed" element={<AdminBed />} />
            <Route path="bed-walls" element={<Navigate to="/admin/bed" replace />} />
            <Route path="media-walls" element={<MediaAdmin />} />
            <Route path="footer" element={<AdminFooter />} />
            <Route path="marquee" element={<AdminMarquee />} />
            <Route path="brand" element={<AdminBrand />} />

            {/* Accessories (3 alag pages) */}
            <Route path="accessories" element={<AdminAccessories />} />
            <Route path="wardrobe-accessories" element={<WardrobeaccessoriesAdmin />} />
            <Route path="kitchen-accessories" element={<KitchenaccessoriesAdmin />} />

            <Route path="sheets" element={<AdminSheets />} />
            <Route path="corian" element={<AdminCorian />} />
            <Route path="vanities" element={<AdminVanities />} />
            <Route path="design" element={<AdminDesign />} />
            <Route path="projects" element={<AdminProject />} />
            <Route path="settings" element={<AdminCategoryPlaceholder title="Settings" />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/wordrobe" element={<Wordrobe />} />
          <Route path="/wardrobe" element={<Navigate to="/wordrobe" replace />} />
          <Route path="/media-walls" element={<Media />} />
          <Route path="/bedroom-walls" element={<Bed />} />

          {/* Accessories (3 alag pages) */}
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/wardrobe-accessories" element={<Wardrobeaccessories />} />
          <Route path="/kitchen-accessories" element={<Kitchenaccessories />} />

          <Route path="/corian" element={<Corian />} />
          <Route path="/vanities" element={<Vanities />} />
          <Route path="/sheets" element={<Sheets />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/design-2d-3d" element={<Design />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {showFooter && <Footer key={location.pathname} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}