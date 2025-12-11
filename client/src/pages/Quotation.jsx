import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { quotationData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

/** 600ms debounce hook for text inputs */
function useDebounce(value, delay = 600) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const Quotation = () => {
  const [data, setData] = useState([]);
  const [searchTo, setSearchTo] = useState("");
  const [searchId, setSearchId] = useState("");
  const [salesType, setSalesType] = useState(""); // placeholder "Order Type"
  const [statusFilter, setStatusFilter] = useState("None");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortExpiryAsc, setSortExpiryAsc] = useState(null);
  const [showAllRows, setShowAllRows] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mobile filters toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const rowsPerPage = 10;
  const navigate = useNavigate();

  // Debounced values for text searches
  const debTo = useDebounce(searchTo, 600);
  const debId = useDebounce(searchId, 600);

  // --- Load Data with Skeleton ---
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(quotationData);
      setLoading(false);
    }, 800); // simulate network delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = quotationData;

    if (debTo) {
      filtered = filtered.filter((item) =>
        item.customer?.toLowerCase().includes(debTo.toLowerCase())
      );
    }

    if (debId) {
      filtered = filtered.filter((item) =>
        item.quotationNo?.toLowerCase().includes(debId.toLowerCase())
      );
    }

    if (salesType) {
      filtered = filtered.filter((item) => item.type === salesType);
    }

    if (statusFilter !== "None") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((item) => item.expiryDate === dateFilter);
    }

    if (sortExpiryAsc !== null) {
      filtered = filtered.slice().sort((a, b) => {
        const dateA = new Date(a.expiryDate);
        const dateB = new Date(b.expiryDate);
        return sortExpiryAsc ? dateA - dateB : dateB - dateA;
      });
    }

    setData(filtered);
    setCurrentPage(1);
  }, [debTo, debId, salesType, statusFilter, dateFilter, sortExpiryAsc]);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = showAllRows ? data : data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const statusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-yellow-200 text-black";
      case "Draft":
        return "bg-red-200 text-black";
      case "Ordered":
        return "bg-green-200 text-black";
      case "Cancelled":
        return "bg-red-300 text-black";
      case "Lost":
        return "bg-gray-400 text-black";
      case "Partially Ordered":
        return "bg-sky-200 text-black";
      default:
        return "bg-gray-100";
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, 4, "...", totalPages);
      else if (currentPage >= totalPages - 2)
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      else pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
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

  const toggleSortExpiry = () => setSortExpiryAsc((prev) => (prev === null ? true : !prev));
  const toggleExpand = (id) => setExpandedRow(expandedRow === id ? null : id);

  return (
    <DashboardLayout>
      <div className="text-sm text-gray-400 mb-6">
        <span className="cursor-pointer hover:text-red-500">Sales</span> /{" "}
        <span className="font-semibold text-gray-700">Quotation</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h1 className="text-lg font-semibold text-gray-700">Quotation</h1>

        <div className="flex flex-wrap gap-2 items-center">
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 10h12M10 16h4M11 20h2" />
            </svg>
          </button>

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

          <button
            onClick={toggleSortExpiry}
            className="flex items-center gap-1 px-3 py-2 min-h-[40px] rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${
                sortExpiryAsc === true ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
            Last Update on
          </button>

          <button
            onClick={() => navigate("/sales/quotation/add-quotation")}
            className="px-3 py-2 min-h-[40px] rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm shadow"
          >
            + Add Quotation
          </button>
        </div>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <div className="sm:hidden mb-4 rounded-2xl border border-gray-200 bg-white p-3 shadow">
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Search by Quotation To"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
            <input
              type="text"
              placeholder="Search by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
            <select
              value={salesType}
              onChange={(e) => setSalesType(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            >
              <option value="">Order Type</option>
              <option value="Sales">Sales</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Shopping Cart">Shopping Cart</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
            >
              <option value="None">None</option>
              <option value="Open">Open</option>
              <option value="Draft">Draft</option>
              <option value="Ordered">Ordered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Partially Ordered">Partially Ordered</option>
              <option value="Lost">Lost</option>
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
          placeholder="Search by Quotation To"
          value={searchTo}
          onChange={(e) => setSearchTo(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <input
          type="text"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
        <select
          value={salesType}
          onChange={(e) => setSalesType(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        >
          <option value="">Order Type</option>
          <option value="Sales">Sales</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Shopping Cart">Shopping Cart</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        >
          <option value="None">None</option>
          <option value="Open">Open</option>
          <option value="Draft">Draft</option>
          <option value="Ordered">Ordered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Partially Ordered">Partially Ordered</option>
          <option value="Lost">Lost</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-md border border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
      </div>

      {/* Table */}
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
                  <th className="p-3 text-left font-semibold">Customer</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Created Date</th>
                  <th className="p-3 text-left font-semibold">Expiry Date</th>
                  <th className="p-3 text-left font-semibold">Order Type</th>
                  <th className="p-3 text-center font-semibold">Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-red-500">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  currentData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() =>
                        navigate(`/sales/quotation/quotation-detail/${item.quotationNo}`)
                      }
                      className="cursor-pointer border-b border-white/20 hover:bg-indigo-50/60 transition"
                    >
                      <td className="p-3">
                        <div className="font-semibold">{item.customer}</div>
                        <div className="text-xs text-gray-500">{item.quotationNo}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block w-[110px] px-3 py-1 text-black text-xs font-medium rounded-sm text-center ${statusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">{item.createdDate}</td>
                      <td className="p-3">{item.expiryDate}</td>
                      <td className="p-3">{item.type}</td>
                      <td className="p-3 font-bold text-center">
                        € {item.grandTotal.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Mobile Table */}
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
                        <div className="text-xs text-gray-500">{item.quotationNo}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-700">{item.expiryDate}</div>
                    </div>

                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        expandedRow === item.id ? "max-h-48 mt-2" : "max-h-0"
                      }`}
                    >
                      <div className="text-xs mt-1 space-y-1">
                        <div className="flex justify-between py-1">
                          <span>Status:</span>
                          <span className={`px-2 py-0.5 rounded ${statusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Created:</span>
                          <span>{item.createdDate}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>Order Type:</span>
                          <span>{item.type}</span>
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
          <div className="flex flex-wrap justify-center gap-1">{renderPageNumbers()}</div>
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

export default Quotation;
