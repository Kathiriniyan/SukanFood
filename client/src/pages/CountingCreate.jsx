import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { countingData } from "../assets/assets";

const SkeletonRow = ({ isMobile }) => (
  <tr className="animate-pulse border-b border-white/30">
    {isMobile
      ? [1, 2, 3].map((_, i) => (
          <td key={i} className="p-3">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </td>
        ))
      : [1, 2, 3, 4, 5, 6, 7].map((_, i) => (
          <td key={i} className="p-3">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </td>
        ))}
  </tr>
);

const CountingCreate = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [creatorName, setCreatorName] = useState("");
  const [nameError, setNameError] = useState("");
  const [creatorPromptModal, setCreatorPromptModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const rowsPerPage = 10;

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("creatorPrompted")) {
      setCreatorPromptModal(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(countingData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      `${item.name} ${item.origin} ${item.warehouse}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  const indexOfFirst = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfFirst + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePhysicalStockChange = (id, value) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, physicalStock: value } : item
      )
    );
  };

  const handleNameSubmit = () => {
    if (!creatorName.trim()) {
      setNameError("Creator name is required.");
      return;
    }
    sessionStorage.setItem("creatorPrompted", "true");
    sessionStorage.setItem("creatorName", creatorName.trim());
    setCreatorPromptModal(false);
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

    return pages.map((num, idx) =>
      num === "..." ? (
        <span key={idx} className="px-2 py-1 text-gray-500">...</span>
      ) : (
        <button
          key={idx}
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

  const toggleExpand = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {/* Creator Name Modal */}
      {creatorPromptModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Enter Creator Name</h2>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => {
                setCreatorName(e.target.value);
                setNameError("");
              }}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-400"
              placeholder="Your name..."
            />
            {nameError && <p className="text-red-500 mt-1">{nameError}</p>}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleNameSubmit}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page */}
      <DashboardLayout>
        <div className="text-sm text-gray-400 mb-6">
          <span className="hover:text-red-500 cursor-pointer">Counting</span> /{" "}
          <span className="font-semibold text-red-500">Create</span>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, origin, or warehouse..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-96 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 transition"
            disabled={loading}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white/60 rounded-2xl shadow-lg border border-white/20">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-100/70 text-gray-700">
              <tr>
                <th className="p-3 font-semibold">#No</th>
                <th className="p-3 font-semibold">Product</th>
                <th className="p-3 font-semibold">Origin</th>
                <th className="p-3 font-semibold hidden sm:table-cell">Warehouse</th>
                <th className="p-3 font-semibold hidden sm:table-cell">Stock</th>
                <th className="p-3 font-semibold hidden sm:table-cell">Physical Stock</th>
                <th className="p-3 font-semibold hidden sm:table-cell">Difference</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(rowsPerPage)
                    .fill(0)
                    .map((_, i) => <SkeletonRow key={i} isMobile={isMobile} />)
                : currentData.map((item, index) => {
                    const diff = (item.physicalStock || 0) - item.stock;
                    const isExpanded = expandedRowId === item.id;

                    return (
                      <React.Fragment key={item.id}>
                        {/* Main Row */}
                        <tr
                          onClick={() => {
                            if (isMobile) toggleExpand(item.id);
                          }}
                          className="border-b border-white/30 hover:bg-indigo-50/60 cursor-pointer transition"
                        >
                          <td className="p-3">{indexOfFirst + index + 1}</td>
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-md"
                            />
                            <span>{item.name}</span>
                          </td>
                          <td className="p-3">{item.origin}</td>
                          <td className="p-3 hidden sm:table-cell">{item.warehouse}</td>
                          <td className="p-3 hidden sm:table-cell">{item.stock}</td>
                          <td className="p-3 hidden sm:table-cell">
                            <input
                              type="number"
                              step="0.01"
                              value={item.physicalStock}
                              onChange={(e) =>
                                handlePhysicalStockChange(
                                  item.id,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-20 border rounded px-2 py-1 focus:ring-2 focus:ring-red-300"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="p-3 hidden sm:table-cell">{diff.toFixed(1)}</td>
                        </tr>

                        {/* Expanded Row for Mobile */}
                        {isMobile && isExpanded && (
                          <tr
                            className="bg-indigo-50 border-b border-white/30 transition-all duration-300 ease-in-out"
                            aria-expanded="true"
                          >
                            <td colSpan={7} className="p-4">
                              <div className="flex flex-col gap-3 text-gray-700">
                                <div>
                                  <strong>Warehouse:</strong> {item.warehouse}
                                </div>
                                <div>
                                  <strong>Stock:</strong> {item.stock}
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="font-medium">Physical Stock:</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.physicalStock}
                                    onChange={(e) =>
                                      handlePhysicalStockChange(
                                        item.id,
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-24 border rounded px-2 py-1 focus:ring-2 focus:ring-red-300"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div>
                                  <strong>Difference:</strong> {diff.toFixed(1)}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-wrap gap-2 justify-center sm:justify-between items-center mt-6 text-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
            >
              Prev
            </button>
            <div className="flex gap-1">{renderPageNumbers()}</div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition shadow-sm"
            disabled={loading}
            onClick={() => alert("Stock data saved!")}
          >
            Save Stock Data
          </button>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CountingCreate;
