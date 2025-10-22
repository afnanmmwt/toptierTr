"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
// import Button from "@components/core/button";
import HeaderLogo from "@components/themes/layout/components/common/headerLogo";
import { useUser } from "@hooks/use-user";
// import Alert from "@components/core/alert";
// import { signOut } from "@src/actions";
// import { Router } from "next/router";
import Dropdown from "@components/core/Dropdown";
import ProfileDropdown from "./userDropDown"

const HeaderMenus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  // const router=Router()
  return (
    <header className="w-full  max-w-[1200px] mx-auto overflow-visible">
      <div className="flex items-center justify-between h-22 appHorizantalSpacing">
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-800">
            <HeaderLogo imgClass='w-32' />
          </Link>

          {/* Desktop Menu */}
          <nav className="text-[16px] pt-1.5">
            <div className="hidden md:flex items-center gap-8 text-gray-700">
              <Link href="/hotels" className="header-nav-item">
                Hotels
              </Link>
              <Link href="/contact" className="header-nav-item">
                Contact
              </Link>
              <Link href="/support" className="header-nav-item">
                Support
              </Link>
            </div>

          </nav>
        </div>

        {/* Right: Auth Buttons - Desktop Only */}
        {!(user ) ? <div className="hidden md:flex items-center gap-3">
          {/* <Link
            href="/auth/signup"
            className="border border-[#061026] text-[#061026] cursor-pointer text-center text-[16px] rounded-full w-[113px] h-[39px] pt-1.5 hover:bg-blue-50"
          >
            Sign up
          </Link>
          <Link
            href="/auth/login"
            className="bg-[#163C8C] border border-[#061026] cursor-pointer text-center border-none hover:bg-gray-800 text-[16px] hover:text-white ring-0 text-white rounded-full w-[113px] h-[39px] pt-1.5 transition"
          >
            Login
          </Link> */}
           <Dropdown
        label={
          <div className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              className="pe-1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Agents
            {/* <ChevronDown className="w-4 h-4" /> */}
          </div>
        }
      >
        <div className="flex flex-col">
          <Link
            href="https://agents.toptiertravel.vip/login"
            target="_blank"
            className="block text-sm font-medium rounded-xl px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            Login
          </Link>
          <Link
            href="https://agents.toptiertravel.vip/signup"
            target="_blank"
            className="block text-sm font-medium rounded-xl px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            Signup
          </Link>
        </div>
      </Dropdown>

      {/* ===== Customers Dropdown ===== */}
      <Dropdown
        label={
          <div className="flex items-center gap-1.5">
            <svg
              stroke="#000"
              className="pe-1"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Customers
            {/* <ChevronDown className="w-4 h-4" /> */}
          </div>
        }
      >
        <div className="flex flex-col">
          <Link
            href="/auth/login"
            className="block text-sm font-medium rounded-xl px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="block text-sm font-medium rounded-xl px-4 py-2 text-gray-700 hover:bg-blue-50"
          >
            Signup
          </Link>
        </div>
      </Dropdown>
        </div> :
        <div className="hidden md:block">
          <ProfileDropdown/>
          </div>
        }

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon
            icon={isOpen ? "mdi:close" : "mdi:menu"}
            width={28}
            height={28}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b">
          <Link
            href="/"
            className="text-lg font-bold text-blue-800"
            onClick={() => setIsOpen(false)}
          >
            <HeaderLogo imgClass='w-32' />
          </Link>
          <button onClick={() => setIsOpen(false)}>
            <Icon icon="mdi:close" width={28} height={28} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex flex-col p-6 space-y-6 text-gray-700">
          <Link
            href="/hotels"
            className="block header-nav-item"
            onClick={() => setIsOpen(false)}
          >
            Hotels
          </Link>
          <Link
            href="/contact"
            className="block header-nav-item"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/support"
            className="block header-nav-item"
            onClick={() => setIsOpen(false)}
          >
            Support
          </Link>

          {/* Mobile Auth Buttons */}
          {!(user) ? <div className="flex flex-col gap-3 pt-4">
            <Link
              href="/auth/signup"
              className="border border-[#061026] text-[#061026] text-center rounded-full px-7 py-2 hover:bg-blue-50"
              onClick={() => setIsOpen(false)}
            >
              Sign up
            </Link>

            <Link
              href="/auth/login"
              className="bg-[#163C8C] text-center border-none hover:text-white hover:bg-gray-800 ring-0 text-white rounded-full px-9 py-2 transition"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div> :   <div className="">
          <ProfileDropdown/>
          </div>}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
    </header>
  );
};

export default HeaderMenus;