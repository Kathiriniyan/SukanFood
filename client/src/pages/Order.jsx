import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { pickListData } from "../assets/assets";
import { gsap } from "gsap";

const OrderPick = () => {
  const [data, setData] = useState(pickListData);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);
  const detailRef = useRef(null);

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    const filtered = pickListData.filter((item) =>
      item.customerName.toLowerCase().includes(search.toLowerCase())
    );
    setData(filtered);
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (selectedRow && detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [selectedRow]);

  const handleClose = () => {
    if (detailRef.current) {
      gsap.to(detailRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => setSelectedRow(null),
      });
    } else {
      setSelectedRow(null);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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
            currentPage === num
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
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
        <span className="cursor-pointer hover:text-indigo-500">Sales</span> /{" "}
        <span className="font-semibold text-gray-700">Pick List</span>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="🔍 Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-3 py-2 w-64 focus:ring-2 focus:ring-indigo-400 shadow-sm text-sm"
        />
      </div>

      {/* Detail Section */}
      {selectedRow && (
        <div
          ref={detailRef}
          className="backdrop-blur-lg bg-white/70 shadow-xl rounded-2xl p-5 mb-6 border border-white/20 text-sm"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-indigo-600">
              Customer Details
            </h2>
            <button
              onClick={handleClose}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <p>
              <strong>Customer:</strong> {selectedRow.customerName}
            </p>
            <p>
              <strong>Sales Order ID:</strong> {selectedRow.salesOrderId}
            </p>
            <p>
              <strong>Pick List ID:</strong> {selectedRow.pickListId}
            </p>
            <p>
              <strong>Total Quantity:</strong> {selectedRow.totalQuantity}
            </p>
            <p>
              <strong>Total Net Weight:</strong> {selectedRow.totalNetWeight}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold text-white ${
                  selectedRow.status === "Completed"
                    ? "bg-green-500"
                    : selectedRow.status === "Pending"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
              >
                {selectedRow.status}
              </span>
            </p>
            <p>
              <strong>Picking Date:</strong> {selectedRow.pickingDate}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-100/70">
            <tr>
              <th className="p-3 text-left font-semibold">Customer Name</th>
              <th className="p-3 text-left font-semibold hidden lg:table-cell">
                Sales Order ID
              </th>
              <th className="p-3 text-left font-semibold hidden lg:table-cell">
                Pick List ID
              </th>
              <th className="p-3 text-left font-semibold">Total Quantity</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Picking Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/30 hover:bg-indigo-50/60 cursor-pointer transition"
                onClick={() => setSelectedRow(row)}
              >
                <td className="p-3 font-medium text-gray-800">
                  {row.customerName}
                </td>
                <td className="p-3 hidden lg:table-cell">{row.salesOrderId}</td>
                <td className="p-3 hidden lg:table-cell">{row.pickListId}</td>
                <td className="p-3">{row.totalQuantity}</td>
                <td className="p-3">
                  <span
                    className={`inline-block min-w-[90px] text-center px-2 py-0.5 rounded-md text-xs font-semibold text-white ${
                      row.status === "Completed"
                        ? "bg-green-500"
                        : row.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="p-3">{row.pickingDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-between items-center mt-6 text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:opacity-40 hover:bg-indigo-600 transition"
        >
          Prev
        </button>

        <div className="flex flex-wrap justify-center gap-1">{renderPageNumbers()}</div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:opacity-40 hover:bg-indigo-600 transition"
        >
          Next
        </button>
      </div>
    </DashboardLayout>
  );
};

export default OrderPick;
