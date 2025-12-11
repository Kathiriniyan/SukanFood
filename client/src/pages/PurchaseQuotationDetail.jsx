import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { purchaseQuotation } from "../assets/assets"; // ✅ import from assets.js

const PurchaseQuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Toggle state for mobile "Show More Details"
  const [showDetails, setShowDetails] = React.useState(false);

  const quotation = purchaseQuotation.find(
    (q) => q.id.toString() === id || q.id === Number(id)
  );

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

  return (
    <DashboardLayout>
      {/* ✅ Breadcrumb */}
      <div className="mb-4 text-sm text-gray-500 flex items-center gap-1">
        <span
          onClick={() => navigate("/purchase")}
          className="hover:text-red-500 cursor-pointer"
        >
          Purchase
        </span>
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span
          onClick={() => navigate("/purchase/quotation-dashboard")}
          className="hover:text-red-500 cursor-pointer"
        >
          Quotation Dashboard
        </span>
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-semibold text-gray-800">Order Details</span>
      </div>

      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{quotation.id}
            <span className="text-gray-500 text-base font-normal ml-3">
              {quotation.orderDate} at {quotation.orderTime}
            </span>
          </h1>
          <span
            className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full ${
              quotation.status.toLowerCase() === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {quotation.status}
          </span>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-100 px-4 py-1.5 rounded hover:bg-gray-200 text-sm font-medium">
            Print Shipping Label
          </button>
          <button className="bg-gray-100 px-4 py-1.5 rounded hover:bg-gray-200 text-sm font-medium">
            Request Pickup
          </button>
          <button className="bg-gray-100 px-4 py-1.5 rounded hover:bg-gray-200 text-sm font-medium">
            Print Order
          </button>
          <button
            onClick={() => navigate(`/purchase/quotation-dashboard/purchaseQuotationDetail/${quotation.id}/edit`)}
            className="bg-blue-600 px-4 py-1.5 rounded text-white text-sm font-medium hover:bg-blue-700"
          >
            Edit Order
          </button>
        </div>
      </div>

      {/* ✅ Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left - Order Details */}
        <div className="col-span-2 bg-white rounded shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Order Details</h2>

          {/* Products List */}
          <div className="divide-y divide-gray-200">
            {quotation.products.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-4 border-b border-gray-200"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-blue-600">{`SKU: ${p.sku}`}</div>
                  <div className="text-sm text-gray-600">{`Quantity: ${p.quantity}`}</div>
                </div>
                <div className="font-semibold">${parseFloat(p.price).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="mt-6 text-right text-sm space-y-1">
            <div>
              <span className="text-gray-600">Subtotal</span>
              <span className="ml-2 font-semibold">${quotation.price.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Shipping</span>
              <span className="ml-2">${quotation.shippingCost.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Sales tax</span>
              <span className="ml-2">${quotation.salesTax.toFixed(2)}</span>
            </div>
            <div className="font-semibold border-t border-gray-300 pt-1">
              Total
              <span className="ml-2">${quotation.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Order History */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Order History</h3>
            {quotation.orderHistory.map((history, idx) => (
              <div key={idx} className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <div className="font-semibold">{history.title}</div>
                  <div className="ml-auto text-xs text-gray-400">{history.datetime}</div>
                </div>

                {/* Status updates */}
                <div className="pl-8 border-l border-gray-300 space-y-2">
                  {history.statusUpdates.map((statusUpdate, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={`px-2 py-0.5 rounded text-xs text-white font-semibold ${statusUpdate.labelClass}`}
                      >
                        {statusUpdate.status}
                      </div>
                      <div className="text-xs text-gray-600">{statusUpdate.datetime}</div>
                      <select
                        className="ml-auto text-xs bg-gray-100 rounded border border-gray-300 px-2 py-0.5"
                        defaultValue={statusUpdate.status}
                      >
                        <option>Quick Buy</option>
                        <option>New</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Right Sidebar (with mobile toggle) */}
        <div className="space-y-8">

          {/* Mobile Toggle Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowDetails((prev) => !prev)}
              className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded font-medium shadow-sm"
            >
              {showDetails ? "Hide Details ▲" : "Show More Details ▼"}
            </button>
          </div>

          {/* Sidebar Sections (hidden by default on mobile, visible on desktop or when toggled) */}
          <div className={`${showDetails ? "block" : "hidden"} md:block space-y-8`}>

            {/* Customer Info */}
            <div className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Customer Info</h3>
                <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-green-300 flex items-center justify-center text-white text-xl font-bold">
                  {quotation.customerInfo.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{quotation.customerInfo.name}</div>
                  <div className="text-sm text-gray-600">{quotation.customerInfo.email}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    IP Address: {quotation.customerInfo.ip}
                  </div>
                </div>
              </div>
              <button className="bg-red-500 text-white px-3 py-1 rounded text-sm mb-3 hover:bg-red-600">
                Add to Blacklist
              </button>
              <div className="text-sm text-blue-600 underline cursor-pointer">
                {quotation.customerInfo.ordersCount} Orders
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Delivery Details</h3>
                <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
              </div>
              <div className="text-sm space-y-1">
                <div><strong>Speedy:</strong> {quotation.deliveryDetails.speedy}</div>
                <div><strong>Office:</strong> {quotation.deliveryDetails.office}</div>
                <div><strong>Address:</strong> {quotation.deliveryDetails.address}</div>
                <div>
                  <strong>Tracking No:</strong>{" "}
                  <a
                    href={`https://tracking.example.com/${quotation.deliveryDetails.trackingNo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {quotation.deliveryDetails.trackingNo}
                  </a>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Shipping Info</h3>
                <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
              </div>
              <div className="text-sm space-y-1">
                <div><strong>Address:</strong> {quotation.shippingInfo.address}</div>
                <div><strong>Phone:</strong> {quotation.shippingInfo.phone}</div>
                <div><strong>VAT Number:</strong> {quotation.shippingInfo.vatNumber}</div>
                <div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    View map
                  </a>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Payment Info</h3>
                <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
              </div>
              <div className="text-sm space-y-1">
                <div><strong>Payment Method:</strong> {quotation.paymentInfo.method}</div>
                <div>
                  <strong>Payment Transaction №:</strong>{" "}
                  <a href="#" className="text-blue-600 underline">
                    {quotation.paymentInfo.transactionNo}
                  </a>
                </div>
                <div>
                  <a href="#" className="text-blue-600 underline text-sm">
                    View Transactions
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PurchaseQuotationDetail;
