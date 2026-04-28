"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AddClassBody from "@/components/elements/AddClassBody";
import BackToTop from "@/components/layout/BackToTop";
import LoginPopup from "@/components/elements/LoginPopup";
import RegisterPopup from "@/components/elements/RegisterPopup";
import MobileMenu from "@/components/layout/MobileMenu";
import HeaderAbout from "@/components/layout/header/HeaderAbout";
import BreadcrumbAdmin from "@/components/layout/admin/BreadcrumbAdmin";
import DashboardSidebar from "@/components/layout/admin/DashboardSidebar";

export type LayoutAdminProps = {
  breadcrumbTitle?: string;
  children: React.ReactNode;
};

/**
 * justhome `LayoutAdmin.js` — dashboard qabığı; üslub Tailwind (əlavə .css faylı yoxdur).
 */
export default function LayoutAdmin({ breadcrumbTitle, children }: LayoutAdminProps) {
  const [scroll, setScroll] = useState(false);
  const headerFlowHeightRef = useRef(0);
  const [isMobileMenu, setMobileMenu] = useState(false);

  const handleMobileMenu = () => {
    setMobileMenu((open) => {
      const next = !open;
      if (next) document.body.classList.add("mobile-menu-visible");
      else document.body.classList.remove("mobile-menu-visible");
      return next;
    });
  };

  const [isLogin, setLogin] = useState(false);
  const handleLogin = () => {
    const next = !isLogin;
    setLogin(next);
  };

  const [isRegister, setRegister] = useState(false);
  const handleRegister = () => {
    const next = !isRegister;
    setRegister(next);
  };

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      document.body.classList.remove("mobile-menu-visible");
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") !== "1") return;
    setLogin(true);
    params.delete("login");
    const q = params.toString();
    const next =
      window.location.pathname + (q ? `?${q}` : "") + window.location.hash;
    window.history.replaceState({}, "", next);
  }, []);

  useLayoutEffect(() => {
    const page = document.getElementById("page");
    const header = document.getElementById("header_main");
    if (!page || !header) return;
    if (!scroll) {
      headerFlowHeightRef.current = header.offsetHeight;
      page.style.paddingTop = "";
      return;
    }
    const h = headerFlowHeightRef.current || header.offsetHeight;
    page.style.paddingTop = `${h}px`;
  }, [scroll]);

  const headerProps = {
    scroll,
    isMobileMenu,
    handleMobileMenu,
    isLogin,
    handleLogin,
    isRegister,
    handleRegister,
  };

  return (
    <>
      <div id="top" />
      <AddClassBody />

      <div id="wrapper" className="relative max-h-full max-w-full overflow-hidden">
        <div id="page" className="min-h-screen bg-[#F9F9F9]">
          <HeaderAbout {...headerProps} />

          <div className="main-content p-5">
            <div className="relative">
              <DashboardSidebar />
              <div
                className={[
                  "flex-1",
                  "pl-0 pt-4",
                  "md:pl-[400px] md:pt-2.5",
                  "min-[992px]:pl-[371px] min-[992px]:pt-0",
                ].join(" ")}
              >
                {breadcrumbTitle ? (
                  <BreadcrumbAdmin breadcrumbTitle={breadcrumbTitle} />
                ) : null}
                {children}
                <div className="bottom-page px-0 pb-[11px] pt-8">
                  <p className="text-center text-base text-[var(--Text)]">
                    Copyright © 2024. Markup Agency
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        handleLogin={handleLogin}
      />
      <BackToTop target="#top" />
      <LoginPopup
        isLogin={isLogin}
        handleLogin={handleLogin}
        isRegister={isRegister}
        handleRegister={handleRegister}
      />
      <RegisterPopup
        isRegister={isRegister}
        handleRegister={handleRegister}
        handleLogin={handleLogin}
      />
    </>
  );
}
