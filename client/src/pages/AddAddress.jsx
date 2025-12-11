import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const AddAddress = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    billingAddress: "",
    contactPerson: "",
    shippingAddress: "",
    companyAddress: "",
  });

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSave = () => {
    // For now, just log. In real app, save to DB and redirect back
    console.log("New Address Added:", form);
    navigate("/sales/quotation/add-quotation", { state: { newAddress: form } });
  };

  const inputClass =
    "border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500";

  return (
    <DashboardLayout>
      <div className="text-sm text-gray-400 mb-6">
        <span className="cursor-pointer hover:text-red-500">Sales</span> /{" "}
        <span className="cursor-pointer hover:text-red-500">Quotation</span> /{" "}
        <span className="font-semibold text-gray-700">Add Address</span>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Address</h2>

      <div className="bg-white p-6 rounded-xl shadow border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Billing Address
            </label>
            <input
              type="text"
              className={inputClass}
              value={form.billingAddress}
              onChange={(e) => handleChange("billingAddress", e.target.value)}
              placeholder="Enter Billing Address"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Contact Person
            </label>
            <input
              type="text"
              className={inputClass}
              value={form.contactPerson}
              onChange={(e) => handleChange("contactPerson", e.target.value)}
              placeholder="Enter Contact Person"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Shipping Address
            </label>
            <input
              type="text"
              className={inputClass}
              value={form.shippingAddress}
              onChange={(e) => handleChange("shippingAddress", e.target.value)}
              placeholder="Enter Shipping Address"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Company Address
            </label>
            <input
              type="text"
              className={inputClass}
              value={form.companyAddress}
              onChange={(e) => handleChange("companyAddress", e.target.value)}
              placeholder="Enter Company Address"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Save Address
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddAddress;
