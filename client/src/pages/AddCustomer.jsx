import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const initialForm = {
  name: "",
  type: "Company",
  billingAddress: "",
  shippingAddress: "",
  companyAddress: "",
  contactPerson: "",
  email: "",
  phone: "",
  notes: "",
};

const AddCustomer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [copyBillingToShipping, setCopyBillingToShipping] = useState(true);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "billingAddress" && copyBillingToShipping) {
        next.shippingAddress = value;
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      toast.error("Customer Name is required.");
      return;
    }

    const payload = {
      name,
      type: form.type,
      billingAddress: form.billingAddress.trim(),
      shippingAddress: form.shippingAddress.trim(),
      companyAddress: form.companyAddress.trim(),
      contactPerson: form.contactPerson.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
    };

    try {
      localStorage.setItem("quotation:newCustomer", JSON.stringify(payload));
    } catch (err) {
      console.error("Failed to store new customer", err);
    }

    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const inputClass =
    "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500";

  return (
    <DashboardLayout>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        theme="colored"
      />

      {/* Breadcrumb + Back */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-400">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 mr-3 text-gray-500 hover:text-red-500"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back</span>
          </button>
          <span className="cursor-pointer hover:text-red-500">Sales</span> /{" "}
          <span className="cursor-pointer hover:text-red-500">Customer</span> /{" "}
          <span className="font-semibold text-gray-700">Add Customer</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        Add New Customer
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
        >
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Customer Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. ABC Private LTD"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Customer Type
            </label>
            <select
              className={inputClass}
              value={form.type}
              onChange={handleChange("type")}
            >
              <option value="Company">Company</option>
              <option value="Individual">Individual</option>
            </select>
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Contact Person
            </label>
            <input
              type="text"
              className={inputClass}
              value={form.contactPerson}
              onChange={handleChange("contactPerson")}
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={handleChange("email")}
              placeholder="name@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Phone
            </label>
            <input
              type="tel"
              className={inputClass}
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="+94 ..."
            />
          </div>

          {/* Billing Address */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-gray-700 font-medium">
                Billing Address
              </label>
              <label className="flex items-center gap-1 text-xs text-gray-500">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={copyBillingToShipping}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setCopyBillingToShipping(checked);
                    if (checked) {
                      setForm((prev) => ({
                        ...prev,
                        shippingAddress: prev.billingAddress,
                      }));
                    }
                  }}
                />
                <span>Copy to Shipping</span>
              </label>
            </div>
            <textarea
              className={inputClass}
              rows={2}
              value={form.billingAddress}
              onChange={handleChange("billingAddress")}
              placeholder="Billing address"
            />
          </div>

          {/* Shipping Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Shipping Address
            </label>
            <textarea
              className={inputClass}
              rows={2}
              value={form.shippingAddress}
              onChange={handleChange("shippingAddress")}
              placeholder="Shipping address"
            />
          </div>

          {/* Company Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Company Address
            </label>
            <textarea
              className={inputClass}
              rows={2}
              value={form.companyAddress}
              onChange={handleChange("companyAddress")}
              placeholder="Company registered address"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Notes (optional)
            </label>
            <textarea
              className={inputClass}
              rows={2}
              value={form.notes}
              onChange={handleChange("notes")}
              placeholder="Any additional info about this customer"
            />
          </div>

          {/* Footer buttons */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-red-600 text-sm text-white font-medium hover:bg-red-700"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddCustomer;
