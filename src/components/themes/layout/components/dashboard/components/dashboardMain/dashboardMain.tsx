"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetch_dashboard_data, get_profile } from "@src/actions";
import useLocale from "@hooks/useLocale";
import useDictionary from "@hooks/useDict";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20] as const;

export default function Dashboard() {
  const [filters, setFilters] = useState({
    search: "",
    payment_status: "",
  });

  const { locale } = useLocale();
  const { data: dict } = useDictionary(locale as any);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Debounce search input
  const [searchTerm, setSearchTerm] = useState("");
  useMemo(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // =============== Fetch dashboard data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "dashboard",
      pagination.page,
      pagination.limit,
      filters.search,
      filters.payment_status,
    ],
    queryFn: async () => {
      const payload = {
        page: String(pagination.page),
        limit: String(pagination.limit),
        search: filters.search,
        payment_status: filters.payment_status,
      };
      return await fetch_dashboard_data(payload);
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const bookings = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pagination.limit);

  // Count payment statuses
  const paidCount = bookings.filter((b: any) => b.payment === "paid").length;
  const unpaidCount = bookings.filter((b: any) => b.payment === "unpaid").length;
  const cancelledCount = bookings.filter((b: any) => b.payment === "cancelled").length;

  //  ========================== fetch profile data ==========
  const { data: cartResults } = useQuery({
    queryKey: ["profile"],
    queryFn: get_profile,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const {
    total_bookings = "0",
    pending_bookings = "0",
    balance = "0",
    first_name = "",
    last_name = "",
  } = cartResults?.data[0] || {};

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPagination({ page: 1, limit: Number(e.target.value) });
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Numeric Pagination Logic with Ellipsis
  const getPageNumbers = () => {
    const totalVisible = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= totalVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, pagination.page - 2);
      const end = Math.min(totalPages, pagination.page + 2);
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-gray-50 py-10 appHorizantalSpacing">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-1">
        {dict?.dashboard?.welcome_back} {first_name} {last_name}
      </h1>
      <p className="text-[#475569] text-base font-normal mb-8">
        {dict?.dashboard?.overview_text}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          label={dict?.dashboard?.wallet_balance}
          value={balance}
          sub={dict?.dashboard?.wallet_balance_sub}
          title="wallet"
        />
        <StatCard
          label={dict?.dashboard?.bookings}
          value={total_bookings}
          sub={dict?.dashboard?.bookings_sub}
          title="booking"
        />
        <StatCard
          label={dict?.dashboard?.pending_invoices}
          value={pending_bookings}
          sub={dict?.dashboard?.pending_invoices_sub}
          title="invoice"
        />
      </div>

      <div className="border border-gray-200 rounded-2xl bg-white shadow-md">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-gray-100">
          <div className="flex gap-2">
            {[
              { label: dict?.dashboard?.all, value: "", count: bookings?.length },
              { label: dict?.dashboard?.paid, value: "paid", count: paidCount },
              { label: dict?.dashboard?.unpaid, value: "unpaid", count: unpaidCount },
              { label: dict?.dashboard?.cancelled, value: "cancelled", count: cancelledCount },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, payment_status: option.value }));
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className={`px-4 py-1.5 text-xs rounded-xl border transition-colors cursor-pointer ${
                  filters.payment_status === option.value
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="text-sm">
                  {option.label} ({option.count})
                </span>
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder={dict?.dashboard?.search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-200 hover:bg-gray-100 text-sm rounded-xl w-64 px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-200"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center h-110 py-10 items-center w-full ">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-6 text-red-500">
            {(error as Error).message || "Something went wrong"}
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 min-w-full">
                <thead className="bg-[#F9FAFB] text-gray-500 uppercase text-xs whitespace-nowrap">
                  <tr>
                    <th className="py-5 px-6 text-left">{dict?.dashboard?.client_name}</th>
                    <th className="py-5 px-6 text-left">{dict?.dashboard?.booking_id}</th>
                    <th className="py-5 px-6 text-left">{dict?.dashboard?.pnr}</th>
                    <th className="py-5 px-6 text-left">{dict?.dashboard?.payment}</th>
                    <th className="py-5 px-6 text-left">{dict?.dashboard?.booking}</th>
                    <th className="py-5 px-6 text-left">{dict?.dashboard?.date}</th>
                    <th className="py-5 px-6 text-left">{dict?.dashboard?.price}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((b: any, index: number) => (
                      <tr
                        key={index}
                        className="border-t border-gray-200 hover:bg-gray-50 whitespace-nowrap"
                      >
                        <td className="py-6 px-6">{b.customer}</td>
                        <td className="py-6 px-6">#{b.reference}</td>
                        <td className="py-6 px-6">{b.pnr || "—"}</td>
                        <td className="py-6 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              b.payment === "paid"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {b.payment.charAt(0).toUpperCase() + b.payment.slice(1)}
                          </span>
                        </td>
                        <td className="py-6 px-6 capitalize">{b.service}</td>
                        <td className="py-6 px-6">{formatDate(b.date)}</td>
                        <td className="py-6 px-6">${b.total_price}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        {dict?.dashboard?.no_bookings_found}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between border-t px-8 py-6 items-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>{dict?.dashboard?.showing}</span>
                <select
                  value={pagination.limit}
                  onChange={handleLimitChange}
                  className="border border-gray-300 rounded px-2 py-1 cursor-pointer"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <span>
                  {dict?.dashboard?.of} {bookings.length} {dict?.dashboard?.entries}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded border ${
                    pagination.page === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {dict?.dashboard?.prev}
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span key={idx} className="px-2">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className={`w-8 h-8 flex items-center justify-center rounded ${
                        pagination.page === page
                          ? "bg-blue-900 text-white"
                          : "hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className={`px-3 py-1 rounded border ${
                    pagination.page === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {dict?.dashboard?.next}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ✅ Reusable Stat Card (unchanged)
function StatCard({
  label,
  value,
  sub,
  title,
}: {
  label: string;
  value: string;
  sub: string;
  title: string;
}) {
  return (
    <div className="bg-white shadow rounded-2xl p-6 border border-[#F1F5F9]">
      <div className="flex flex-col gap-4">
        <div className="text-white flex items-center justify-center bg-blue-900 p-3 w-12 h-12 rounded-lg">
          {/* SVG Icons remain unchanged */}
          {title === "wallet" ? (
            // wallet icon
            <svg
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5H9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.833 6H17.231C15.446 6 14 7.343 14 9C14 10.657 15.447 12 17.23 12H19.833"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M19.965 6C19.887 4.128 19.637 2.98 18.828 2.172C17.657 1 15.771 1 12 1H9C5.229 1 3.343 1 2.172 2.172C1.001 3.344 1 5.229 1 9C1 12.771 1 14.657 2.172 15.828C3.344 16.999 5.229 17 9 17H12"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          ) : title === "booking" ? (
            // booking icon
            <svg width="22" height="22" fill="white" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="10" stroke="white" strokeWidth="1.5" />
            </svg>
          ) : (
            // invoice icon
            <svg width="20" height="22" fill="white" viewBox="0 0 20 22">
              <rect width="18" height="20" x="1" y="1" stroke="white" strokeWidth="1.5" />
            </svg>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-normal text-[#4B5563]">{label}</p>
          <p className="text-[#111827] font-bold text-3xl">{value}</p>
          <p className="text-sm font-normal text-[#64748B]">{sub}</p>
        </div>
      </div>
    </div>
  );
}
