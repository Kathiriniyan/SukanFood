import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { purchaseQuotation } from "../assets/assets";

const PurchaseQuotationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const quotation = purchaseQuotation.find(
    (q) => q.id.toString() === id || q.id === Number(id)
  );

  // Initialize formData without price (subtotal) because it will be computed
  const [formData, setFormData] = useState(() => ({
    customerName: quotation?.customerInfo.name || "",
    customerEmail: quotation?.customerInfo.email || "",
    customerIP: quotation?.customerInfo.ip || "",
    orderDate: quotation?.orderDate || "",
    orderTime: quotation?.orderTime || "",
    status: quotation?.status || "Processing",
    products: quotation?.products || [],
    shippingInfo: quotation?.shippingInfo || {},
    deliveryDetails: quotation?.deliveryDetails || {},
    paymentInfo: quotation?.paymentInfo || {},
    price: 0, // will be computed dynamically
    shippingCost: quotation?.shippingCost || 0,
    salesTax: quotation?.salesTax || 0,
  }));

  // Calculate subtotal whenever products change
  useEffect(() => {
    const subtotal = formData.products.reduce((sum, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.quantity) || 0;
      return sum + price * quantity;
    }, 0);
    setFormData((prev) => ({ ...prev, price: subtotal }));
  }, [formData.products]);

  if (!quotation) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-red-600">
          Quotation with ID {id} not found.
          <br />
          <button
            onClick={() => navigate("/purchase/quotation-dashboard")}
            className="mt-4 text-blue-600 underline"
          >
            ← Back to Quotation Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;
    setFormData((prev) => ({ ...prev, products: updatedProducts }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally send formData to backend here.
    console.log("Updated Quotation:", formData);
    alert("Changes saved (mock)");
    navigate(`/purchase/purchaseQuotationDetail/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Order #{quotation.id}</h1>
        <p className="text-gray-500">Update order details below.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded shadow max-w-4xl"
      >
        {/* Order Date & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Date
            </label>
            <input
              type="date"
              value={formData.orderDate}
              onChange={(e) => handleChange("orderDate", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order Time
            </label>
            <input
              type="time"
              value={formData.orderTime}
              onChange={(e) => handleChange("orderTime", e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          >
            <option>Paid</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Cancelled</option>
          </select>
        </div>

        {/* Customer Info */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Customer Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.customerEmail}
              onChange={(e) => handleChange("customerEmail", e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="IP Address"
              value={formData.customerIP}
              onChange={(e) => handleChange("customerIP", e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </div>

        {/* Products */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Products</h2>
          {formData.products.map((p, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2"
            >
              <input
                type="text"
                placeholder="Name"
                value={p.name}
                onChange={(e) =>
                  handleProductChange(index, "name", e.target.value)
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="SKU"
                value={p.sku}
                onChange={(e) =>
                  handleProductChange(index, "sku", e.target.value)
                }
                className="border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={p.quantity}
                onChange={(e) =>
                  handleProductChange(index, "quantity", Number(e.target.value))
                }
                className="border px-3 py-2 rounded"
                min={0}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={p.price}
                onChange={(e) =>
                  handleProductChange(index, "price", parseFloat(e.target.value))
                }
                className="border px-3 py-2 rounded"
                min={0}
              />
            </div>
          ))}
        </div>

        {/* Shipping Info */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Shipping Info</h2>
          <input
            type="text"
            placeholder="Address"
            value={formData.shippingInfo.address}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shippingInfo: { ...prev.shippingInfo, address: e.target.value },
              }))
            }
            className="border px-3 py-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Phone"
            value={formData.shippingInfo.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shippingInfo: { ...prev.shippingInfo, phone: e.target.value },
              }))
            }
            className="border px-3 py-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="VAT Number"
            value={formData.shippingInfo.vatNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shippingInfo: { ...prev.shippingInfo, vatNumber: e.target.value },
              }))
            }
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Delivery Details */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Delivery Details</h2>
          <input
            type="text"
            placeholder="Speedy"
            value={formData.deliveryDetails.speedy}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                deliveryDetails: { ...prev.deliveryDetails, speedy: e.target.value },
              }))
            }
            className="border px-3 py-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Office"
            value={formData.deliveryDetails.office}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                deliveryDetails: { ...prev.deliveryDetails, office: e.target.value },
              }))
            }
            className="border px-3 py-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.deliveryDetails.address}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                deliveryDetails: { ...prev.deliveryDetails, address: e.target.value },
              }))
            }
            className="border px-3 py-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Tracking No"
            value={formData.deliveryDetails.trackingNo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                deliveryDetails: { ...prev.deliveryDetails, trackingNo: e.target.value },
              }))
            }
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Payment Info */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Payment Info</h2>
          <input
            type="text"
            placeholder="Method"
            value={formData.paymentInfo.method}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                paymentInfo: { ...prev.paymentInfo, method: e.target.value },
              }))
            }
            className="border px-3 py-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Transaction No"
            value={formData.paymentInfo.transactionNo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                paymentInfo: { ...prev.paymentInfo, transactionNo: e.target.value },
              }))
            }
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Pricing */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Price Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subtotal is calculated from products, disable editing */}
            <input
              type="number"
              step="0.01"
              placeholder="Subtotal"
              value={formData.price.toFixed(2)}
              readOnly
              className="border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Shipping"
              value={formData.shippingCost}
              onChange={(e) => handleChange("shippingCost", parseFloat(e.target.value) || 0)}
              className="border px-3 py-2 rounded"
              min={0}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Sales Tax"
              value={formData.salesTax}
              onChange={(e) => handleChange("salesTax", parseFloat(e.target.value) || 0)}
              className="border px-3 py-2 rounded"
              min={0}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default PurchaseQuotationEdit;
