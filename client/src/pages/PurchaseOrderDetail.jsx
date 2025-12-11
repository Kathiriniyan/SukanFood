import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { purchaseOrders, purchaseOrderItems } from "../assets/assets";

const PurchaseOrderDetail = () => {
  const { purchaseReceiptId } = useParams();
  const navigate = useNavigate();
  const order = purchaseOrders.find((o) => o.receiptId === purchaseReceiptId);

  const [items, setItems] = useState(purchaseOrderItems);
  const [confirmed, setConfirmed] = useState(new Set());
  const [modal, setModal] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const activeItem = items.find((i) => i.id === activeId);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const changeQty = (id, field, delta) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const val = Math.max(0, (it[field] || 0) + delta);
          return {
            ...it,
            [field]: field === "pickedQty" ? Math.min(val, it.maxQty) : val,
          };
        }
        return it;
      })
    );

    if (field === "pickedQty") {
      setConfirmed((s) => {
        const ns = new Set(s);
        ns.delete(id);
        return ns;
      });
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, additionalQty: 0 } : it))
      );
    }
  };

  const confirm = (id) => setConfirmed((s) => new Set(s).add(id));

  const openModal = (id) => {
    if (isMobile) {
      setActiveId(id);
      setModal(true);
    }
  };

  const closeModal = () => {
    setModal(false);
    setActiveId(null);
  };

  if (!order) {
    return (
      <DashboardLayout>
        <div className="p-5 text-gray-500">Receipt not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6">
        <span
          className="cursor-pointer hover:text-red-500"
          onClick={() => navigate("/purchase/receipt-dashboard")}
        >
          Purchase
        </span>{" "}
        /{" "}
        <span
          className="hover:text-red-500 cursor-pointer"
          onClick={() => navigate("/purchase/receipt-dashboard")}
        >
          Receipt Dashboard
        </span>{" "}
        / <span className="font-semibold text-red-500">Receipt #{purchaseReceiptId}</span>
      </div>

      {/* Order Summary - Updated for proper 2-column mobile layout */}
      <div className="bg-white/60 border border-white/20 rounded-2xl shadow-xl p-6 mb-6 text-sm text-gray-700">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          <div>
            <p>
              <strong>Purchase Order Number:</strong><br />
              {order.purchaseOrderId}
            </p>
          </div>
          <div>
            <p>
              <strong>Supplier:</strong><br />
              {order.supplierName}
            </p>
          </div>
          <div>
            <p>
              <strong>Date Created:</strong><br />
              {order.receivingDate}
            </p>
          </div>
          <div>
            <p>
              <strong>Status:</strong><br />
              {order.status}
            </p>
          </div>
          <div>
            <p>
              <strong>Number of Items:</strong><br />
              {items.length}
            </p>
          </div>
          <div>
            <p>
              <strong>Purchase Receipt Name:</strong><br />
              {order.receiptId}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20 pb-6">
        <table className="min-w-full text-sm md:text-base table-auto">
          <thead className="bg-indigo-100/70">
            <tr>
              <th className="p-3 text-left font-semibold rounded-tl-lg">Item Name</th>
              <th className="p-3 text-center font-semibold">Origin</th>
              <th className="p-3 text-center font-semibold">Quality</th>
              {/* Show Picked Qty and Additional only on desktop */}
              {!isMobile && (
                <>
                  <th className="p-3 text-center font-semibold">Picked Qty</th>
                  <th className="p-3 text-center font-semibold rounded-tr-lg">Additional</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr
                key={it.id}
                className="border-b border-white/30 hover:bg-indigo-50/60"
                onClick={() => openModal(it.id)}
              >
                <td className="p-3 font-medium text-gray-800">{it.name}</td>
                <td className="p-3 text-center">{it.origin}</td>
                <td className="p-3 text-center">
                  <select
                    value={it.quality}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === it.id ? { ...x, quality: e.target.value } : x
                        )
                      )
                    }
                    className="border rounded px-2 py-1"
                    onClick={(e) => e.stopPropagation()} // prevent row click when interacting with dropdown
                  >
                    <option>Good</option>
                    <option>Average</option>
                    <option>Bad</option>
                  </select>
                </td>

                {!isMobile && (
                  <>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeQty(it.id, "pickedQty", -1);
                          }}
                          disabled={confirmed.has(it.id)}
                          className={`w-8 h-8 rounded-md font-bold ${
                            confirmed.has(it.id)
                              ? "bg-gray-300"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          −
                        </button>
                        <span>{it.pickedQty}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeQty(it.id, "pickedQty", 1);
                          }}
                          disabled={confirmed.has(it.id)}
                          className={`w-8 h-8 rounded-md font-bold ${
                            confirmed.has(it.id)
                              ? "bg-gray-300"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          +
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirm(it.id);
                          }}
                          disabled={confirmed.has(it.id)}
                          className={`w-8 h-8 rounded-md font-bold ${
                            confirmed.has(it.id)
                              ? "bg-green-400 text-white"
                              : "bg-green-100 text-green-600 hover:bg-green-300"
                          }`}
                        >
                          ✓
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeQty(it.id, "additionalQty", -1);
                          }}
                          disabled={!confirmed.has(it.id)}
                          className={`w-8 h-8 rounded-md font-bold ${
                            !confirmed.has(it.id)
                              ? "bg-gray-200 text-gray-400"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          −
                        </button>
                        <span>{it.additionalQty}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            changeQty(it.id, "additionalQty", 1);
                          }}
                          disabled={!confirmed.has(it.id)}
                          className={`w-8 h-8 rounded-md font-bold ${
                            !confirmed.has(it.id)
                              ? "bg-gray-200 text-gray-400"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Finalize Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => alert("Finalized!")}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg shadow-lg"
          >
            Finalize
          </button>
        </div>
      </div>

      {/* Mobile Modal */}
      {modal && activeItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-1">{activeItem.name}</h2>
            <p className="text-sm text-gray-500 mb-2">Weight: {activeItem.weight}kg</p>
            <p className="text-sm text-gray-500 mb-4">Origin: {activeItem.origin}</p>

            <div className="mb-4">
              <label className="block font-medium text-gray-700">Picked Quantity</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => changeQty(activeItem.id, "pickedQty", -1)}
                  disabled={confirmed.has(activeItem.id)}
                  className={`w-12 h-10 rounded-lg font-bold ${
                    confirmed.has(activeItem.id)
                      ? "bg-gray-300"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  −
                </button>
                <input
                  type="number"
                  readOnly
                  value={activeItem.pickedQty}
                  className="w-full text-center px-2 py-1 border rounded"
                />
                <button
                  onClick={() => changeQty(activeItem.id, "pickedQty", 1)}
                  disabled={confirmed.has(activeItem.id)}
                  className={`w-12 h-10 rounded-lg font-bold ${
                    confirmed.has(activeItem.id)
                      ? "bg-gray-300"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  +
                </button>
                <button
                  onClick={() => confirm(activeItem.id)}
                  disabled={confirmed.has(activeItem.id)}
                  className={`w-12 h-10 rounded-lg font-bold ${
                    confirmed.has(activeItem.id)
                      ? "bg-green-400 text-white"
                      : "bg-green-100 text-green-600 hover:bg-green-300"
                  }`}
                >
                  ✓
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium text-gray-700">Additional Quantity</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => changeQty(activeItem.id, "additionalQty", -1)}
                  disabled={!confirmed.has(activeItem.id)}
                  className={`w-12 h-10 rounded-lg font-bold ${
                    !confirmed.has(activeItem.id)
                      ? "bg-gray-200 text-gray-400"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  −
                </button>
                <input
                  type="number"
                  readOnly
                  value={activeItem.additionalQty}
                  className="w-full text-center px-2 py-1 border rounded"
                />
                <button
                  onClick={() => changeQty(activeItem.id, "additionalQty", 1)}
                  disabled={!confirmed.has(activeItem.id)}
                  className={`w-12 h-10 rounded-lg font-bold ${
                    !confirmed.has(activeItem.id)
                      ? "bg-gray-200 text-gray-400"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Quality dropdown removed from modal */}

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-red-600 text-white px-6 py-2 rounded-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PurchaseOrderDetail;
