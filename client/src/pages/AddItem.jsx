// src/pages/AddItem.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUpload,
  FiCheck,
  FiChevronRight,
  FiPackage,
  FiActivity,
  FiGlobe,
  FiPercent,
  FiSave,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Toast
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* -------------------- CONSTANTS -------------------- */

const ITEM_GROUPS = ["Vegetables", "Fruits", "Leafy Greens", "Spices", "Root Crops", "Grains", "Dairy", "Meat"];
const UOMS = ["Nos", "Kg", "g", "Liter", "ml", "Box", "Pack", "Bag", "Crate", "Bundle"];
const PRODUCT_TYPES = ["Raw", "Processed", "Frozen", "Packaged", "Fresh"];
const VAL_METHODS = ["FIFO", "FEFO", "Moving Average", "Standard"];
const COUNTRIES = ["Sri Lanka", "India", "United States", "United Kingdom", "European Union", "Singapore", "Australia", "Global"];
const LS_KEY = "stockItemsAdminData";

/* -------------------- COMPONENTS -------------------- */

const InputField = ({ label, value, onChange, type = "text", required, placeholder, suffix, disabled }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        min={type === "number" ? "0" : undefined}
        onChange={(e) => {
          let val = e.target.value;
          if (type === "number") {
            if (val < 0) val = 0;
            onChange(Number(val));
          } else {
            onChange(val);
          }
        }}
        onKeyDown={(e) => {
          if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
            e.preventDefault();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        onWheel={(e) => e.target.blur()} 
        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        }`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium bg-white pl-1 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, options, required }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none bg-white cursor-pointer"
      >
        <option value="" disabled>
          Select Option
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

const TextAreaField = ({ label, value, onChange, rows = 3, required }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
    />
  </div>
);

/* -------------------- MAIN PAGE -------------------- */

const AddItem = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    itemGroup: "",
    productType: "",
    defaultUom: "",
    image: "", 
    valuationRate: 0,
    standardSellingRate: 0,
    buyingPrice: 0,

    // Inventory
    openingStock: 0,
    stock: 0,
    shelfLifeDays: 0,
    weightPerUnit: 0,
    weightUom: "kg",

    // Webshop
    isForWebshop: false,
    webItemTitle: "",
    webSmallDescription: "",

    // Tax
    taxRegion: "",
    taxPercentage: 0,

    // Defaults
    status: "In Stock",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: "Admin",
    activityLog: [{ type: "created", at: new Date().toISOString(), by: "Admin", summary: "Item created" }],
  });

  // Generate Auto ID on Mount
  useEffect(() => {
    const randomId = "ITM-" + Math.floor(100000 + Math.random() * 900000);
    setFormData((prev) => ({ ...prev, id: randomId }));
  }, []);

  // Handlers
  const handleUpdate = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      handleUpdate("image", objectUrl);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name?.trim()) {
        toast.error("Please fill Item Name");
        return;
      }
      if (!formData.itemGroup) {
        toast.error("Please select Item Group");
        return;
      }
      if (!formData.productType) {
        toast.error("Please select Product Type");
        return;
      }
      if (!formData.defaultUom) {
        toast.error("Please select Default UOM");
        return;
      }
      if (!formData.standardSellingRate || Number(formData.standardSellingRate) <= 0) {
        toast.error("Please fill Selling Rate");
        return;
      }
    }

    if (currentStep === 2) {
      handleUpdate("stock", formData.openingStock);
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkipWebshop = () => {
    handleUpdate("isForWebshop", false);
    handleUpdate("webItemTitle", "");
    setCurrentStep(4);
  };

  const submitForm = () => {
    const existingData = localStorage.getItem(LS_KEY);
    const items = existingData ? JSON.parse(existingData) : [];
    const newItems = [...items, formData];
    localStorage.setItem(LS_KEY, JSON.stringify(newItems));

    toast.success("Item saved successfully!");
    setTimeout(() => navigate(`/stock/${id}`), 900);
  };

  // Steps Configuration
  const steps = [
    { num: 1, label: "Basic Info", icon: FiPackage },
    { num: 2, label: "Inventory", icon: FiActivity },
    { num: 3, label: "Webshop", icon: FiGlobe },
    { num: 4, label: "Tax", icon: FiPercent },
  ];

  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />

      <div className="mx-auto pb-20 px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pt-4">
          <button
            onClick={() => navigate("/stock/dashboard")}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-600 transition shrink-0 bg-white shadow-sm sm:shadow-none border sm:border-none"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Item</h1>
            <p className="text-sm text-gray-500">Create a new product in your inventory</p>
          </div>
        </div>

        {/* Responsive Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Connecting Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full" />

            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    currentStep >= step.num ? "bg-red-600 border-red-600 text-white" : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.num ? <FiCheck className="w-5 h-5" /> : step.icon && <step.icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-medium ${currentStep >= step.num ? "text-gray-900" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
                  <span className="text-xs text-red-500 font-medium">* Required</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Inputs */}
                  <div className="lg:col-span-2 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <InputField label="Item ID (Auto)" value={formData.id} disabled={true} />
                      </div>
                      <div className="sm:col-span-2">
                        <InputField
                          label="Item Name"
                          value={formData.name}
                          onChange={(v) => handleUpdate("name", v)}
                          required
                          placeholder="e.g. Red Apple"
                        />
                      </div>
                      <SelectField
                        label="Item Group"
                        value={formData.itemGroup}
                        onChange={(v) => handleUpdate("itemGroup", v)}
                        options={ITEM_GROUPS}
                        required
                      />
                      <SelectField
                        label="Product Type"
                        value={formData.productType}
                        onChange={(v) => handleUpdate("productType", v)}
                        options={PRODUCT_TYPES}
                        required
                      />
                      <div className="sm:col-span-2">
                        <TextAreaField label="Description" value={formData.description} onChange={(v) => handleUpdate("description", v)} />
                      </div>

                      <div className="sm:col-span-2 border-t border-gray-100 pt-4 mt-2">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Pricing Configuration</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <InputField
                            label="Selling Rate"
                            type="number"
                            value={formData.standardSellingRate}
                            onChange={(v) => handleUpdate("standardSellingRate", v)}
                            required
                            suffix="€"
                          />
                          <InputField
                            label="Buying Price"
                            type="number"
                            value={formData.buyingPrice}
                            onChange={(v) => handleUpdate("buyingPrice", v)}
                            suffix="€"
                          />
                          <SelectField
                            label="Default UOM"
                            value={formData.defaultUom}
                            onChange={(v) => handleUpdate("defaultUom", v)}
                            options={UOMS}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="lg:col-span-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Item Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative group h-64 flex flex-col items-center justify-center bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />

                      {imagePreview ? (
                        <div className="w-full h-full relative">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <span className="text-white text-xs font-medium bg-black/50 px-3 py-1 rounded-full">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
                            <FiUpload className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">Click or Drag to Upload</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---------------- INVENTORY ---------------- */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-800">Inventory Settings</h2>
                  <span className="text-xs text-gray-500">Important fields only</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <InputField
                    label="Opening Stock"
                    type="number"
                    value={formData.openingStock}
                    onChange={(v) => handleUpdate("openingStock", v)}
                    placeholder="0"
                  />
                  <SelectField
                    label="Valuation Method"
                    value={formData.valuationMethod}
                    onChange={(v) => handleUpdate("valuationMethod", v)}
                    options={VAL_METHODS}
                  />
                  <InputField
                    label="Shelf Life (Days)"
                    type="number"
                    value={formData.shelfLifeDays}
                    onChange={(v) => handleUpdate("shelfLifeDays", v)}
                    suffix="Days"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField
                      label="Weight Per Unit"
                      type="number"
                      value={formData.weightPerUnit}
                      onChange={(v) => handleUpdate("weightPerUnit", v)}
                    />
                    <InputField
                      label="Weight UOM"
                      value={formData.weightUom}
                      onChange={(v) => handleUpdate("weightUom", v)}
                      disabled={true}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ---------------- WEBSHOP ---------------- */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-800">Webshop Configuration</h2>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Optional</span>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Enable for Webshop</h4>
                      <p className="text-xs text-gray-500">If enabled, this item will be listed on your e-commerce site.</p>
                    </div>
                    <button
                      onClick={() => handleUpdate("isForWebshop", !formData.isForWebshop)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.isForWebshop ? "bg-red-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.isForWebshop ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {formData.isForWebshop && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <InputField
                        label="Web Listing Title"
                        value={formData.webItemTitle}
                        onChange={(v) => handleUpdate("webItemTitle", v)}
                        placeholder="Title shown on website"
                      />
                      <TextAreaField
                        label="Short Description"
                        value={formData.webSmallDescription}
                        onChange={(v) => handleUpdate("webSmallDescription", v)}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ----------------TAX ---------------- */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold text-gray-800">Tax Settings</h2>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Optional</span>
                </div>

                <div className="max-w-xl mx-auto space-y-6">
                  <SelectField
                    label="Tax Region / Country"
                    value={formData.taxRegion}
                    onChange={(v) => handleUpdate("taxRegion", v)}
                    options={COUNTRIES}
                  />
                  <InputField
                    label="Tax Percentage"
                    type="number"
                    value={formData.taxPercentage}
                    onChange={(v) => handleUpdate("taxPercentage", v)}
                    suffix="%"
                  />

                  <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-xl border border-blue-100">
                    You can configure more specific tax rules later in the settings. This percentage will apply as a default.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-gray-50 px-4 sm:px-8 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">

            <div className="w-full sm:w-auto">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {currentStep === 3 && (
                <button onClick={handleSkipWebshop} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium">
                  Skip
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-md shadow-red-200 transition"
                >
                  Next Step <FiChevronRight />
                </button>
              ) : (
                <button
                  onClick={submitForm}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-md shadow-green-200 transition"
                >
                  <FiSave /> Save Item
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddItem;
