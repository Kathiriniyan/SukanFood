import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { purchaseQuotation } from "../assets/assets";
import { FaPrint } from "react-icons/fa";
import { FiChevronDown, FiChevronUp, FiFilter } from "react-icons/fi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const statusTabs = [
  { label: "All", color: "text-gray-800" },
  { label: "New", color: "text-green-500" },
  { label: "Pending", color: "text-yellow-400" },
  { label: "Delivered", color: "text-purple-500" },
];

const PurchaseQuotationDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState({});
  const navigate = useNavigate();

  const rowsPerPage = 3;
  const filteredData = purchaseQuotation.filter((item) => {
    const byStatus = selectedStatus === "All" ? true : item.status === selectedStatus;
    const bySearch =
      item.id.toString().includes(searchTerm) ||
      item.shippingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.products.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return byStatus && bySearch;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  useEffect(() => setCurrentPage(1), [selectedStatus, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting Payment":
        return "bg-gray-200 text-gray-700";
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders({});
      setSelectAll(false);
    } else {
      const newSel = {};
      currentData.forEach((item) => (newSel[item.id] = true));
      setSelectedOrders(newSel);
      setSelectAll(true);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedOrders((prev) => {
      const newSel = { ...prev };
      newSel[id] ? delete newSel[id] : (newSel[id] = true);
      return newSel;
    });
  };

  // Pagination page numbers with ellipsis logic
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
              ? "bg-red-600 text-white"
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
      <div className="text-sm text-gray-500 mb-6">
        <span className="hover:text-red-500 cursor-pointer">Purchase</span> /{" "}
        <span className="text-gray-800 font-medium">Quotation Dashboard</span>
      </div>

      {/* Top Section */}
      <div className="bg-white rounded-lg p-4 shadow flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center">
          <h2 className="text-lg sm:text-xl font-bold">Orders</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex items-center justify-center gap-1 border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50 w-full sm:w-auto">
              <FaPrint size={16} /> Export All
            </button>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 w-full sm:w-auto">
              + Create Order
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 font-semibold text-sm overflow-x-auto">
          {statusTabs.map(({ label, color }) => (
            <button
              key={label}
              onClick={() => setSelectedStatus(label)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                selectedStatus === label ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <span className={color}>{label}</span>
              <span
                className={`px-1 py-0.5 text-xs rounded-full ${
                  color.includes("green")
                    ? "bg-green-100 text-green-600"
                    : color.includes("yellow")
                    ? "bg-yellow-100 text-yellow-600"
                    : color.includes("purple")
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {purchaseQuotation.filter(
                  (it) => label === "All" || it.status === label
                ).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto flex-grow border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button className="flex items-center justify-center gap-1 border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50 w-full sm:w-auto">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <span className="ml-2 text-gray-600 text-sm">Select All</span>
          </label>
          <button className="bg-yellow-200 text-black text-sm px-3 py-1 rounded hover:bg-yellow-400 flex items-center gap-1">
            <FaPrint /> Print
          </button>
          <button className="bg-green-200 text-black text-sm px-3 py-1 rounded hover:bg-green-400">
            Update Order
          </button>
          <button className="bg-red-200 text-black text-sm px-3 py-1 rounded hover:bg-red-500">
            Delete
          </button>
          <button className="bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200">
            <BiDotsHorizontalRounded size={20} />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 mt-6">
        {currentData.map((item) => {
          const isExpanded = expandedCards[item.id];
          const displayProducts = isExpanded ? item.products : [item.products[0]];

          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition group relative flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-start gap-4 w-full">
                <input
                  type="checkbox"
                  className="mt-2"
                  checked={!!selectedOrders[item.id]}
                  onChange={() => handleSelectOne(item.id)}
                />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row">
                    <div className="text-sm font-semibold text-gray-800">
                      Order #{item.id}
                      <span
                        className={`ml-2 px-2 py-0.5 text-xs rounded ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-800">${item.price}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.orderDate}, {item.orderTime} | Shipping No:{" "}
                    <span className="text-blue-600 underline cursor-pointer">
                      {item.shippingNo}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    {displayProducts.map((prod, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-800">{prod.name}</div>
                          <div className="text-xs text-blue-600 underline cursor-pointer">
                            {prod.sku}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">Quantity: {prod.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {item.products.length > 1 && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="text-xs text-red-400 hover:underline mt-2 flex items-center gap-1 w-fit"
                    >
                      {isExpanded ? (
                        <>
                          Show less <FiChevronUp />
                        </>
                      ) : (
                        <>
                          Show more <FiChevronDown />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                <button className="bg-gray-100 px-3 py-1.5 rounded text-sm hover:bg-gray-200 flex items-center gap-1">
                  <FaPrint /> Print
                </button>
                <button className="bg-gray-100 px-3 py-1.5 rounded text-sm hover:bg-gray-200">
                  Update Order
                </button>
                <button
                  onClick={() =>
                    navigate(`/purchase/quotation-dashboard/purchaseQuotationDetail/${item.id}`)
                  }
                  className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
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

export default PurchaseQuotationDashboard;
