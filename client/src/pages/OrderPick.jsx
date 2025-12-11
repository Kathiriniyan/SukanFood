import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { pickListData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Collapse } from "react-collapse";
import { motion, AnimatePresence } from "framer-motion";

/** 600ms debounce for text inputs */
function useDebounce(value, delay = 600) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** normalize to YYYY-MM-DD for reliable date comparisons */
function yyyymmdd(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  // keep local date consistent when string lacks timezone
  const tzFixed = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000);
  return tzFixed.toISOString().slice(0, 10);
}

const OrderPick = () => {
  const navigate = useNavigate();

  // filters
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchSO, setSearchSO] = useState("");
  const [searchPick, setSearchPick] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // UI state
  const [data, setData] = useState(pickListData);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [showAllRows, setShowAllRows] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // debounced text inputs
  const debCustomer = useDebounce(searchCustomer, 600);
  const debSO = useDebounce(searchSO, 600);
  const debPick = useDebounce(searchPick, 600);

  // filtering
  useEffect(() => {
    let filtered = pickListData;

    if (debCustomer) {
      const q = debCustomer.toLowerCase();
      filtered = filtered.filter((it) => it.customerName?.toLowerCase().includes(q));
    }

    if (debSO) {
      const q = debSO.toLowerCase();
      filtered = filtered.filter((it) =>
        String(it.salesOrderId ?? "").toLowerCase().includes(q)
      );
    }

    if (debPick) {
      const q = debPick.toLowerCase();
      filtered = filtered.filter((it) =>
        String(it.pickListId ?? "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((it) => it.status === statusFilter);
    }

    if (dateFrom) {
      filtered = filtered.filter((it) => yyyymmdd(it.pickingDate) >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter((it) => yyyymmdd(it.pickingDate) <= dateTo);
    }

    setData(filtered);
    setCurrentPage(1);
  }, [debCustomer, debSO, debPick, statusFilter, dateFrom, dateTo]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = showAllRows ? data : data.slice(indexOfFirst, indexOfLast);

  const totalPagesRaw = Math.ceil(data.length / rowsPerPage);
  const totalPages = Math.max(1, totalPagesRaw);

  const toggleExpand = (id) => {
    setExpandedRowId((prevId) => (prevId === id ? null : id));
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages.map((num, index) =>
      num === "..." ? (
        <span key={index} className="px-2 py-1 text-gray-500">...</span>
      ) : (
        <button
          key={index}
          onClick={() => setCurrentPage(num)}
          className={`px-3 py-1.5 rounded-lg ${
            currentPage === num ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {num}
        </button>
      )
    );
  };

  const resetFilters = () => {
    setSearchCustomer("");
    setSearchSO("");
    setSearchPick("");
    setStatusFilter("All");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <DashboardLayout>
      {/* Top Bar: Breadcrumb + Buttons */}
      <div className="flex justify-between items-center mb-5">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400">
          <span className="cursor-pointer hover:text-red-500">Sales</span>{" "}
          / <span className="font-semibold text-gray-700">Pick List</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters((v) => !v)}
            className="p-2 rounded-md hover:bg-gray-200 transition sm:hidden"
            title="Filters"
            aria-label="Filters"
          >
            {/* Funnel icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 10h12M10 16h4M11 20h2" />
            </svg>
          </button>

          {/* Show all rows toggle */}
          <button
            onClick={() => setShowAllRows(!showAllRows)}
            className="p-2 rounded-md hover:bg-gray-200 transition"
            title="Toggle full table"
            aria-label="Toggle full table"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Filters (inline) */}
      <div className="hidden sm:flex flex-wrap items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Search customer…"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <input
          type="text"
          placeholder="Sales Order ID…"
          value={searchSO}
          onChange={(e) => setSearchSO(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <input
          type="text"
          placeholder="Pick List ID…"
          value={searchPick}
          onChange={(e) => setSearchPick(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <span className="text-gray-500 text-sm">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <button
          onClick={resetFilters}
          className="ml-auto px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Reset
        </button>
      </div>

      {/* Mobile Filters (collapsible) */}
      <AnimatePresence initial={false}>
        {showMobileFilters && (
          <motion.div
            key="mobile-filters"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow"
          >
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Search customer…"
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
              <input
                type="text"
                placeholder="Sales Order ID…"
                value={searchSO}
                onChange={(e) => setSearchSO(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
              <input
                type="text"
                placeholder="Pick List ID…"
                value={searchPick}
                onChange={(e) => setSearchPick(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  Done
                </button>
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-100/70">
            <tr>
              <th className="p-3 text-left font-semibold">Customer Name</th>
              <th className="p-3 text-left font-semibold hidden lg:table-cell">Sales Order ID</th>
              <th className="p-3 text-left font-semibold hidden lg:table-cell">Pick List ID</th>
              <th className="p-3 text-left font-semibold">Total Quantity</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Picking Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-red-500">No data found.</td>
              </tr>
            ) : (
              currentData.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Main Row */}
                  <tr
                    className="border-b border-white/30 hover:bg-indigo-50/60 cursor-pointer transition lg:cursor-default"
                    onClick={() => toggleExpand(row.id)}
                  >
                    <td
                      className="p-3 font-medium text-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/sales/order-pick/${row.pickListId}`);
                      }}
                    >
                      {row.customerName}
                    </td>
                    <td className="p-3 hidden lg:table-cell">{row.salesOrderId}</td>
                    <td className="p-3 hidden lg:table-cell">{row.pickListId}</td>
                    <td className="p-3">{row.totalQuantity}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block min-w-[90px] text-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                          row.status === "Completed"
                            ? "bg-green-200"
                            : row.status === "Pending"
                            ? "bg-sky-200"
                            : "bg-red-200"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3">{row.pickingDate}</td>
                  </tr>

                  {/* Mobile Expandable Row */}
                  <tr className="lg:hidden">
                    <td colSpan={6} className="p-0">
                      <AnimatePresence initial={false}>
                        <Collapse isOpened={expandedRowId === row.id}>
                          <motion.div
                            key={row.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                              duration: 0.4,
                              ease: [0.43, 0.13, 0.23, 0.96],
                            }}
                            className="px-4 py-3 bg-white border-t border-gray-200 text-gray-700"
                          >
                            <div className="mb-2">
                              <span className="font-semibold">Sales Order ID:</span>{" "}
                              {row.salesOrderId}
                            </div>
                            <div className="mb-2">
                              <span className="font-semibold">Pick List ID:</span>{" "}
                              {row.pickListId}
                            </div>
                            <div>
                              <span className="font-semibold">Total Quantity:</span>{" "}
                              {row.totalQuantity}
                            </div>
                          </motion.div>
                        </Collapse>
                      </AnimatePresence>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!showAllRows && (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-between items-center mt-6 text-sm">
          <button
            disabled={currentPage <= 1 || data.length === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
          >
            Prev
          </button>

          <div className="flex flex-wrap justify-center gap-1">{renderPageNumbers()}</div>

          <button
            disabled={currentPage >= totalPages || data.length === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrderPick;
