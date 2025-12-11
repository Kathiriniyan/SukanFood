import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { purchaseOrders } from "../assets/assets";

const PurchaseOrder = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    return purchaseOrders.filter(
      (item) =>
        item.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        item.purchaseOrderId.toLowerCase().includes(search.toLowerCase()) ||
        item.receiptId.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
            currentPage === num
              ? "bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          {num}
        </button>
      )
    );
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: rowsPerPage }).map((_, i) => (
      <tr key={i} className="border-b border-white/30 animate-pulse">
        {Array.from({ length: 7 }).map((_, j) => (
          <td key={j} className="p-3">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </td>
        ))}
      </tr>
    ));
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <DashboardLayout>
      <div className="text-sm text-gray-400 mb-6">
        <span className="hover:text-red-500 cursor-pointer">Purchase</span> /{" "}
        <span className="font-semibold text-red-500">Receipt Dashboard</span>
      </div>

      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by supplier, order ID, receipt ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200"
        />
      </div>

      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20">
        <table className="min-w-full text-sm transition-opacity duration-300 ease-in-out">
          <thead className="bg-indigo-100/70 text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold">Supplier Name</th>
              <th className="p-3 text-left font-semibold">Total Quantity</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Receiving Date</th>
              <th className="p-3 text-left font-semibold hidden sm:table-cell">Purchase Order ID</th>
              <th className="p-3 text-left font-semibold hidden sm:table-cell">Purchase Receipt ID</th>
              <th className="p-3 text-left font-semibold hidden sm:table-cell">Total Net Weight</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeletonRows()
            ) : currentData.length > 0 ? (
              currentData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr
                    className="cursor-pointer border-b border-white/30 hover:bg-indigo-50/60 transition duration-200"
                    onClick={(e) => {
                      // Prevent navigating when supplier name is clicked
                      if (!e.target.closest(".supplier-name")) {
                        toggleExpand(item.id);
                      }
                    }}
                  >
                    <td className="p-3 text-gray-700">
                      <span
                        className="supplier-name cursor-pointer"
                        onClick={() => navigate(`/purchase/receipt-dashboard/${item.receiptId}`)}
                      >
                        {item.supplierName}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">{item.quantity}</td>
                    <td className="p-3 text-gray-700">{item.status}</td>
                    <td className="p-3 text-gray-700">{item.receivingDate}</td>

                    {/* Hidden on mobile */}
                    <td className="p-3 text-gray-700 hidden sm:table-cell">{item.purchaseOrderId}</td>
                    <td className="p-3 text-gray-700 hidden sm:table-cell">{item.receiptId}</td>
                    <td className="p-3 text-gray-700 hidden sm:table-cell">{item.netWeight}</td>
                  </tr>

                  {/* Expanded mobile-only row */}
                  {expandedRows[item.id] && (
                    <tr className="transition-all duration-300 bg-indigo-50">
                      <td colSpan="7" className="p-4 text-sm text-gray-600 space-y-2 sm:hidden">
                        <div><strong>Purchase Order ID:</strong> {item.purchaseOrderId}</div>
                        <div><strong>Purchase Receipt ID:</strong> {item.receiptId}</div>
                        <div><strong>Net Weight:</strong> {item.netWeight}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-5 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
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

export default PurchaseOrder;
