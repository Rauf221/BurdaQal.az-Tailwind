"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AddClassBody from "@/components/elements/AddClassBody";
import BackToTop from "@/components/layout/BackToTop";
import FilterBtn from "@/components/elements/FilterBtn";
import LoginPopup from "@/components/elements/LoginPopup";
import RegisterPopup from "@/components/elements/RegisterPopup";
import ShowSearch from "@/components/elements/ShowSearch";
import UpdateProgressBars from "@/components/elements/UpdateProgressBars";
import WidgetTab from "@/components/elements/WidgetTab";
import Breadcrumb from "@/components/layout/Breadcrumb";
import MobileMenu from "@/components/layout/MobileMenu";
import FooterMain from "@/components/layout/FooterMain";
import HeaderHome from "@/components/layout/header/HeaderHome";
import HeaderAbout from "@/components/layout/header/HeaderAbout";

export type LayoutProps = {
  headerStyle: 7 | 12;
  breadcrumbTitle?: string;
  children: React.ReactNode;
  mainContentCls?: string;
  footerCls?: string;
};

/** justhome `Layout.js` ilə eyni struktur və məntiq (`Header7` → `HeaderHome`, `Header12` → `HeaderAbout`). */
export default function Layout({
  headerStyle,
  breadcrumbTitle,
  children,
  mainContentCls,
  footerCls,
}: LayoutProps) {
  const [scroll, setScroll] = useState(false);
  const headerFlowHeightRef = useRef(0);
  const [isMobileMenu, setMobileMenu] = useState(false);
  const handleMobileMenu = () => {
    const next = !isMobileMenu;
    setMobileMenu(next);
    if (next) document.body.classList.add("mobile-menu-visible");
    else document.body.classList.remove("mobile-menu-visible");
  };

  const [isLogin, setLogin] = useState(false);
  const handleLogin = () => {
    const next = !isLogin;
    setLogin(next);
    if (next) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
  };

  const [isRegister, setRegister] = useState(false);
  const handleRegister = () => {
    const next = !isRegister;
    setRegister(next);
    if (next) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
  };

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") !== "1") return;
    setLogin(true);
    document.body.classList.add("modal-open");
    params.delete("login");
    const q = params.toString();
    const next =
      window.location.pathname + (q ? `?${q}` : "") + window.location.hash;
    window.history.replaceState({}, "", next);
  }, []);

  useLayoutEffect(() => {
    const page = document.getElementById("page");
    const header = document.getElementById("header_main");
    if (!page) return;
    if (headerStyle === 7) {
      page.style.paddingTop = "";
      return;
    }
    if (!header) return;
    if (!scroll) {
      headerFlowHeightRef.current = header.offsetHeight;
      page.style.paddingTop = "";
      return;
    }
    const h = headerFlowHeightRef.current || header.offsetHeight;
    page.style.paddingTop = `${h}px`;
  }, [scroll, headerStyle]);

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
      <WidgetTab />
      <FilterBtn />
      <ShowSearch />
      <UpdateProgressBars />

      <div id="wrapper" className="relative max-h-full max-w-full overflow-hidden">
        <div id="page">
          {headerStyle === 7 ? (
            <HeaderHome {...headerProps} />
          ) : (
            <HeaderAbout {...headerProps} />
          )}

          <div
            className={`main-content ${mainContentCls ?? ""}`.trim()}
          >
            {breadcrumbTitle ? <Breadcrumb /> : null}
            {children}
          </div>
          <FooterMain footerCls={footerCls} />
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
