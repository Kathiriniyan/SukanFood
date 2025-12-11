import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { stockData } from "../assets/assets";

const EveningDetail = () => {
  const { eveningId } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const filteredData = stockData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

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
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            currentPage === num
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {num}
        </button>
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="text-sm text-gray-400 mb-6">
        <span
        className="cursor-pointer hover:text-red-500"
        >
            Dashboard 
        </span>{" "}
        / <span
          className="cursor-pointer hover:text-red-500"
          onClick={() => navigate("/overview/overview-evening")}
        >
          Overview Evening
        </span>{" "}
        / <span className="font-semibold text-gray-700">{eveningId}</span>
      </div>

      {/* Header Card */}
      <div className="backdrop-blur-lg bg-white/70 shadow-xl rounded-2xl p-6 mb-6 border border-white/20 text-sm">
        <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
          DETAILS OF STOCK DETAILS FOR EVENING
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="uppercase text-xs text-gray-500 mb-1">Stocktaking</p>
            <p className="font-medium">2025-04-15</p>
          </div>
          <div>
            <p className="uppercase text-xs text-gray-500 mb-1">Warehouse</p>
            <p className="font-medium">Stores – FC</p>
          </div>
          <div>
            <p className="uppercase text-xs text-gray-500 mb-1">Created By</p>
            <p className="font-medium">Manoj-10</p>
          </div>
          <div>
            <p className="uppercase text-xs text-gray-500 mb-1">Total Items</p>
            <p className="font-medium">{stockData.length}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-xl px-4 py-2 w-full max-w-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-indigo-100/70 text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold rounded-tl-lg">Item</th>
              <th className="p-3 text-left font-semibold">Item Code</th>
              <th className="p-3 text-center font-semibold">Stock</th>
              <th className="p-3 text-center font-semibold">Physical Stock</th>
              <th className="p-3 text-center font-semibold rounded-tr-lg">Difference</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                const diff = (item.physicalStock - item.stock).toFixed(1);
                const diffColor = diff == 0 ? "text-green-600" : "text-red-600";
                return (
                  <tr key={item.id} className="border-b border-white/30 hover:bg-indigo-50/60 transition">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-md border border-white/30 shadow-sm"
                      />
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </td>
                    <td className="p-3 text-left">{item.code}</td>
                    <td className="p-3 text-center font-medium">{item.stock}</td>
                    <td className="p-3 text-center font-medium">{item.physicalStock}</td>
                    <td className={`p-3 text-center font-semibold ${diffColor}`}>{diff}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      

      {/* Pagination - now outside the table container */}
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

export default EveningDetail;