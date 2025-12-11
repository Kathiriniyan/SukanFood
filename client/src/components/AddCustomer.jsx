import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

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

const AddCustomer = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm);
  const [copyBillingToShipping, setCopyBillingToShipping] = useState(true);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setCopyBillingToShipping(true);
    }
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

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

    onSave?.(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Add Customer</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">
                Customer Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                rows={2}
                value={form.notes}
                onChange={handleChange("notes")}
                placeholder="Any additional info about this customer"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-md bg-red-600 text-sm text-white font-medium hover:bg-red-700"
          >
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
