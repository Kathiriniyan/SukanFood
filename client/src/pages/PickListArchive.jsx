import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { pickListArchiveData } from "../assets/assets";
import { Collapse } from "react-collapse";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PickListArchive = () => {
  const [data, setData] = useState(pickListArchiveData);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [expandedRowId, setExpandedRowId] = useState(null);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const navigate = useNavigate();

  useEffect(() => {
    const filtered = pickListArchiveData.filter((item) =>
      item.customerName.toLowerCase().includes(search.toLowerCase())
    );
    setData(filtered);
    setCurrentPage(1);
  }, [search]);

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

    return pages.map((num, idx) =>
      num === "..." ? (
        <span key={idx} className="px-2 py-1 text-gray-500">...</span>
      ) : (
        <button
          key={idx}
          onClick={() => setCurrentPage(num)}
          className={`px-3 py-1.5 rounded-lg ${currentPage === num ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
        >
          {num}
        </button>
      )
    );
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6">
        <span className="cursor-pointer hover:text-red-500">Sales</span> /{" "}
        <span className="font-semibold text-gray-700">Pick List Archive</span>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="🔍 Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-3 py-2 w-64 focus:ring-2 focus:ring-red-400 shadow-sm text-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-100/70">
            <tr>
              <th className="p-3 text-left font-semibold">Sales Order</th>
              <th className="p-3 text-left font-semibold hidden lg:table-cell">Delivery Note</th>
              <th className="p-3 text-left font-semibold">Customer Name</th>
              <th className="p-3 text-left font-semibold hidden lg:table-cell">Posting Date</th>
              <th className="p-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  className="border-b border-white/30 hover:bg-indigo-50/60 cursor-pointer transition lg:cursor-default"
                  onClick={() => toggleExpand(row.id)}
                >
                  <td className="p-3" onClick={() => navigate('/sales/order-pick')}>{row.salesOrderId}</td>
                  <td className="p-3 hidden lg:table-cell">{row.deliveryNoteId}</td>
                  <td className="p-3">{row.customerName}</td>
                  <td className="p-3 hidden lg:table-cell">{row.postingDate}</td>
                  <td className="p-3">
                    <span className="inline-block min-w-[90px] text-center px-2 py-0.5 rounded-md text-xs font-semibold bg-sky-200">
                      {row.status}
                    </span>
                  </td>
                </tr>

                {/* Mobile Expandable Row */}
                <tr className="lg:hidden">
                  <td colSpan={5} className="p-0">
                    <AnimatePresence initial={false}>
                      <Collapse isOpened={expandedRowId === row.id}>
                        <motion.div
                          key={row.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.5 }}
                          className="px-4 py-4 bg-white border-t border-gray-200 text-gray-700"
                        >
                          <div className="mb-2">
                            <span className="font-semibold">Delivery Note:</span>{" "}
                            {row.deliveryNoteId}
                          </div>
                          <div className="mb-2">
                            <span className="font-semibold">Posting Date:</span>{" "}
                            {row.postingDate}
                          </div>
                        </motion.div>
                      </Collapse>
                    </AnimatePresence>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
    </DashboardLayout>
  );
};

export default PickListArchive;
