// SalesOrder.jsx

import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { salesOrderData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

/** 600ms debounce hook for text inputs (same as Quotation.jsx) */
function useDebounce(value, delay = 600) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const SalesOrder = () => {
  const [data, setData] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [statusFilter, setStatusFilter] = useState("None");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllRows, setShowAllRows] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortDateAsc, setSortDateAsc] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const rowsPerPage = 10;
  const navigate = useNavigate();

  // Debounced values for text searches (like Quotation.jsx)
  const debCustomer = useDebounce(searchCustomer, 600);
  const debOrderId = useDebounce(searchOrderId, 600);

  // Initial "load" with skeleton
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(salesOrderData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filtering + sorting
  useEffect(() => {
    let filtered = salesOrderData;

    if (debCustomer) {
      filtered = filtered.filter((item) =>
        item.customer.toLowerCase().includes(debCustomer.toLowerCase())
      );
    }

    if (debOrderId) {
      filtered = filtered.filter((item) =>
        item.orderId.toLowerCase().includes(debOrderId.toLowerCase())
      );
    }

    if (statusFilter !== "None") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((item) => item.orderDate === dateFilter);
    }

    if (sortDateAsc !== null) {
      filtered = filtered.slice().sort((a, b) => {
        const dateA = new Date(a.orderDate);
        const dateB = new Date(b.orderDate);
        return sortDateAsc ? dateA - dateB : dateB - dateA;
      });
    }

    setData(filtered);
    setCurrentPage(1);
  }, [debCustomer, debOrderId, statusFilter, dateFilter, sortDateAsc]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentData = showAllRows ? data : data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const statusColor = (status) => {
    switch (status) {
      case "Draft":
        return "bg-red-300 text-black";
      case "To Deliver and Bill":
        return "bg-gray-200 text-red-600";
      case "Delivered":
        return "bg-green-300 text-black";
      case "Cancelled":
        return "bg-gray-400 text-black";
      default:
        return "bg-gray-100 text-black";
    }
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
        <span key={index} className="px-2 py-1 text-gray-500">
          ...
        </span>
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

  const toggleSortDate = () => setSortDateAsc((prev) => (prev === null ? true : !prev));
  const toggleExpand = (id) => setExpandedRow(expandedRow === id ? null : id);

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6">
        <span className="cursor-pointer hover:text-red-500">Sales</span> /{" "}
        <span className="font-semibold text-gray-700">Sales Order</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h1 className="text-lg font-semibold text-gray-700">Sales Orders</h1>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Mobile Filters toggle */}
          <button
            onClick={() => setShowMobileFilters((v) => !v)}
            className="p-2 rounded-md hover:bg-gray-300 transition sm:hidden"
            title="Filters"
            aria-label="Filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h18M6 10h12M10 16h4M11 20h2"
              />
            </svg>
          </button>

          {/* Show-all-rows toggle */}
          <button
            onClick={() => setShowAllRows(!showAllRows)}
            className="p-2 rounded-md hover:bg-gray-300 transition"
            title="Toggle full table"
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

          {/* Sort by order date */}
          <button
            onClick={toggleSortDate}
            className="flex items-center gap-1 px-3 py-2 min-h-[40px] rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${
                sortDateAsc === true ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            Order Date
          </button>

          {/* Add Sales Order button */}
          <button
            onClick={() => navigate("/sales/sales-order/add-sales-order")}
            className="px-3 py-2 min-h-[40px] rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm shadow"
          >
            + Add Sales Order
          </button>
        </div>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="sm:hidden mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow">
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Search by Customer"
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
            <input
              type="text"
              placeholder="Search by Order ID"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            >
              <option value="None">All Status</option>
              <option value="Draft">Draft</option>
              <option value="To Deliver and Bill">To Deliver and Bill</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />

            <div className="flex">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="ml-auto px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden sm:flex flex-wrap sm:flex-nowrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by Customer"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        >
          <option value="None">All Status</option>
          <option value="Draft">Draft</option>
          <option value="To Deliver and Bill">To Deliver and Bill</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <table className="hidden sm:table min-w-full text-sm text-gray-800">
              <thead className="bg-indigo-100/70 text-gray-700">
                <tr>
                  <th className="p-3 text-left font-semibold">Sales Order ID</th>
                  <th className="p-3 text-left font-semibold">Customer Name</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Order Date</th>
                  <th className="p-3 text-center font-semibold">Grand Total (EUR)</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-red-500">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/sales/sales-order/${item.orderId}`)}
                      className="cursor-pointer border-b border-white/20 hover:bg-indigo-50/60 transition"
                    >
                      <td className="p-3 font-semibold">{item.orderId}</td>
                      <td className="p-3">{item.customer}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block w-[140px] px-3 py-1 text-xs font-medium rounded-sm text-center ${statusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">{item.orderDate}</td>
                      <td className="p-3 font-bold text-center">
                        € {item.grandTotal.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile List (cards like Quotation.jsx) */}
            <div className="sm:hidden divide-y divide-gray-200">
              {currentData.length === 0 ? (
                <div className="p-3 text-center text-red-500">No data found.</div>
              ) : (
                currentData.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 cursor-pointer hover:bg-indigo-50/60 transition"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{item.customer}</div>
                        <div className="text-xs text-gray-500">{item.orderId}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {item.orderDate}
                      </div>
                    </div>

                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        expandedRow === item.id ? "max-h-48 mt-2" : "max-h-0"
                      }`}
                    >
                      <div className="text-xs mt-1 space-y-1">
                        <div className="flex justify-between py-1">
                          <span>Status:</span>
                          <span
                            className={`px-2 py-0.5 rounded ${statusColor(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Order Date:</span>
                          <span>{item.orderDate}</span>
                        </div>
                        <div className="flex justify-between py-1 font-bold">
                          <span>Grand Total:</span>
                          <span>€ {item.grandTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {!showAllRows && !loading && (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-between items-center mt-6 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
          >
            Prev
          </button>

          <div className="flex flex-wrap justify-center gap-1">
            {renderPageNumbers()}
          </div>

          <button
            disabled={currentPage === totalPages}
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

export default SalesOrder;
