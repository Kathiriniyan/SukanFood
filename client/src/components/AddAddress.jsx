import React, { useState } from "react";

const AddAddress = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    billingAddress: "",
    contactPerson: "",
    shippingAddress: "",
    companyAddress: "",
  });

  const handleChange = (name, value) => setForm({ ...form, [name]: value });

  const handleSave = () => {
    if (
      !form.billingAddress &&
      !form.contactPerson &&
      !form.shippingAddress &&
      !form.companyAddress
    ) {
      alert("Please enter at least one field");
      return;
    }
    onSave(form); // Pass new address object to parent
    setForm({
      billingAddress: "",
      contactPerson: "",
      shippingAddress: "",
      companyAddress: "",
    });
  };

  const inputClass =
    "border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500";

  return (
    <div className="bg-gray-50 p-4 rounded-lg border mt-3">
      <h4 className="font-semibold text-gray-700 mb-3">Add New Address</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block text-gray-600 mb-1">Billing Address</label>
          <input
            type="text"
            className={inputClass}
            value={form.billingAddress}
            onChange={(e) => handleChange("billingAddress", e.target.value)}
            placeholder="Enter Billing Address"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Contact Person</label>
          <input
            type="text"
            className={inputClass}
            value={form.contactPerson}
            onChange={(e) => handleChange("contactPerson", e.target.value)}
            placeholder="Enter Contact Person"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Shipping Address</label>
          <input
            type="text"
            className={inputClass}
            value={form.shippingAddress}
            onChange={(e) => handleChange("shippingAddress", e.target.value)}
            placeholder="Enter Shipping Address"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Company Address</label>
          <input
            type="text"
            className={inputClass}
            value={form.companyAddress}
            onChange={(e) => handleChange("companyAddress", e.target.value)}
            placeholder="Enter Company Address"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddAddress;
