import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaBox,
  FaWarehouse,
  FaClipboardList,
  FaChartPie,
  FaBell,
  FaCog,
  FaAddressCard,
  FaArrowLeft,
  FaBars,
} from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

import logoDesktop from "../assets/images/logo.png";
import logoMobile from "../assets/images/logo-mobile.png";


const menuItems = [
  {
    label: "Dashboard",
    icon: <FaChartPie />,
    path: "/",
  },
  {
    label: "Sales",
    icon: <FaBox />,
    children: [
      { label: "Order Pick", path: "/sales/order-pick" },
      { label: "Quotation", path: "/sales/quotation" },
      { label: "Archive", path: "/sales/picklist-archive" },
      { label: "Sales Order", path: "/sales/sales-order" },
    ],
  },
  {
    label: "Purchase",
    icon: <FaWarehouse />,
    children: [
      { label: "Create Supplier Quotation", path: "/purchase/create-supplier-quotation" },
      { label: "Purchase Quotation Dashboard", path: "/purchase/quotation-dashboard" },
      { label: "Create Purchase Order", path: "/purchase/create-order" },
      { label: "Purchase Order Dashboard", path: "/purchase/order-dashboard" },
      { label: "Purchase Archive", path: "/purchase/archive" },
      { label: "Purchase Receipt Dashboard", path: "/purchase/receipt-dashboard" },
    ],
  },
  {
    label: "Counting",
    icon: <FaClipboardList />,
    children: [{ label: "Create", path: "/counting/create" }],
  },
  {
    label: "Overview",
    icon: <FaChartPie />,
    children: [{ label: "Evening", path: "/overview/overview-evening" }],
  },
  {
    label: "User",
    icon: <FaAddressCard />,
    children: [
      { label: "New User", path: "/user/create-user" },
      { label: "User List", path: "/user/user-list" },
    ],
  },
  {
    label: "Stock",
    icon: <FaAddressCard />,
    children: [
      { label: "Item Dashboard", path: "/stock/dashboard" },
      { label: "Add Item", path: "/stock/create-item" },
    ],
  },
];

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef(null);
  const topbarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // refs to store submenu containers for GSAP animations
  const submenuRefs = useRef([]);
  const mobileSubmenuRefs = useRef([]);
  const mobileSidebarRef = useRef(null);

  // timeout ref for delayed submenu close on desktop hover
  const submenuTimeout = useRef(null);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  // Toggle mobile menu open state
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Handle main menu item click: navigate or toggle submenu
  const handleMainMenuClick = (item, idx) => {
    if (item.path) {
      navigate(item.path);
      setIsMobileMenuOpen(false);
      setOpenMenu(null);
    } else if (item.children) {
      setOpenMenu((prev) => (prev === idx ? null : idx));
    }
  };

  // Animate sidebar and topbar on mount
  useEffect(() => {
    gsap.from(sidebarRef.current, {
      x: -40,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
    });
    gsap.from(topbarRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      delay: 0.1,
      ease: "power3.out",
    });
  }, []);

  // Animate desktop submenu open/close
  useEffect(() => {
    submenuRefs.current.forEach((submenuEl, idx) => {
      if (!submenuEl) return;
      if (openMenu === idx) {
        gsap.killTweensOf(submenuEl);
        gsap.set(submenuEl, { display: "flex", height: "auto", opacity: 1 });
        gsap.fromTo(
          submenuEl.children,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.08,
            ease: "power2.out",
          }
        );
      } else {
        gsap.killTweensOf(submenuEl);
        gsap.to(submenuEl, {
          opacity: 0,
          height: 0,
          duration: 0.25,
          ease: "power2.inOut",
          onComplete: () => {
            if (submenuEl) {
              submenuEl.style.display = "none";
            }
          },
        });
      }
    });
  }, [openMenu]);

  // Animate mobile submenu open/close
  useEffect(() => {
    mobileSubmenuRefs.current.forEach((submenuEl, idx) => {
      if (!submenuEl) return;
      if (openMenu === idx && isMobileMenuOpen) {
        gsap.killTweensOf(submenuEl);
        gsap.set(submenuEl, { display: "flex", height: "auto", opacity: 1 });
        gsap.fromTo(
          submenuEl.children,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      } else {
        gsap.killTweensOf(submenuEl);
        gsap.to(submenuEl, {
          opacity: 0,
          height: 0,
          duration: 0.25,
          ease: "power2.inOut",
          onComplete: () => {
            if (submenuEl) {
              submenuEl.style.display = "none";
            }
          },
        });
      }
    });
  }, [openMenu, isMobileMenuOpen]);

  // Animate mobile sidebar open/close
  useEffect(() => {
    if (!mobileSidebarRef.current) return;
    if (isMobileMenuOpen) {
      gsap.killTweensOf(mobileSidebarRef.current);
      gsap.fromTo(
        mobileSidebarRef.current,
        { x: -260, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.killTweensOf(mobileSidebarRef.current);
      gsap.to(mobileSidebarRef.current, {
        x: -260,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isMobileMenuOpen]);

  // Delayed close on desktop submenu mouse leave to avoid flickering
  const handleMouseEnter = (idx) => {
    if (window.innerWidth < 1024) return; // only desktop
    clearTimeout(submenuTimeout.current);
    setOpenMenu(idx);
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 1024) return; // only desktop
    submenuTimeout.current = setTimeout(() => {
      setOpenMenu(null);
    }, 300); // delay close by 300ms for smoother experience
  };

  return (
    <div
      className="flex min-h-screen flex-col lg:flex-row bg-gray-50 bg-[radial-gradient(1200px_600px_at_10%_-10%,#f4ac1b22,transparent),radial-gradient(900px_500px_at_90%_0%,#e92a2922,transparent)]"
      aria-label="Admin Layout"
    >
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`hidden lg:flex fixed inset-y-0 left-0 bg-white/20 backdrop-blur-xl text-gray-800 flex-col justify-between shadow-[0_1px_4px_rgba(0,0,0,0.12)] border-r border-white/40 transition-all duration-300 ease-in-out z-40 ${
          isCollapsed ? "w-[80px]" : "w-[288px]"
        }`}
      >
        <div>
          {/* Logo */}
          <div
            className={`border-b border-white/40 p-5 ${
              isCollapsed
                ? "flex items-center justify-center gap-2"
                : "flex items-center justify-between"
            }`}
          >
            <img
              src={isCollapsed ? logoMobile : logoDesktop}
              alt="Sukan Food Logo"
              className={isCollapsed ? "h-8" : "h-10"}
            />
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-white/30 transition"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <FaBars /> : <FaArrowLeft />}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-1 p-3" role="menu" aria-label="Main navigation">
            {menuItems.map((item, idx) => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openMenu === idx;
              const isAnyChildActive =
                hasChildren &&
                item.children.some((child) => location.pathname.startsWith(child.path));
              const isActive = location.pathname === item.path || isAnyChildActive;

              return (
                <div
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                  role="none"
                >
                  <button
                    onClick={() => handleMainMenuClick(item, idx)}
                    className={`flex items-center justify-between px-4 py-3 w-full rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-[#e92a29] text-white shadow-md"
                        : "hover:bg-[#e92a29]/10 text-gray-800"
                    }`}
                    aria-haspopup={hasChildren}
                    aria-expanded={isOpen}
                    role="menuitem"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${isActive ? "text-white" : "text-[#e92a29]"}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </div>
                    {hasChildren && !isCollapsed && (
                      <span className="text-xs" aria-hidden="true">
                        {isOpen ? "▲" : "▼"}
                      </span>
                    )}
                  </button>

                  {/* Submenu */}
                  {hasChildren && (
                    <div
                      ref={(el) => (submenuRefs.current[idx] = el)}
                      className={`flex flex-col mt-1 z-50 origin-top-left ${
                        isCollapsed
                          ? "fixed w-64 bg-white shadow-xl rounded-xl p-2 border border-gray-200 left-[80px]"
                          : "ml-10 bg-white/0"
                      }`}
                      style={
                        isCollapsed
                          ? { top: `${80 + idx * 48}px`, display: "none", opacity: 0, height: 0 }
                          : { display: "none", opacity: 0, height: 0 }
                      }
                      role="menu"
                      aria-label={`${item.label} submenu`}
                    >
                      {item.children.map((child, cidx) => (
                        <NavLink
                          key={cidx}
                          to={child.path}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm rounded-lg transition ${
                              isActive ? "bg-[#e92a29] text-white" : "hover:bg-[#e92a29]/10"
                            }`
                          }
                          role="menuitem"
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/40 flex flex-col gap-3">
          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="ml-1 flex items-center gap-2 text-gray-700 hover:text-[#e92a29] transition"
          >
            <FaCog className="text-xl text-[#e92a29]" />
            {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
          </button>

          {/* Profile */}
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-3xl text-[#e92a29]" />
              <div>
                <p className="font-semibold text-gray-700">Admin</p>
                <p className="text-xs text-gray-500">Sukan Food (Exports)</p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button className="ml-1 flex items-center gap-2 text-gray-700 hover:text-red-500 transition" onClick={() => navigate("/login")}>
            <FaSignOutAlt />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden flex"
          aria-modal="true"
          role="dialog"
          aria-label="Mobile menu"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-[260px] h-full bg-white shadow-2xl p-4 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()} // prevent click closing when clicking inside
            ref={mobileSidebarRef}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <img src={logoMobile} alt="Logo" className="h-8" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <FaArrowLeft />
                </button>
              </div>
              <nav className="flex flex-col gap-2" role="menu" aria-label="Mobile main navigation">
                {menuItems.map((item, idx) => {
                  const hasChildren = item.children && item.children.length > 0;

                  // Determine if this menu item is active:
                  // - If item has path, check exact match
                  // - Else if has children, check if any child's path matches current location
                  const isActive =
                    (item.path && location.pathname === item.path) ||
                    (hasChildren &&
                      item.children.some((child) => location.pathname.startsWith(child.path)));

                  const isOpen = openMenu === idx;

                  return (
                    <div key={idx} role="none">
                      <button
                        className={`flex justify-between items-center w-full text-left px-3 py-2 rounded-lg transition
                          ${
                            isActive
                              ? "bg-[#e92a29] text-white"
                              : "hover:bg-gray-100 text-gray-800"
                          }`}
                        onClick={() => handleMainMenuClick(item, idx)}
                        aria-haspopup={hasChildren}
                        aria-expanded={isOpen}
                        role="menuitem"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {hasChildren && <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>}
                      </button>
                      {hasChildren && (
                        <div
                          ref={(el) => (mobileSubmenuRefs.current[idx] = el)}
                          className="ml-5 mt-1 flex flex-col overflow-hidden"
                          style={{ display: "none", opacity: 0, height: 0 }}
                          role="menu"
                          aria-label={`${item.label} mobile submenu`}
                        >
                          {item.children.map((child, cidx) => (
                            <NavLink
                              key={cidx}
                              to={child.path}
                              className={({ isActive }) =>
                                `px-3 py-1 text-sm rounded-md ${
                                  isActive ? "bg-[#e92a29] text-white" : "hover:bg-gray-200"
                                }`
                              }
                              onClick={() => setIsMobileMenuOpen(false)}
                              role="menuitem"
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Mobile sidebar footer: profile + logout */}
            <div className="border-t border-gray-200 pt-4">
              {/* Settings */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center justify-center gap-2 py-2 mb-3 rounded-md bg-gray-100 text-gray-700 hover:bg-[#e92a29]/10 hover:text-[#e92a29] transition"
              >
                <FaCog />
                <span>Settings</span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 mb-3">
                <FaUserCircle className="text-3xl text-[#e92a29]" />
                <div>
                  <p className="font-semibold text-gray-700">Admin</p>
                  <p className="text-xs text-gray-500">Sukan Food (Exports)</p>
                </div>
              </div>

              {/* Logout */}
              <button
                className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate("/login");
                }}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Main Content */}
      <div
        className={`flex-1 w-full flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:ml-[80px]" : "lg:ml-[288px]"
        }`}
      >
        {/* Desktop Topbar */}
        <header
          ref={topbarRef}
          className="hidden lg:flex items-center justify-between sticky top-0 z-30 px-6 py-4 bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-[0_1px_30px_rgba(0,0,0,0.06)]"
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome to Sukan Food Dashboard
            </h2>
            <p className="text-sm text-gray-500">Vegetable Exports • Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search anything…"
                className="pl-10 pr-4 py-2 rounded-full bg-white/70 border border-white/50 placeholder:text-gray-500 focus:outline-none shadow-sm"
              />
              <FaSearch className="absolute top-2.5 left-3 text-gray-500" />
            </div>
            <button className="relative p-2 rounded-full bg-white/70 hover:bg-white transition border border-white/60">
              <FaBell className="text-gray-700" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#e92a29] text-white text-[10px] flex items-center justify-center">
                3
              </span>
            </button>
            <FaUserCircle className="text-4xl text-[#e92a29]" />
          </div>
        </header>


        {/* Mobile Topbar */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section: Menu Icon, Logo, Welcome Text */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileMenu}
                aria-label="Open mobile menu"
                className="p-2 rounded-md hover:bg-gray-100 transition"
              >
                <FaBars className="text-2xl text-[#e92a29]" />
              </button>

              <img src={logoMobile} alt="Logo" className="h-8" />

              <div className="flex flex-col leading-tight">
                <h2 className="text-sm font-semibold text-gray-800">
                  Welcome to Sukan Food
                </h2>
                <p className="text-xs text-gray-500">Vegetable Exports</p>
              </div>
            </div>
            {/* Right Section: Profile Icon */}
            <FaUserCircle className="text-3xl text-[#e92a29]" />
          </div>
        </header>
        {/* Main content area */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;