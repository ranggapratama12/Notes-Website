"use client";
import { Menu, X, SquareUser, ChevronDown, BookOpen } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const closeUserMenu = () => setIsUserMenuOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        closeUserMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
    closeSidebar();
    closeUserMenu();
  };

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    const regex = new RegExp(`^${href}(/)?$`);
    return regex.test(pathname);
  };

  return (
    <div className="w-full sticky top-0 z-50 shadow-md bg-background">
      <nav className="bg-[#6F2DA8] px-6 py-5 md:py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
             <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white " />
            </div>
          <div className="text-primary-foreground font-extrabold text-2xl md:text-3xl select-none cursor-default -ml-96">
            Notes App
          </div>

          {/* Hamburger untuk mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              aria-label="Toggle menu"
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-primary-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            >
              <Menu className="text-primary-foreground" size={24} />
            </button>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              href="/"
              className={`relative px-3 py-2 rounded-md font-bold transition-colors
                  ${
                    isActive("/")
                      ? "bg-primary-foreground text-[#710193]"
                      : "text-white hover:bg-primary-foreground/20"
                  }`}
            >
              Home
              {isActive("/") && (
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-t-md" />
              )}
            </Link>
            <Link
              href="/about"
              className={`relative px-3 py-2 rounded-md font-bold transition-colors
                  ${
                    isActive("/about")
                      ? "bg-primary-foreground text-[#710193]"
                      : "text-white hover:bg-primary-foreground/20"
                  }`}
            >
              About Us
              {isActive("/about") && (
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-t-md" />
              )}
            </Link>
            <Link
              href="/notes"
              className={`relative px-3 py-2 rounded-md font-bold transition-colors
                  ${
                    isActive("/notes")
                      ? "bg-primary-foreground text-[#710193]"
                      : "text-white hover:bg-primary-foreground/20"
                  }`}
            >
              List Notes
              {isActive("/notes") && (
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-t-md" />
              )}
            </Link>
            {isLoggedIn && (
              <Link
                href="/notes/create"
                className={`relative px-3 py-2 rounded-md font-bold transition-colors
                  ${
                    isActive("/notes/create")
                      ? "bg-primary-foreground text-[#710193]"
                      : "text-white hover:bg-primary-foreground/20"
                  }`}
              >
                Create Notes
                {isActive("/notes/create") && (
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-t-md" />
                )}
              </Link>
            )}
            
            {/* User Menu Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-primary-foreground/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
                aria-label="User menu"
              >
                <SquareUser className="text-white" size={20} />
                <ChevronDown 
                  className={`text-white transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} 
                  size={16} 
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={closeUserMenu}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={closeUserMenu}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay & Drawer untuk mobile - selalu render untuk animasi */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out
          ${isOpen ? "visible bg-background/80 dark:bg-background/90 opacity-100" : "invisible opacity-0"}`}
        onClick={closeSidebar}
      >
        <div
          className={`w-64 bg-primary p-6 space-y-6 transform transition-transform duration-300 ease-in-out h-full shadow-lg
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="text-primary-foreground font-extrabold text-2xl select-none cursor-default">
              Notes App
            </div>
            <button
              aria-label="Close menu"
              onClick={closeSidebar}
              className="p-1 rounded-md hover:bg-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            >
              <X className="text-primary-foreground" size={24} />
            </button>
          </div>

          <nav className="flex flex-col space-y-3 mt-6">
            <Link
              href="/"
              onClick={closeSidebar}
              className={`relative px-4 py-2 rounded-md font-medium transition-colors
                ${
                  isActive("/")
                    ? "bg-primary-foreground text-primary"
                    : "text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary"
                }`}
            >
              Home
              {isActive("/") && (
                <span className="absolute -bottom-1 left-4 right-4 h-1 bg-secondary rounded-t-md" />
              )}
            </Link>
            <Link
              href="/about"
              onClick={closeSidebar}
              className={`relative px-4 py-2 rounded-md font-medium transition-colors
                ${
                  isActive("/about")
                    ? "bg-primary-foreground text-primary"
                    : "text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary"
                }`}
            >
              About Us
              {isActive("/about") && (
                <span className="absolute -bottom-1 left-4 right-4 h-1 bg-secondary rounded-t-md" />
              )}
            </Link>
            <Link
              href="/notes"
              onClick={closeSidebar}
              className={`relative px-4 py-2 rounded-md font-medium transition-colors
                ${
                  isActive("/notes")
                    ? "bg-primary-foreground text-primary"
                    : "text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary"
                }`}
            >
              List Notes
              {isActive("/notes") && (
                <span className="absolute -bottom-1 left-4 right-4 h-1 bg-secondary rounded-t-md" />
              )}
            </Link>
            {isLoggedIn && (
              <Link
                href="/notes/create"
                onClick={closeSidebar}
                className={`relative px-4 py-2 rounded-md font-medium transition-colors
                  ${
                    isActive("/notes/create")
                      ? "bg-primary-foreground text-primary"
                      : "text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary"
                  }`}
              >
                Create Notes
                {isActive("/notes/create") && (
                  <span className="absolute -bottom-1 left-4 right-4 h-1 bg-secondary rounded-t-md" />
                )}
              </Link>
            )}

            {/* User Menu untuk Mobile */}
            <div className="border-t border-primary-foreground/20 pt-3 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 text-primary-foreground">
                <SquareUser size={20} />
                <span className="font-medium">Akun</span>
              </div>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-primary-foreground font-medium px-4 py-2 rounded-md hover:bg-destructive hover:text-white transition ml-6"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeSidebar}
                    className="block text-primary-foreground font-medium px-4 py-2 rounded-md hover:bg-secondary hover:text-primary transition ml-6"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeSidebar}
                    className="block text-primary-foreground font-medium px-4 py-2 rounded-md hover:bg-secondary hover:text-primary transition ml-6"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}