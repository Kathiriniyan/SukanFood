import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pickListData } from "../assets/assets";
import { gsap } from "gsap";
import DashboardLayout from "../components/DashboardLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusOptions = [
  "Select Item Status",
  "Item not available",
  "Waiting for Shipment",
];

const PickListDetail = () => {
  const { pickListId } = useParams();
  const navigate = useNavigate();
  const detailRef = useRef(null);

  const [selectedRow, setSelectedRow] = useState(null);
  const [productList, setProductList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pickedConfirmedIds, setPickedConfirmedIds] = useState(new Set());

  // --- Load data ---
  useEffect(() => {
    const row = pickListData.find((r) => r.pickListId === pickListId);
    if (row) {
      const products = JSON.parse(JSON.stringify(row.products));

      // Scale requiredQuantity if mismatch with totalQuantity
      const currentTotal = products.reduce((sum, p) => sum + (p.requiredQuantity || 0), 0);
      const targetTotal = row.totalQuantity;

      if (currentTotal !== targetTotal && currentTotal > 0) {
        const scaleFactor = targetTotal / currentTotal;
        products.forEach((p) => {
          p.requiredQuantity = Math.round((p.requiredQuantity || 0) * scaleFactor);
        });
        let newTotal = products.reduce((sum, p) => sum + (p.requiredQuantity || 0), 0);
        let diff = targetTotal - newTotal;
        if (diff !== 0) {
          const step = diff > 0 ? 1 : -1;
          while (diff !== 0) {
            const idx = Math.floor(Math.random() * products.length);
            if (products[idx].requiredQuantity + step >= 0) {
              products[idx].requiredQuantity += step;
              diff -= step;
            }
          }
        }
      }

      // ✅ Dynamically calculate total net weight
      const totalNetWeight = products.reduce(
        (sum, p) => sum + (p.requiredQuantity || 0) * (p.weightPerUnit || 0),
        0
      );

      setSelectedRow({ ...row, totalNetWeight });
      setProductList(products);
      setPickedConfirmedIds(new Set());
    }
  }, [pickListId]);

  // --- Animations ---
  useEffect(() => {
    if (selectedRow && detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [selectedRow]);

  // --- Helpers ---
  const calculateTotalQty = (p, a) => (p || 0) + (a || 0);

  const updateQuantity = (index, field, delta) => {
    setProductList((prev) => {
      const updated = [...prev];
      const prod = updated[index];

      if (field === "pickedQuantity") {
        const newVal = Math.max(
          0,
          Math.min((prod.pickedQuantity || 0) + delta, prod.requiredQuantity)
        );
        prod.pickedQuantity = newVal;

        setPickedConfirmedIds((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.delete(prod.id);
          return newSet;
        });
        prod.additionalQuantity = 0;
      }

      if (field === "additionalQuantity") {
        prod.additionalQuantity = Math.max(0, (prod.additionalQuantity || 0) + delta);
      }

      return updated;
    });
  };

  const openRowModal = (item) => {
    if (window.innerWidth < 640) {
      setActiveItem(item);
      setSelectedStatus(item.status || "Select Item Status");
      setShowModal(true);
    }
  };

  const openStatusModal = (item, e) => {
    if (e) e.stopPropagation();
    if (window.innerWidth >= 640) {
      setActiveItem(item);
      setSelectedStatus(item.status || "Select Item Status");
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveItem(null);
  };

  const saveStatus = () => {
    if (selectedStatus === "Select Item Status") {
      toast.error("Please select a valid status");
      return;
    }
    setProductList((prev) =>
      prev.map((i) =>
        i.id === activeItem.id ? { ...i, status: selectedStatus } : i
      )
    );
    toast.success("Status updated successfully");
    closeModal();
  };

  const confirmPickedQuantity = (productId) => {
    const prod = productList.find((p) => p.id === productId);
    if (!prod || prod.pickedQuantity <= 0) {
      toast.error("Picked Quantity must be greater than 0 before confirming");
      return;
    }
    setPickedConfirmedIds((prev) => new Set(prev).add(productId));
    toast.success("Picked Quantity confirmed");
  };

  const finalizePickList = () => {
    toast.success("Pick List finalized successfully!");
  };

  if (!selectedRow) {
    return (
      <DashboardLayout>
        <div className="text-gray-600 text-sm">
          No data found for this Pick List ID.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6">
        <span
          className="cursor-pointer hover:text-red-500"
          onClick={() => navigate("/sales/order-pick")}
        >
          Pick List
        </span>{" "}
        / <span className="font-semibold text-gray-700">{selectedRow.pickListId}</span>
      </div>

      {/* Customer Details */}
      <div
        ref={detailRef}
        className="backdrop-blur-lg bg-white/70 shadow-xl rounded-2xl p-6 mb-6 border border-white/20 text-sm"
      >
        <h2 className="text-xl font-bold text-red-600 mb-4">Customer Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <p><strong>Customer:</strong> {selectedRow.customerName}</p>
          <p><strong>Sales Order ID:</strong> {selectedRow.salesOrderId}</p>
          <p><strong>Pick List ID:</strong> {selectedRow.pickListId}</p>
          <p><strong>Total Quantity:</strong> {selectedRow.totalQuantity}</p>
          <p><strong>Total Net Weight:</strong> {selectedRow.totalNetWeight}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold text-white ${
                selectedRow.status === "Completed"
                  ? "bg-green-500"
                  : selectedRow.status === "Pending"
                  ? "bg-yellow-500 text-black"
                  : "bg-blue-500"
              }`}
            >
              {selectedRow.status}
            </span>
          </p>
          <p><strong>Picking Date:</strong> {selectedRow.pickingDate}</p>
        </div>
      </div>

      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20 pb-6">
        <table className="min-w-full text-sm md:text-base table-auto">
          <thead className="bg-indigo-100/70">
            <tr>
              <th className="p-3 text-left font-semibold rounded-tl-lg">Product</th>
              <th className="p-3 text-center font-semibold hidden sm:table-cell">Country</th>
              <th className="p-3 text-center font-semibold hidden sm:table-cell">Picked Quantity</th>
              <th className="p-3 text-center font-semibold hidden sm:table-cell">Required Quantity</th>
              <th className="p-3 text-center font-semibold hidden sm:table-cell">Additional Quantity</th>
              <th className="p-3 text-center font-semibold hidden sm:table-cell">Total Quantity</th>
              <th className="p-3 text-center font-semibold hidden sm:table-cell">Weight/Unit</th>
              <th className="p-3 text-center font-semibold rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((prod, idx) => {
              const isPickedConfirmed = pickedConfirmedIds.has(prod.id);

              let rowColor = "";
              if ((prod.pickedQuantity || 0) > 0 && (prod.pickedQuantity || 0) < prod.requiredQuantity) {
                rowColor = "bg-blue-200";
              }
              if ((prod.pickedQuantity || 0) === prod.requiredQuantity && prod.requiredQuantity > 0) {
                rowColor = "bg-green-200";
              }

              return (
                <tr
                  key={prod.id}
                  className={`border-b border-white/30 transition cursor-pointer ${rowColor}`}
                  onClick={() => openRowModal(prod)}
                >
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{prod.name}</div>
                      <div className="mt-1 text-gray-600 sm:hidden">
                        Total Qty: {calculateTotalQty(prod.pickedQuantity, prod.additionalQuantity)}
                      </div>
                      <div className="text-gray-500 text-xs sm:hidden">
                        Required Qty: {prod.requiredQuantity}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center hidden sm:table-cell">{prod.country}</td>
                  <td className="p-3 hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(idx, "pickedQuantity", -1);
                        }}
                        className="w-8 h-8 rounded-md bg-red-100 text-red-600 font-bold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={prod.pickedQuantity || 0}
                        onChange={(e) => {
                          e.stopPropagation();
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          const upd = [...productList];
                          upd[idx].pickedQuantity = val;
                          setPickedConfirmedIds((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(prod.id);
                            return newSet;
                          });
                          upd[idx].additionalQuantity = 0;
                          setProductList(upd);
                        }}
                        className="w-16 text-center rounded-md border border-gray-300 px-2 py-1"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(idx, "pickedQuantity", 1);
                        }}
                        className="w-8 h-8 rounded-md bg-red-100 text-red-600 font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmPickedQuantity(prod.id);
                        }}
                        title={isPickedConfirmed ? "Confirmed" : "Confirm Picked Quantity"}
                        className={`w-8 h-8 rounded-md flex items-center justify-center font-bold ${
                          isPickedConfirmed
                            ? "bg-green-400 text-white cursor-default"
                            : "bg-green-100 text-green-600 hover:bg-green-300"
                        }`}
                        disabled={isPickedConfirmed}
                      >
                        ✓
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-center hidden sm:table-cell">{prod.requiredQuantity}</td>
                  <td className="p-3 hidden sm:table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isPickedConfirmed) return toast.error("Confirm Picked Quantity first");
                          updateQuantity(idx, "additionalQuantity", -1);
                        }}
                        className={`w-8 h-8 rounded-md font-bold ${
                          isPickedConfirmed ? "bg-yellow-100 text-yellow-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isPickedConfirmed}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={prod.additionalQuantity || 0}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (!isPickedConfirmed) return toast.error("Confirm Picked Quantity first");
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          const upd = [...productList];
                          upd[idx].additionalQuantity = val;
                          setProductList(upd);
                        }}
                        className={`w-16 text-center rounded-md border px-2 py-1 ${
                          isPickedConfirmed ? "border-yellow-400" : "border-gray-300 bg-gray-100 cursor-not-allowed"
                        }`}
                        disabled={!isPickedConfirmed}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isPickedConfirmed) return toast.error("Confirm Picked Quantity first");
                          updateQuantity(idx, "additionalQuantity", 1);
                        }}
                        className={`w-8 h-8 rounded-md font-bold ${
                          isPickedConfirmed ? "bg-yellow-100 text-yellow-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isPickedConfirmed}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-center font-semibold text-gray-900 hidden sm:table-cell">
                    {calculateTotalQty(prod.pickedQuantity, prod.additionalQuantity)}
                  </td>
                  <td className="p-3 text-center hidden sm:table-cell">{prod.weightPerUnit}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={(e) => openStatusModal(prod, e)}
                      className="text-gray-600 hover:text-red-600 focus:outline-none"
                      title="Set Status"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-center mt-6">
          <button
            onClick={finalizePickList}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg shadow-lg"
          >
            Finalize
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && activeItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 text-xl hover:text-red-500"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {window.innerWidth < 640 ? "Product Details" : "Update Status"}
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <img
                src={activeItem.image}
                alt={activeItem.name}
                className="w-20 h-20 rounded-lg border border-gray-300 object-cover"
              />
              <div>
                <div className="font-medium text-gray-800">{activeItem.name}</div>
                <div className="text-gray-500 text-sm">Origin: {activeItem.country}</div>
              </div>
            </div>

            {window.innerWidth < 640 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Picked Quantity:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        const idx = productList.findIndex((i) => i.id === activeItem.id);
                        if (idx !== -1) updateQuantity(idx, "pickedQuantity", -1);
                      }}
                      className="w-12 h-10 rounded-lg bg-red-100 text-red-600 font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={productList.find((i) => i.id === activeItem.id)?.pickedQuantity || 0}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        const idx = productList.findIndex((i) => i.id === activeItem.id);
                        if (idx !== -1) {
                          const upd = [...productList];
                          upd[idx].pickedQuantity = val;
                          setPickedConfirmedIds((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(activeItem.id);
                            return newSet;
                          });
                          upd[idx].additionalQuantity = 0;
                          setProductList(upd);
                        }
                      }}
                      className="w-full text-center border border-gray-300 rounded-md px-2 py-1"
                    />
                    <button
                      onClick={() => {
                        const idx = productList.findIndex((i) => i.id === activeItem.id);
                        if (idx !== -1) updateQuantity(idx, "pickedQuantity", 1);
                      }}
                      className="w-12 h-10 rounded-lg bg-red-100 text-red-600 font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => confirmPickedQuantity(activeItem.id)}
                      title={pickedConfirmedIds.has(activeItem.id) ? "Confirmed" : "Confirm Picked Quantity"}
                      className={`w-12 h-10 rounded-lg flex items-center justify-center font-bold ml-2 ${
                        pickedConfirmedIds.has(activeItem.id)
                          ? "bg-green-400 text-white cursor-default"
                          : "bg-green-100 text-green-600 hover:bg-green-300"
                      }`}
                      disabled={pickedConfirmedIds.has(activeItem.id)}
                    >
                      ✓
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Additional Quantity:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        if (!pickedConfirmedIds.has(activeItem.id)) return;
                        const idx = productList.findIndex((i) => i.id === activeItem.id);
                        if (idx !== -1) updateQuantity(idx, "additionalQuantity", -1);
                      }}
                      className={`w-12 h-10 rounded-lg font-bold ${
                        pickedConfirmedIds.has(activeItem.id)
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!pickedConfirmedIds.has(activeItem.id)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={productList.find((i) => i.id === activeItem.id)?.additionalQuantity || 0}
                      onChange={(e) => {
                        if (!pickedConfirmedIds.has(activeItem.id)) return;
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        const idx = productList.findIndex((i) => i.id === activeItem.id);
                        if (idx !== -1) {
                          const upd = [...productList];
                          upd[idx].additionalQuantity = val;
                          setProductList(upd);
                        }
                      }}
                      className={`w-full text-center rounded-md border px-2 py-1 ${
                        pickedConfirmedIds.has(activeItem.id)
                          ? "border-yellow-400"
                          : "border-gray-300 bg-gray-100 cursor-not-allowed"
                      }`}
                      disabled={!pickedConfirmedIds.has(activeItem.id)}
                    />
                    <button
                      onClick={() => {
                        if (!pickedConfirmedIds.has(activeItem.id)) return;
                        const idx = productList.findIndex((i) => i.id === activeItem.id);
                        if (idx !== -1) updateQuantity(idx, "additionalQuantity", 1);
                      }}
                      className={`w-12 h-10 rounded-lg font-bold ${
                        pickedConfirmedIds.has(activeItem.id)
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!pickedConfirmedIds.has(activeItem.id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Required Quantity:</label>
                  <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-center">
                    {activeItem.requiredQuantity}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Total Quantity:</label>
                  <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-center">
                    {calculateTotalQty(
                      productList.find((i) => i.id === activeItem.id)?.pickedQuantity,
                      productList.find((i) => i.id === activeItem.id)?.additionalQuantity
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Weight per Unit:</label>
                  <div className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-center">
                    {activeItem.weightPerUnit}
                  </div>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={saveStatus}
                disabled={selectedStatus === "Select Item Status"}
                className="bg-red-600 text-white px-6 py-2 rounded-md disabled:bg-red-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PickListDetail;
