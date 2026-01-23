// src/pages/ItemDetail.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiSave,
  FiX,
  FiEdit3,
  FiPackage,
  FiDollarSign,
  FiGlobe,
  FiActivity,
  FiCheck,
  FiPercent,
  FiEyeOff,
  FiUpload
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { stockItems as seedStockItems } from "../assets/assets"; 

/* -------------------- CONSTANTS & HELPERS -------------------- */

const ITEM_GROUPS = ["Vegetables", "Fruits", "Leafy Greens", "Spices", "Root Crops", "Grains", "Dairy", "Meat"];
const UOMS = ["Nos", "Kg", "g", "Liter", "ml", "Box", "Pack", "Bag", "Crate", "Bundle"];
const PRODUCT_TYPES = ["Raw", "Processed", "Frozen", "Packaged", "Fresh"];
const MAT_REQ_TYPES = ["Purchase", "Pick", "Transfer", "Return"];
const VAL_METHODS = ["FIFO", "FEFO", "Moving Average", "Standard"];
const WEIGHT_UOMS = ["kg", "g", "lb", "oz"];
const COUNTRIES = ["Sri Lanka", "India", "United States", "United Kingdom", "European Union", "Singapore", "Australia", "Global"];

const fmtDate = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "numeric"
    });
  } catch { return iso; }
};

// Custom Toggle Component
const Switch = ({ checked, onChange, label, disabled }) => (
  <div className={`flex items-center justify-between p-3 border rounded-xl transition-all ${checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} ${disabled ? 'opacity-60' : ''}`}>
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

// Styled Input Helper
const InputField = ({ label, value, onChange, type = "text", disabled, suffix }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    {disabled ? (
      <div className="text-sm font-medium text-gray-800 py-2 border-b border-gray-100 min-h-[36px]">
        {value || "-"} {suffix && <span className="text-gray-400 text-xs ml-1">{suffix}</span>}
      </div>
    ) : (
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium bg-white pl-1">
            {suffix}
          </span>
        )}
      </div>
    )}
  </div>
);

// Styled Select Helper
const SelectField = ({ label, value, onChange, options, disabled }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    {disabled ? (
      <div className="text-sm font-medium text-gray-800 py-2 border-b border-gray-100 min-h-[36px]">
        {value || "-"}
      </div>
    ) : (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none bg-white"
        >
          <option value="" disabled>Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    )}
  </div>
);

/* -------------------- MODAL: EDIT HERO INFO -------------------- */

const EditHeaderModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(data);
  const fileInputRef = useRef(null);

  useEffect(() => { if (isOpen) setFormData(data); }, [isOpen, data]);

  // NEW: Logic to check if modal form is dirty
  const isHeaderDirty = useMemo(() => {
     return JSON.stringify(formData) !== JSON.stringify(data);
  }, [formData, data]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h3 className="font-semibold text-gray-800">Edit Quick Info</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><FiX /></button>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto">
                <InputField 
                  label="Product Name" 
                  value={formData.name} 
                  onChange={(v) => setFormData({ ...formData, name: v })} 
                />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                {/* Quick Stats Edit Section */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <InputField 
                      label="Current Stock" 
                      type="number"
                      value={formData.stock} 
                      onChange={(v) => setFormData({ ...formData, stock: v })} 
                    />
                    <InputField 
                      label="Price (W.P)" 
                      type="number"
                      value={formData.wpUnit} 
                      onChange={(v) => setFormData({ ...formData, wpUnit: v })} 
                      suffix="€"
                    />
                    <div className="col-span-2">
                      <InputField 
                        label="Origin" 
                        value={formData.origin} 
                        onChange={(v) => setFormData({ ...formData, origin: v })} 
                      />
                    </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Product Image</label>
                    
                    <div className="flex gap-3 items-start">
                        {/* Preview */}
                        <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <FiPackage className="text-gray-300 w-8 h-8" />
                            )}
                        </div>

                        <div className="flex-1 space-y-3">
                           {/* URL Input */}
                           <input 
                               type="text" 
                               placeholder="Enter Image URL..."
                               value={formData.image} 
                               onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                               className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                           />

                           <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400">OR</span>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs font-medium text-gray-600 hover:bg-white hover:border-red-300 transition-all"
                                >
                                     <FiUpload className="w-3.5 h-3.5" /> Upload Local
                                </button>
                           </div>
                        </div>
                    </div>
                </div>

              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-2 shrink-0 border-t border-gray-100">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
                <button 
                  onClick={handleSave} 
                  disabled={!isHeaderDirty}
                  className={`px-4 py-2 rounded-lg text-sm shadow-sm transition-all ${
                    isHeaderDirty 
                      ? "bg-red-600 text-white hover:bg-red-700" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* -------------------- MAIN COMPONENT -------------------- */

const ItemDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 1. Data Loader
  const [items, setItems] = useState(seedStockItems);

  const item = useMemo(() => items.find((x) => String(x.id) === String(id)), [items, id]);
  const [draft, setDraft] = useState(null);

  // 2. UI State
  const [activeTab, setActiveTab] = useState("details");
  
  // CHANGED: Tab-specific editing state
  // Stores the ID of the tab currently in edit mode (e.g., 'details', 'inventory') or null.
  const [editingTab, setEditingTab] = useState(null); 
  
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);

  // Initialize Draft
  useEffect(() => {
    if (item) setDraft({ ...item });
  }, [item]);

  // Check if form is dirty (has changes) for the Main Form
  const isDirty = useMemo(() => {
     if (!item || !draft) return false;
     return JSON.stringify(item) !== JSON.stringify(draft);
  }, [item, draft]);

  // Handlers
  const handleSaveMain = () => {
    const now = new Date().toISOString();
    
    // Create Log Entry
    const logEntry = {
      type: "updated",
      at: now,
      by: "Admin",
      summary: "Updated item details via dashboard",
    };

    setItems(prev => prev.map(x => {
      if (x.id === item.id) {
        return {
          ...draft,
          updatedAt: now,
          updatedBy: "Admin",
          activityLog: [...(x.activityLog || []), logEntry]
        };
      }
      return x;
    }));
    setEditingTab(null); // Exit edit mode
  };

  const handleCancelEdit = () => {
    setDraft(item); // Revert changes
    setEditingTab(null); // Exit edit mode
  };

  const handleHeaderSave = (newHeaderData) => {
    setDraft(prev => ({ ...prev, ...newHeaderData }));
    // Auto-save header changes for better UX.
    const now = new Date().toISOString();
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, ...newHeaderData, updatedAt: now } : x));
  };

  const handleToggleVisibility = () => {
    const newVal = !draft.visibility?.productVisible;
    const now = new Date().toISOString();
    
    const logEntry = {
        type: "updated",
        at: now,
        by: "Admin",
        summary: `Updated web visibility to ${newVal ? "Visible" : "Hidden"}`,
    };

    const updatedDraft = { 
      ...draft, 
      visibility: { ...draft.visibility, productVisible: newVal },
      updatedAt: now,
      activityLog: [...(draft.activityLog || []), logEntry]
    };

    setDraft(updatedDraft);
    setItems(prev => prev.map(x => x.id === item.id ? updatedDraft : x));
  };

  const handleFieldChange = (key, val) => {
    setDraft(prev => ({ ...prev, [key]: val }));
  };

  if (!item || !draft) return <div className="p-10 text-center">Loading... (Item ID: {id} not found in seed data)</div>;

  return (
    <DashboardLayout>
      {/* 1. TOP HEADER NAVIGATION & ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="text-sm text-gray-500">
            <span
              className="hover:text-red-500 cursor-pointer"
              onClick={() => navigate("/stock/dashboard")}
            >
              Inventory
            </span>{" "}
            /{" "}
            <span
              className="hover:text-red-500 cursor-pointer"
              onClick={() => navigate("/stock/dashboard")}
            >
              Product Dashboard
            </span>{" "}
            / <span className="text-gray-800 font-medium truncate">{draft.name}</span>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">

            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {draft.isActive ? "Enabled" : "Disabled"}
            </span>

            <span className={`text-xs px-2 py-1 rounded-full ${draft.visibility?.productVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {draft.visibility?.productVisible ? "Visible" : "Hidden"}
            </span>

            <span className="text-xs text-gray-500">
              Updated {fmtDate(item.updatedAt)} • {item.updatedBy || "Admin"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* WEB VISIBILITY */}
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Web Visibility
              </div>
              <div className="text-xs text-gray-600">
                {draft.visibility?.productVisible ? "Visible on website" : "Hidden from website"}
              </div>
            </div>

            <button
              onClick={handleToggleVisibility}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                draft.visibility?.productVisible ? "bg-green-500" : "bg-gray-300"
              }`}
              title="Toggle Web Visibility"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  draft.visibility?.productVisible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <FiPackage className="w-32 h-32" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          {/* Image */}
          <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50 shrink-0">
            <img src={draft.image} alt={draft.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  {draft.name}
                  <button 
                    onClick={() => setIsHeaderModalOpen(true)}
                    className="text-gray-400 hover:text-red-500 transition p-1"
                    title="Edit Quick Info"
                  >
                    <FiEdit3 className="w-5 h-5" />
                  </button>
                </h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono text-xs border border-gray-200">
                    {draft.id}
                  </span>
                  <span>•</span>
                  <span>{draft.itemGroup}</span>
                </div>
              </div>
              
              <div className="text-right hidden sm:block">
                 <div className="text-sm text-gray-400">Status</div>
                 <div className={`text-sm font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
                   draft.status === "In Stock" ? "bg-green-100 text-green-700" :
                   draft.status === "Low Stock" ? "bg-yellow-100 text-yellow-700" :
                   "bg-red-100 text-red-700"
                 }`}>
                   {draft.status}
                 </div>
              </div>
            </div>

            <p className="mt-3 text-gray-600 text-sm leading-relaxed max-w-3xl">
              {draft.description}
            </p>

            {/* INTEGRATED QUICK STATS ROW */}
            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Stock</div>
                   <div className="text-xl font-bold text-gray-900">{draft.stock}</div>
                </div>
                <div>
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Price (WP)</div>
                   <div className="text-xl font-bold text-gray-900">€{Number(draft.wpUnit).toFixed(2)}</div>
                </div>
                <div>
                   <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Origin</div>
                   <div className="text-xl font-bold text-gray-900 truncate flex items-center gap-2">
                      <FiGlobe className="w-4 h-4 text-gray-400" />
                      {draft.origin}
                   </div>
                </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2 mt-5">
              {draft.isActive ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                  <FiCheck className="w-3 h-3" /> Active Item
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                    Inactive
                </span>
              )}

              {draft.visibility?.productVisible ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                   <FiGlobe className="w-3 h-3" /> Web Visible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 text-gray-500 text-xs font-medium border border-gray-100">
                   <FiEyeOff className="w-3 h-3" /> Web Hidden
                </span>
              )}

              {draft.isMaintainStock && (
                <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                  Stock Maintained
                </span>
              )}
              {draft.isForWebshop && (
                <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                  Webshop Ready
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: TABS & FORM */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs Header */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-1.5 flex gap-1 sticky top-4 z-20 overflow-x-auto">
             {[
               { id: "details", label: "Details", icon: FiPackage },
               { id: "inventory", label: "Inventory", icon: FiActivity },
               { id: "webshop", label: "Webshop", icon: FiGlobe },
               { id: "tax", label: "Tax", icon: FiPercent }, 
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                   activeTab === tab.id 
                     ? "bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100" 
                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                 }`}
               >
                 <tab.icon className="w-4 h-4" />
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Tab Content Area */}
          <motion.div 
            layout
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative"
          >
             {/* TAB ACTION BUTTONS */}
             <div className="absolute top-6 right-6 z-10">
               {editingTab === activeTab ? (
                 <div className="flex gap-2">
                   <button 
                     onClick={handleCancelEdit}
                     className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleSaveMain}
                     disabled={!isDirty} // Disable if no changes
                     className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg shadow-sm transition-all ${
                        isDirty 
                          ? "bg-red-600 text-white hover:bg-red-700" 
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                     }`}
                   >
                     <FiSave /> Save Changes
                   </button>
                 </div>
               ) : (
                 <button 
                   onClick={() => setEditingTab(activeTab)}
                   className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
                 >
                   <FiEdit3 /> Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                 </button>
               )}
             </div>

             {/* TAB: DETAILS */}
             {activeTab === "details" && (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h3 className="text-lg font-bold text-gray-800 mb-6">General Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <SelectField 
                      label="Item Group" 
                      value={draft.itemGroup} 
                      onChange={(v) => handleFieldChange("itemGroup", v)} 
                      options={ITEM_GROUPS} 
                      disabled={editingTab !== "details"} 
                    />
                    <SelectField 
                      label="Product Type" 
                      value={draft.productType} 
                      onChange={(v) => handleFieldChange("productType", v)} 
                      options={PRODUCT_TYPES} 
                      disabled={editingTab !== "details"} 
                    />
                    <SelectField 
                      label="Default UOM" 
                      value={draft.defaultUom} 
                      onChange={(v) => handleFieldChange("defaultUom", v)} 
                      options={UOMS} 
                      disabled={editingTab !== "details"} 
                    />
                    
                    <div className="col-span-1 md:col-span-2 border-t border-gray-100 my-2 pt-4">
                       <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <FiDollarSign className="text-gray-400" /> Pricing & Valuation
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <InputField 
                            label="Valuation Rate" 
                            type="number"
                            value={draft.valuationRate} 
                            onChange={(v) => handleFieldChange("valuationRate", v)} 
                            disabled={editingTab !== "details"} 
                            suffix="EUR"
                          />
                          <InputField 
                            label="Standard Selling Rate" 
                            type="number"
                            value={draft.standardSellingRate} 
                            onChange={(v) => handleFieldChange("standardSellingRate", v)} 
                            disabled={editingTab !== "details"} 
                            suffix="EUR"
                          />
                          <InputField 
                            label="Buying Price" 
                            type="number"
                            value={draft.buyingPrice} 
                            onChange={(v) => handleFieldChange("buyingPrice", v)} 
                            disabled={editingTab !== "details"} 
                            suffix="EUR"
                          />
                       </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 border-t border-gray-100 my-2 pt-4">
                       <h4 className="text-sm font-bold text-gray-900 mb-4">Allowances</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <InputField 
                            label="Over Delivery Allowance" 
                            type="number"
                            value={draft.overDeliveryAllowancePct} 
                            onChange={(v) => handleFieldChange("overDeliveryAllowancePct", v)} 
                            disabled={editingTab !== "details"} 
                            suffix="%"
                          />
                          <InputField 
                            label="Over Billing Allowance" 
                            type="number"
                            value={draft.overBillingAllowancePct} 
                            onChange={(v) => handleFieldChange("overBillingAllowancePct", v)} 
                            disabled={editingTab !== "details"} 
                            suffix="%"
                          />
                       </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                       <Switch 
                         label="Item is Active" 
                         checked={draft.isActive} 
                         onChange={(v) => handleFieldChange("isActive", v)} 
                         disabled={editingTab !== "details"}
                       />
                       <Switch 
                         label="Allow Alternative Item" 
                         checked={draft.isAllowAlternativeItem} 
                         onChange={(v) => handleFieldChange("isAllowAlternativeItem", v)} 
                         disabled={editingTab !== "details"}
                       />
                       <Switch 
                         label="Maintain Stock" 
                         checked={draft.isMaintainStock} 
                         onChange={(v) => handleFieldChange("isMaintainStock", v)} 
                         disabled={editingTab !== "details"}
                       />
                       <Switch 
                         label="Has Variants" 
                         checked={draft.isHasVariants} 
                         onChange={(v) => handleFieldChange("isHasVariants", v)} 
                         disabled={editingTab !== "details"}
                       />
                    </div>
                 </div>
               </div>
             )}

             {/* TAB: INVENTORY */}
             {activeTab === "inventory" && (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h3 className="text-lg font-bold text-gray-800 mb-6">Inventory Settings</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Opening Stock" 
                      type="number"
                      value={draft.openingStock} 
                      onChange={(v) => handleFieldChange("openingStock", v)} 
                      disabled={editingTab !== "inventory"} 
                    />
                    <SelectField 
                      label="Valuation Method" 
                      value={draft.validationMethod} 
                      onChange={(v) => handleFieldChange("validationMethod", v)} 
                      options={VAL_METHODS} 
                      disabled={editingTab !== "inventory"} 
                    />
                    <InputField 
                      label="Shelf Life" 
                      type="number"
                      value={draft.shelfLifeDays} 
                      onChange={(v) => handleFieldChange("shelfLifeDays", v)} 
                      disabled={editingTab !== "inventory"} 
                      suffix="Days"
                    />
                    <InputField 
                      label="Warranty Period" 
                      type="number"
                      value={draft.warrantyDays} 
                      onChange={(v) => handleFieldChange("warrantyDays", v)} 
                      disabled={editingTab !== "inventory"} 
                      suffix="Days"
                    />
                    <div className="flex gap-2 items-end">
                       <div className="flex-1">
                          <InputField 
                            label="Weight Per Unit" 
                            type="number"
                            value={draft.weightPerUnit} 
                            onChange={(v) => handleFieldChange("weightPerUnit", v)} 
                            disabled={editingTab !== "inventory"} 
                          />
                       </div>
                       <div className="w-24">
                          <SelectField 
                             label="UOM"
                             value={draft.weightUom}
                             onChange={(v) => handleFieldChange("weightUom", v)}
                             options={WEIGHT_UOMS}
                             disabled={editingTab !== "inventory"}
                          />
                       </div>
                    </div>
                    <SelectField 
                      label="Default Material Request" 
                      value={draft.defaultMaterialRequestType} 
                      onChange={(v) => handleFieldChange("defaultMaterialRequestType", v)} 
                      options={MAT_REQ_TYPES} 
                      disabled={editingTab !== "inventory"} 
                    />
                    
                    <div className="col-span-1 md:col-span-2 pt-4">
                       <Switch 
                         label="Allow Negative Stock" 
                         checked={draft.isAllowNegativeStock} 
                         onChange={(v) => handleFieldChange("isAllowNegativeStock", v)} 
                         disabled={editingTab !== "inventory"}
                       />
                    </div>
                 </div>
               </div>
             )}

             {/* TAB: WEBSHOP */}
             {activeTab === "webshop" && (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h3 className="text-lg font-bold text-gray-800 mb-6">Webshop Configuration</h3>
                 
                 <div className="mb-6">
                   <Switch 
                      label="Enable for Webshop" 
                      checked={draft.isForWebshop} 
                      onChange={(v) => handleFieldChange("isForWebshop", v)} 
                      disabled={editingTab !== "webshop"}
                   />
                 </div>

                 {draft.isForWebshop && (
                   <div className="space-y-6">
                      <InputField 
                        label="Web Item Title" 
                        value={draft.webItemTitle} 
                        onChange={(v) => handleFieldChange("webItemTitle", v)} 
                        disabled={editingTab !== "webshop"} 
                      />
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Short Description</label>
                        {editingTab === "webshop" ? (
                          <textarea
                            rows={3}
                            value={draft.webSmallDescription}
                            onChange={(e) => handleFieldChange("webSmallDescription", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100">
                             {draft.webSmallDescription || "No description set."}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Long Description (HTML Support)</label>
                        {editingTab === "webshop" ? (
                          <textarea
                            rows={6}
                            value={draft.webLongDescription}
                            onChange={(e) => handleFieldChange("webLongDescription", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100 whitespace-pre-wrap">
                             {draft.webLongDescription || "No detailed description set."}
                          </div>
                        )}
                      </div>
                   </div>
                 )}
               </div>
             )}
             
             {/* TAB: TAX */}
             {activeTab === "tax" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Tax Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SelectField 
                         label="Region / Country"
                         value={draft.taxRegion || ""}
                         onChange={(v) => handleFieldChange("taxRegion", v)}
                         options={COUNTRIES}
                         disabled={editingTab !== "tax"}
                      />
                      <InputField 
                         label="Tax Percentage"
                         type="number"
                         value={draft.taxPercentage || 0}
                         onChange={(v) => handleFieldChange("taxPercentage", v)}
                         disabled={editingTab !== "tax"}
                         suffix="%"
                      />
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500">
                          <strong>Note:</strong> Tax settings applied here will be used as the default for Sales and Purchase orders created within the selected region.
                      </p>
                  </div>
                </div>
             )}

          </motion.div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
            
           {/* Activity Timeline */}
           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Activity History</h4>
                 <span className="text-xs text-blue-600 cursor-pointer hover:underline">View All</span>
              </div>
              
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                 {(draft.activityLog || []).slice(-5).reverse().map((log, idx) => (
                   <div key={idx} className="relative">
                     {/* Timeline Dot */}
                     <span className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                       log.type === 'created' ? 'bg-green-500' : 
                       log.type === 'updated' ? 'bg-blue-500' : 'bg-gray-400'
                     }`} />
                     
                     <div className="text-sm text-gray-800 font-medium leading-tight">{log.summary || log.note}</div>
                     <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                         <FiClock className="w-3 h-3" /> {fmtDate(log.at)} by {log.by}
                     </div>
                   </div>
                 ))}
                 
                 {(draft.activityLog || []).length === 0 && (
                    <div className="text-sm text-gray-400 italic">No activity recorded yet.</div>
                 )}
              </div>
           </div>

           {/* Metadata */}
           <div className="text-center">
              <p className="text-xs text-gray-400">
                 Item Created: {fmtDate(draft.createdAt)}<br/>
                 Last Updated: {fmtDate(draft.updatedAt)}
              </p>
           </div>

        </div>
      </div>

      <EditHeaderModal 
        isOpen={isHeaderModalOpen} 
        onClose={() => setIsHeaderModalOpen(false)} 
        data={draft} 
        onSave={handleHeaderSave} 
      />

    </DashboardLayout>
  );
};

export default ItemDetail;