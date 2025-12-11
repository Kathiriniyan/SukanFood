import React, { useState, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { overviewEveningData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const OverviewEvening = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    return overviewEveningData.filter(
      (item) =>
        item.creatorName.toLowerCase().includes(search.toLowerCase()) ||
        item.date.includes(search) ||
        item.warehouse.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIdx, startIdx + rowsPerPage);

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages.map((num, idx) =>
      num === "..." ? (
        <span key={idx} className="px-2 py-1 text-gray-500 select-none">
          ...
        </span>
      ) : (
        <button
          key={idx}
          className={`px-3 py-1.5 rounded-lg ${
            currentPage === num
              ? "bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
          onClick={() => setCurrentPage(num)}
        >
          {num}
        </button>
      )
    );
  };

  return (
    <DashboardLayout>
      {/* Breadcrumbs */}
      <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
        <div>
          <span
            className="cursor-pointer hover:text-red-500"
            onClick={() => navigate("/")}
          >
            Dashboard
          </span>{" "}
          / <span className="font-semibold text-red-500">Overview Evening</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Filter..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-indigo-100/70 text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold border-b border-gray-300">
                ID
              </th>
              <th className="p-3 text-left font-semibold border-b border-gray-300">
                DATE
              </th>
              <th className="p-3 text-left font-semibold border-b border-gray-300">
                CREATOR NAME
              </th>
              <th className="p-3 text-right font-semibold border-b border-gray-300">
                TOTAL ITEMS
              </th>
              <th className="p-3 text-right font-semibold border-b border-gray-300">
                STOCKS
              </th>
              <th className="p-3 text-left font-semibold border-b border-gray-300">
                WAREHOUSE
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, idx) => (
              <tr
                key={row.id}
                onClick={() => navigate(`/overview/overview-evening/${encodeURIComponent(row.id)}`)}
                className={`border-b border-white/30 hover:bg-indigo-50/60 cursor-pointer transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-3 font-medium text-gray-800">{row.id}</td>
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.creatorName}</td>
                <td className="p-3 text-right">{row.totalItems}</td>
                <td className="p-3 text-right">{row.stocks}</td>
                <td className="p-3">{row.warehouse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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

export default OverviewEvening;
