import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaCheck,
  FaTimes,
  FaUpload,
  FaDownload,
  FaPrint,
} from "react-icons/fa";
import Select, { components } from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import {
  productList,
  customersDummy,
  customerAddressesDB,
  currencyListDummy,
  priceListDummy,
  taxCategoryDummy,
  shippingRuleDummy,
  incotermDummy,
  taxTemplateDummy,
} from "../assets/assets";

/* ---------- React-Select decorations ---------- */
const OptionWithImage = (props) => (
  <components.Option {...props}>
    <div className="flex items-center gap-2">
      <img src={props.data.image} alt="" className="w-6 h-6 rounded object-cover" />
      <span className="truncate">{props.label}</span>
    </div>
  </components.Option>
);

const SingleValueWithImage = (props) => (
  <components.SingleValue {...props}>
    <div className="flex items-center gap-2">
      <img src={props.data.image} alt="" className="w-5 h-5 rounded object-cover" />
      <span className="truncate">{props.data.label}</span>
    </div>
  </components.SingleValue>
);

const makeOptions = (arr = []) => arr.map((v) => ({ value: v, label: v }));
const nf2 = (n) => (isFinite(n) ? Number(n).toFixed(2) : "0.00");

/*  Add Address component */
const AddAddress = ({ type, onSave, onCancel }) => {
  const [value, setValue] = useState("");

  const labels = {
    billing: "Billing Address",
    shipping: "Shipping Address",
    company: "Company Address",
    contactPersons: "Contact Person",
  };
  const label = labels[type] || "Value";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      toast.error("Please enter a value.");
      return;
    }
    onSave(value.trim());
    setValue("");
  };

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h4 className="font-semibold text-gray-700 mb-2">Add {label}</h4>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
      >
        <input
          className="border border-gray-200 rounded-md px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={label}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- Confirm Dialog Component ---------- */
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close confirmation"
          >
            <FaTimes />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600 whitespace-pre-line">{message}</p>
        </div>
        <div className="px-5 py-3 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-sm text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Component ---------- */
const AddSalesOrder = () => {
  const navigate = useNavigate();

  const todayISO = new Date().toISOString().slice(0, 10);
  const currentYear = new Date().getFullYear();

  const [activeTab, setActiveTab] = useState("Details");

  const [customerList, setCustomerList] = useState(customersDummy);
  const [addressesDB, setAddressesDB] = useState(customerAddressesDB);

  const [form, setForm] = useState({
    series: `SAL-ORD-${currentYear}`,
    createdDate: todayISO,
    expiryDate: todayISO,
    deliveryDate: todayISO,
    orderType: "",
    customer: "",
    billingAddress: "",
    contactPerson: "",
    shippingAddress: "",
    companyAddress: "",
    currency: "EUR",
    priceList: "Retail",
  });

  const [items, setItems] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [draft, setDraft] = useState(null);

  const [addSelCode, setAddSelCode] = useState(null);
  const [addSelName, setAddSelName] = useState(null);
  const [addQty, setAddQty] = useState(1);
  const [addRate, setAddRate] = useState("");
  const [addRateAuto, setAddRateAuto] = useState(true);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [currentAddressType, setCurrentAddressType] = useState("");

  const [taxCategory, setTaxCategory] = useState("");
  const [shippingRule, setShippingRule] = useState("");
  const [incoterm, setIncoterm] = useState("");
  const [taxTemplate, setTaxTemplate] = useState("");
  const [taxRows, setTaxRows] = useState([]);

  const [savedOrderId, setSavedOrderId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isPicked, setIsPicked] = useState(false);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    onConfirm: null,
  });

  const openConfirm = ({
    title,
    message,
    confirmLabel,
    cancelLabel,
    onConfirm,
  }) => {
    setConfirmState({
      isOpen: true,
      title: title || "Confirm",
      message: message || "",
      confirmLabel: confirmLabel || "Confirm",
      cancelLabel: cancelLabel || "Cancel",
      onConfirm,
    });
  };

  const closeConfirm = () =>
    setConfirmState((prev) => ({
      ...prev,
      isOpen: false,
    }));

  const inputClass =
    "border border-gray-200 rounded-md px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500";

  const codeOptions = productList.map((p) => ({
    value: p.code,
    label: p.code,
    image: p.image,
    ...p,
  }));
  const nameOptions = productList.map((p) => ({
    value: p.code,
    label: p.name,
    image: p.image,
    ...p,
  }));
  const customerOptions = customerList.map((c) => ({ value: c, label: c }));
  const currencyOptions = makeOptions(currencyListDummy);
  const priceListOptions = makeOptions(priceListDummy);

  const findProductByCode = (code) => productList.find((p) => p.code === code);

  const selectedCustomerAddresses =
    addressesDB[form.customer] || {
      billing: [],
      shipping: [],
      company: [],
      contactPersons: [],
    };

  /* ---------- Load newly added customer from AddCustomer page ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("quotation:newCustomer");
      if (!raw) return;

      const newCustomer = JSON.parse(raw);
      const name = (newCustomer?.name || "").trim();
      if (!name) {
        localStorage.removeItem("quotation:newCustomer");
        return;
      }

      // Update customer list
      setCustomerList((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      );

      // Update addresses DB
      setAddressesDB((prev) => {
        const existing =
          prev[name] || {
            billing: [],
            shipping: [],
            company: [],
            contactPersons: [],
          };

        const updated = { ...existing };

        if (newCustomer.billingAddress) {
          updated.billing = [
            ...(updated.billing || []),
            newCustomer.billingAddress,
          ];
        }
        if (newCustomer.shippingAddress) {
          updated.shipping = [
            ...(updated.shipping || []),
            newCustomer.shippingAddress,
          ];
        }
        if (newCustomer.companyAddress) {
          updated.company = [
            ...(updated.company || []),
            newCustomer.companyAddress,
          ];
        }
        if (newCustomer.contactPerson) {
          updated.contactPersons = [
            ...(updated.contactPersons || []),
            newCustomer.contactPerson,
          ];
        }

        return {
          ...prev,
          [name]: updated,
        };
      });

      // Pre-select this new customer in the form
      setForm((prev) => ({
        ...prev,
        customer: name,
        billingAddress: newCustomer.billingAddress || "",
        shippingAddress: newCustomer.shippingAddress || "",
        companyAddress: newCustomer.companyAddress || "",
        contactPerson: newCustomer.contactPerson || "",
      }));

      toast.success(`Customer "${name}" added.`);
      localStorage.removeItem("quotation:newCustomer");
    } catch (err) {
      console.error("Failed to load new customer from storage", err);
    }
  }, []);

  /* ---------- Items logic ---------- */
  const syncAddProduct = (p) => {
    if (!p) {
      setAddSelCode(null);
      setAddSelName(null);
      setAddRate("");
      setAddRateAuto(true);
      return;
    }
    setAddSelCode({ value: p.code, label: p.code, image: p.image, ...p });
    setAddSelName({ value: p.code, label: p.name, image: p.image, ...p });
    const qty = Number(addQty || 1);
    setAddRate(Number(p.rate) * qty);
    setAddRateAuto(true);
    if (!addQty || Number(addQty) < 1) setAddQty(1);
  };

  const onAddSelectCode = (opt) =>
    syncAddProduct(opt ? findProductByCode(opt.value) : null);
  const onAddSelectName = (opt) =>
    syncAddProduct(opt ? findProductByCode(opt.value) : null);

  const addItem = () => {
    if (!form.customer) {
      toast.error("Please select a Customer first.");
      return;
    }
    if (!addSelCode || !addSelName) {
      toast.error("Please select Item Code or Item Name.");
      return;
    }
    const prod = findProductByCode(addSelCode.value);
    const qty = Math.max(1, Number(addQty || 1));
    const lineTotal = Number(addRate || Number(prod.rate || 0) * qty);

    if (lineTotal <= 0) {
      toast.error("Line total must be greater than 0.");
      return;
    }

    const newItem = {
      id: Date.now(),
      product: prod,
      qty,
      rate: lineTotal,
    };
    setItems((prev) => [...prev, newItem]);

    setAddSelCode(null);
    setAddSelName(null);
    setAddQty(1);
    setAddRate("");
    setAddRateAuto(true);
    toast.success("Item added.");
  };

  /* ---------- Edit row logic ---------- */
  const beginEdit = (row) => {
    setEditRowId(row.id);
    const isAuto =
      Number(row.rate) === Number(row.product.rate || 0) * Number(row.qty || 1);
    setDraft({
      id: row.id,
      codeSel: {
        value: row.product.code,
        label: row.product.code,
        image: row.product.image,
        ...row.product,
      },
      nameSel: {
        value: row.product.code,
        label: row.product.name,
        image: row.product.image,
        ...row.product,
      },
      qty: row.qty,
      rate: row.rate,
      auto: isAuto,
    });
  };

  const cancelEdit = () => {
    setEditRowId(null);
    setDraft(null);
    toast.info("Edit cancelled.");
  };

  const saveEdit = () => {
    if (!draft?.codeSel || !draft?.nameSel) {
      toast.error("Please select Item Code or Item Name.");
      return;
    }
    const prod = findProductByCode(draft.codeSel.value);
    const qty = Math.max(1, Number(draft.qty || 1));
    const lineTotal = Number(draft.rate || Number(prod.rate || 0) * qty);
    if (lineTotal <= 0) {
      toast.error("Line total must be greater than 0.");
      return;
    }
    setItems((prev) =>
      prev.map((it) =>
        it.id === draft.id ? { ...it, product: prod, qty, rate: lineTotal } : it
      )
    );
    cancelEdit();
    toast.success("Item updated.");
  };

  const onEditSelectCode = (opt) => {
    if (!opt) {
      setDraft((d) => ({ ...d, codeSel: null, nameSel: null }));
      return;
    }
    const p = findProductByCode(opt.value);
    setDraft((d) => {
      const qty = Number(d.qty || 1);
      const newRate = d.auto ? Number(p.rate || 0) * qty : Number(d.rate || 0);
      return {
        ...d,
        codeSel: { value: p.code, label: p.code, image: p.image, ...p },
        nameSel: { value: p.code, label: p.name, image: p.image, ...p },
        rate: newRate,
      };
    });
  };

  const onEditSelectName = (opt) => {
    if (!opt) {
      setDraft((d) => ({ ...d, codeSel: null, nameSel: null }));
      return;
    }
    const p = findProductByCode(opt.value);
    setDraft((d) => {
      const qty = Number(d.qty || 1);
      const newRate = d.auto ? Number(p.rate || 0) * qty : Number(d.rate || 0);
      return {
        ...d,
        codeSel: { value: p.code, label: p.code, image: p.image, ...p },
        nameSel: { value: p.code, label: p.name, image: p.image, ...p },
        rate: newRate,
      };
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast.warn("Item removed.");
  };

  /* ---------- Inline Add Address ---------- */
  const handleAddAddressSave = (newValue) => {
    if (!form.customer) {
      toast.error("Select a Customer first.");
      return;
    }
    const key = currentAddressType;
    if (!["billing", "shipping", "company", "contactPersons"].includes(key)) {
      toast.error("Invalid address type.");
      return;
    }

    setAddressesDB((prev) => {
      const existingForCustomer =
        prev[form.customer] || {
          billing: [],
          shipping: [],
          company: [],
          contactPersons: [],
        };

      const updatedForCustomer = {
        ...existingForCustomer,
        [key]: [...(existingForCustomer[key] || []), newValue],
      };

      return {
        ...prev,
        [form.customer]: updatedForCustomer,
      };
    });

    const mapToField = {
      billing: "billingAddress",
      shipping: "shippingAddress",
      company: "companyAddress",
      contactPersons: "contactPerson",
    };
    setForm((f) => ({ ...f, [mapToField[key]]: newValue }));
    setShowAddAddress(false);
    toast.success("Address added.");
  };

  /* ---------- Totals ---------- */
  const totalAmount = items.reduce((s, it) => s + Number(it.rate || 0), 0);
  const totalMargin = items.reduce((s, it) => {
    const totalBuy = Number(it.product.buyingRate || 0) * Number(it.qty || 0);
    const margin = Number(it.rate || 0) - totalBuy;
    return s + margin;
  }, 0);

  /* ---------- Taxes & Charges ---------- */
  useEffect(() => {
    setTaxRows((prev) =>
      prev.map((row) => {
        if (row.type === "On Net Total") {
          const rate = Number(row.rate || 0);
          return {
            ...row,
            amount: (totalAmount * rate) / 100,
          };
        }
        return row;
      })
    );
  }, [totalAmount]);

  const addTaxRow = () => {
    setTaxRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "On Net Total",
        accountHead: "",
        rate: "",
        amount: 0,
      },
    ]);
  };

  const updateTaxRow = (id, patch, recompute = false) => {
    setTaxRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, ...patch };
        if (recompute || next.type === "On Net Total") {
          const rate = Number(next.rate || 0);
          next.amount =
            next.type === "On Net Total"
              ? (totalAmount * rate) / 100
              : Number(next.amount || 0);
        }
        return next;
      })
    );
  };

  const deleteTaxRow = (id) => {
    setTaxRows((prev) => prev.filter((r) => r.id !== id));
  };

  const taxTotal = taxRows.reduce((s, r) => s + Number(r.amount || 0), 0);
  const grandTotal = totalAmount + taxTotal;

  /* ---------- File actions (upload / download / print) ---------- */
  const handleUploadFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`Uploaded "${file.name}" (dummy only, not processed).`);
    }
    e.target.value = "";
  };

  const buildCurrentPayload = (orderId) => ({
    orderId,
    form,
    items,
    taxes: {
      taxCategory,
      shippingRule,
      incoterm,
      taxTemplate,
      taxRows,
      taxTotal,
    },
    totals: { totalAmount, totalMargin, grandTotal },
    status: {
      isSaved,
      isSubmitted,
      isCancelled,
      isPicked,
    },
    createdAt: new Date().toISOString(),
  });

  const handleDownloadSalesOrder = () => {
    const payload = buildCurrentPayload(savedOrderId || "DRAFT");
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.series || "sales-order"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.info("Downloaded current sales order data (JSON).");
  };

  const handlePrintSalesOrder = () => {
    window.print();
  };

  /* ---------- Save / Submit / Cancel / Pick / Amend flow ---------- */
  const validateBeforeSave = () => {
    if (!form.customer) {
      toast.error("Please select a Customer before saving.");
      return false;
    }
    if (!items.length) {
      toast.error("Please add at least one item before saving.");
      return false;
    }
    if (
      form.createdDate &&
      form.expiryDate &&
      form.expiryDate < form.createdDate
    ) {
      toast.error("Expiry Date cannot be before Order Date.");
      return false;
    }
    return true;
  };

  const handleSaveSalesOrder = () => {
    if (!validateBeforeSave()) return;

    openConfirm({
      title: "Save Sales Order",
      message: "Do you want to save this sales order?",
      confirmLabel: "Save",
      onConfirm: () => {
        const orderId = savedOrderId || `SO-${Date.now()}`;
        const payload = buildCurrentPayload(orderId);

        try {
          localStorage.setItem(
            `sales-order:${orderId}`,
            JSON.stringify(payload)
          );
        } catch (e) {}

        setSavedOrderId(orderId);
        setIsSaved(true);
        setIsSubmitted(false);
        setIsCancelled(false);
        setIsPicked(false);
        toast.success("Sales Order saved. You can now submit it.");
      },
    });
  };

  const handleSubmitSalesOrder = () => {
    if (!isSaved || !savedOrderId) {
      toast.error("Please save the sales order first.");
      return;
    }
    if (isCancelled) {
      toast.error(
        "This sales order is cancelled. Amend it before submitting again."
      );
      return;
    }

    openConfirm({
      title: "Submit Sales Order",
      message: "Are you sure you want to submit this sales order?",
      confirmLabel: "Submit",
      onConfirm: () => {
        setIsSubmitted(true);
        toast.success("Sales Order submitted. You can now create an Order Pick.");
      },
    });
  };

  const handleCancelOrder = () => {
    if (!isSaved || !savedOrderId) {
      toast.error("You must save the sales order before cancelling.");
      return;
    }
    if (isPicked) {
      toast.error("Order already picked. Cannot cancel.");
      return;
    }

    openConfirm({
      title: "Cancel Sales Order",
      message: "Are you sure you want to cancel this sales order?",
      confirmLabel: "Cancel Order",
      onConfirm: () => {
        setIsCancelled(true);
        setIsSubmitted(false);
        toast.warn("Sales Order has been cancelled.");
      },
    });
  };

  const handleAmendOrder = () => {
    if (!savedOrderId) {
      toast.error("Nothing to amend. Please save first.");
      return;
    }

    openConfirm({
      title: "Amend Sales Order",
      message:
        "This will move the sales order back to Draft so you can edit and submit again.",
      confirmLabel: "Amend",
      onConfirm: () => {
        setIsCancelled(false);
        setIsSubmitted(false);
        setIsPicked(false);
        toast.info("Sales Order set to Draft. You can edit and submit again.");
      },
    });
  };

  const handleOrderPick = () => {
    if (!isSubmitted || !savedOrderId) {
      toast.error("Please submit the sales order before creating an Order Pick.");
      return;
    }
    if (isCancelled) {
      toast.error("Order is cancelled. Amend it before creating an Order Pick.");
      return;
    }

    openConfirm({
      title: "Create Order Pick",
      message: "Create Order Pick for this sales order?",
      confirmLabel: "Create",
      onConfirm: () => {
        setIsPicked(true);
        toast.success("Order Pick created (dummy).");
      },
    });
  };

  const handleHeaderCancel = () => {
    openConfirm({
      title: "Discard Changes",
      message:
        "Are you sure you want to cancel and go back? Unsaved changes will be lost.",
      confirmLabel: "Discard",
      onConfirm: () => {
        navigate("/sales/sales-order");
      },
    });
  };

  /* ---------- UI ---------- */
  return (
    <DashboardLayout>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        theme="colored"
      />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6">
        <span className="cursor-pointer hover:text-red-500">Sales</span> /{" "}
        <span
          className="cursor-pointer hover:text-red-500"
          onClick={() => navigate("/sales/sales-order")}
        >
          Sales Order
        </span>{" "}
        / <span className="font-semibold text-gray-700">Add Sales Order</span>
      </div>

      {/* Title + Top-right buttons (includes + Add Customer like AddQuotation) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0 text-gray-800">
          Input Sales Order
        </h2>

        <div className="flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => navigate("/sales/add-customer")}
            type="button"
            className="px-3 py-2 min-h-[40px] rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm shadow"
          >
            + Add Customer
          </button>
          <button
            type="button"
            onClick={handleHeaderCancel}
            className="px-3 py-2 text-xs sm:text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveSalesOrder}
            className={`px-4 py-2 text-xs sm:text-sm rounded-md text-white shadow ${
              !form.customer || !items.length
                ? "bg-red-400 opacity-70 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
            disabled={!form.customer || !items.length}
          >
            Save Sales Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 sm:mb-6">
        <div className="flex w-full overflow-x-auto -mb-px border-b border-gray-200">
          {["Details", "Address & Contact", "Pricing", "Connections"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-2 px-4 text-sm sm:text-base font-medium whitespace-nowrap focus:outline-none flex-1 sm:flex-none text-center ${
                  activeTab === tab
                    ? "border-b-2 border-red-500 text-red-600 bg-white"
                    : "border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-200 bg-gray-50 sm:bg-transparent"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main card */}
      <div className="mb-10 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        {/* Details Tab */}
        {activeTab === "Details" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-5">
              Sales Order Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 text-sm">
              {/* Series */}
              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  Series
                </label>
                <input
                  type="text"
                  className={`${inputClass} bg-gray-50 text-gray-700`}
                  value={form.series}
                  readOnly
                  disabled
                />
              </div>

              {/* Order Date */}
              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  Order Date
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.createdDate}
                  onChange={(e) => {
                    const newCreated = e.target.value;
                    setForm((prev) => {
                      let newExpiry = prev.expiryDate;
                      if (!newExpiry || newExpiry < newCreated) {
                        newExpiry = newCreated;
                      }
                      let newDelivery = prev.deliveryDate;
                      if (!newDelivery || newDelivery < newCreated) {
                        newDelivery = newCreated;
                      }
                      return {
                        ...prev,
                        createdDate: newCreated,
                        expiryDate: newExpiry,
                        deliveryDate: newDelivery,
                      };
                    });
                  }}
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className={inputClass}
                  min={form.createdDate || todayISO}
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  Delivery Date
                </label>
                <input
                  type="date"
                  className={inputClass}
                  min={form.createdDate || todayISO}
                  value={form.deliveryDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      deliveryDate: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Order Type */}
              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  Order Type <span className="text-red-600">*</span>
                </label>
                <select
                  className={inputClass}
                  value={form.orderType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      orderType: e.target.value,
                    })
                  }
                >
                  <option value="">-- Select Order Type --</option>
                  <option value="Sales">Sales</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Shopping Cart">Shopping Cart</option>
                </select>
              </div>

              {/* Customer (no popup, just select) */}
              <div>
                <label className="block text-gray-600 mb-1 font-medium">
                  Customer <span className="text-red-600">*</span>
                </label>
                <Select
                  options={customerOptions}
                  value={
                    form.customer
                      ? { value: form.customer, label: form.customer }
                      : null
                  }
                  onChange={(opt) => {
                    setForm({
                      ...form,
                      customer: opt?.value || "",
                      billingAddress: "",
                      contactPerson: "",
                      shippingAddress: "",
                      companyAddress: "",
                    });
                    if (!opt?.value) toast.info("Customer cleared.");
                  }}
                  placeholder="Select Customer"
                  isClearable
                />
              </div>
            </div>
          </div>
        )}

        {/* Address & Contact Tab */}
        {activeTab === "Address & Contact" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-5">
              Address & Contact
            </h3>

            {showAddAddress && (
              <AddAddress
                type={currentAddressType}
                onSave={handleAddAddressSave}
                onCancel={() => setShowAddAddress(false)}
              />
            )}

            {!form.customer ? (
              <div className="p-4 rounded-md border border-amber-200 bg-amber-50 text-amber-800">
                Please select a <b>Customer</b> in the Details tab to manage
                addresses.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {/* Billing Address */}
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">
                    Billing Address
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        options={makeOptions(selectedCustomerAddresses.billing)}
                        value={
                          form.billingAddress
                            ? {
                                value: form.billingAddress,
                                label: form.billingAddress,
                              }
                            : null
                        }
                        onChange={(opt) =>
                          setForm((f) => ({
                            ...f,
                            billingAddress: opt?.value || "",
                          }))
                        }
                        placeholder="Select Billing Address"
                        isClearable
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!form.customer)
                          return toast.error("Select a Customer first.");
                        setCurrentAddressType("billing");
                        setShowAddAddress(true);
                      }}
                      className="p-2.5 bg-gray-100 rounded-md hover:bg-gray-200"
                      title="Add Billing Address"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">
                    Contact Person
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        options={makeOptions(
                          selectedCustomerAddresses.contactPersons
                        )}
                        value={
                          form.contactPerson
                            ? {
                                value: form.contactPerson,
                                label: form.contactPerson,
                              }
                            : null
                        }
                        onChange={(opt) =>
                          setForm((f) => ({
                            ...f,
                            contactPerson: opt?.value || "",
                          }))
                        }
                        placeholder="Select Contact Person"
                        isClearable
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!form.customer)
                          return toast.error("Select a Customer first.");
                        setCurrentAddressType("contactPersons");
                        setShowAddAddress(true);
                      }}
                      className="p-2.5 bg-gray-100 rounded-md hover:bg-gray-200"
                      title="Add Contact Person"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">
                    Shipping Address
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        options={makeOptions(selectedCustomerAddresses.shipping)}
                        value={
                          form.shippingAddress
                            ? {
                                value: form.shippingAddress,
                                label: form.shippingAddress,
                              }
                            : null
                        }
                        onChange={(opt) =>
                          setForm((f) => ({
                            ...f,
                            shippingAddress: opt?.value || "",
                          }))
                        }
                        placeholder="Select Shipping Address"
                        isClearable
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!form.customer)
                          return toast.error("Select a Customer first.");
                        setCurrentAddressType("shipping");
                        setShowAddAddress(true);
                      }}
                      className="p-2.5 bg-gray-100 rounded-md hover:bg-gray-200"
                      title="Add Shipping Address"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                {/* Company Address */}
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">
                    Company Address
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        options={makeOptions(selectedCustomerAddresses.company)}
                        value={
                          form.companyAddress
                            ? {
                                value: form.companyAddress,
                                label: form.companyAddress,
                              }
                            : null
                        }
                        onChange={(opt) =>
                          setForm((f) => ({
                            ...f,
                            companyAddress: opt?.value || "",
                          }))
                        }
                        placeholder="Select Company Address"
                        isClearable
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!form.customer)
                          return toast.error("Select a Customer first.");
                        setCurrentAddressType("company");
                        setShowAddAddress(true);
                      }}
                      className="p-2.5 bg-gray-100 rounded-md hover:bg-gray-200"
                      title="Add Company Address"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === "Pricing" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-5">
              Price List
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Currency */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-600 font-medium">
                    Currency
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Add Currency: no backend (dummy only).")
                    }
                    className="h-8 w-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    title="Add Currency"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
                <Select
                  options={currencyOptions}
                  value={
                    form.currency
                      ? {
                          value: form.currency,
                          label: form.currency,
                        }
                      : null
                  }
                  onChange={(opt) =>
                    setForm((f) => ({
                      ...f,
                      currency: opt?.value || "",
                    }))
                  }
                  placeholder="Select Currency"
                  isClearable
                />
              </div>

              {/* Price List */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-600 font-medium">
                    Price List
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Add Price List: no backend (dummy only).")
                    }
                    className="h-8 w-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    title="Add Price List"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
                <Select
                  options={priceListOptions}
                  value={
                    form.priceList
                      ? {
                          value: form.priceList,
                          label: form.priceList,
                        }
                      : null
                  }
                  onChange={(opt) =>
                    setForm((f) => ({
                      ...f,
                      priceList: opt?.value || "",
                    }))
                  }
                  placeholder="Select Price List"
                  isClearable
                />
              </div>
            </div>
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === "Connections" && (
          <p className="text-gray-500 italic">Connections</p>
        )}
      </div>

      {/* ================== ITEMS + TAXES + TOTALS ================== */}
      {activeTab === "Details" && (
        <>
          {/* ---------------- Items Table ---------------- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Items</h3>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 bg-gray-50 text-gray-600 text-xs font-semibold uppercase px-6 py-3 border-b border-gray-200">
              <div className="col-span-2 px-2">Item Code</div>
              <div className="col-span-2 px-2">Item Name</div>
              <div className="col-span-1 px-2 text-right">Quantity*</div>
              <div className="col-span-1 px-2">Weight Per Unit*</div>
              <div className="col-span-1 px-2 text-right">Rate (EUR)</div>
              <div className="col-span-1 px-2 text-right">Buying Rate (EUR)</div>
              <div className="col-span-1 px-2 text-right">Margin Amount</div>
              <div className="col-span-1 px-2 text-right">
                Margin Percentage
              </div>
              <div className="col-span-1 px-2 text-right">Amount (EUR)</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>

            {/* Existing Rows */}
            {items.length === 0 && (
              <div className="text-center p-6 text-gray-400 italic border-b border-gray-200">
                No items added yet.
              </div>
            )}

            {items.map((row) => {
              const isEditing = editRowId === row.id;
              const prod = row.product;
              const unit = prod.unit;
              const unitBuy = Number(prod.buyingRate || 0);

              const rate = isEditing
                ? Number(draft?.rate ?? row.rate)
                : Number(row.rate);
              const qty = isEditing
                ? Number(draft?.qty ?? row.qty)
                : Number(row.qty);

              const totalBuyCost = unitBuy * qty;
              const marginAmount = rate - totalBuyCost;
              const marginPct =
                totalBuyCost > 0 ? (marginAmount / totalBuyCost) * 100 : 0;
              const lineAmount = rate;

              return (
                <React.Fragment key={row.id}>
                  {/* Desktop Row */}
                  <div className="hidden md:grid md:grid-cols-12 md:px-6 md:py-3 border-b border-gray-200 text-sm md:items-center hover:bg-gray-50">
                    {/* Item Code */}
                    <div className="col-span-2 px-2 mb-2 md:mb-0">
                      {isEditing ? (
                        <Select
                          options={codeOptions}
                          value={draft?.codeSel || null}
                          onChange={onEditSelectCode}
                          isClearable
                          components={{
                            Option: OptionWithImage,
                            SingleValue: SingleValueWithImage,
                          }}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <img
                            src={prod.image}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                          <input
                            className={inputClass}
                            value={prod.code}
                            disabled
                          />
                        </div>
                      )}
                    </div>

                    {/* Item Name */}
                    <div className="col-span-2 px-2 mb-2 md:mb-0">
                      {isEditing ? (
                        <Select
                          options={nameOptions}
                          value={draft?.nameSel || null}
                          onChange={onEditSelectName}
                          isClearable
                          components={{
                            Option: OptionWithImage,
                            SingleValue: SingleValueWithImage,
                          }}
                        />
                      ) : (
                        <input
                          className={inputClass}
                          value={prod.name}
                          disabled
                        />
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 px-2 mb-2 md:mb-0">
                      {isEditing ? (
                        <input
                          type="number"
                          min={1}
                          className={`${inputClass} text-right`}
                          value={draft?.qty}
                          onChange={(e) =>
                            setDraft((d) => {
                              const newQty = Math.max(
                                1,
                                Number(e.target.value || 1)
                              );
                              const newRate = d.auto
                                ? Number(d.codeSel?.rate || prod.rate || 0) *
                                  newQty
                                : Number(d.rate || 0);
                              return { ...d, qty: newQty, rate: newRate };
                            })
                          }
                        />
                      ) : (
                        <input
                          className={`${inputClass} text-right`}
                          value={qty}
                          disabled
                        />
                      )}
                    </div>

                    {/* Weight Per Unit */}
                    <div className="col-span-1 px-2 mb-2 md:mb-0">
                      <input className={inputClass} value={unit} disabled />
                    </div>

                    {/* Rate (line total) */}
                    <div className="col-span-1 px-2 mb-2 md:mb-0">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          className={`${inputClass} text-right`}
                          value={draft?.rate}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              rate: Number(e.target.value || 0),
                              auto: false,
                            }))
                          }
                        />
                      ) : (
                        <input
                          className={`${inputClass} text-right`}
                          value={nf2(rate)}
                          disabled
                        />
                      )}
                    </div>

                    {/* Buying Rate */}
                    <div className="col-span-1 px-2 mb-2 md:mb-0">
                      <input
                        className={`${inputClass} text-right`}
                        value={nf2(unitBuy)}
                        disabled
                      />
                    </div>

                    {/* Margin Amount */}
                    <div className="col-span-1 px-2 mb-2 md:mb-0">
                      <input
                        className={`${inputClass} text-right`}
                        value={nf2(marginAmount)}
                        disabled
                      />
                    </div>

                    {/* Margin % */}
                    <div className="col-span-1 px-2 mb-2 md:mb-0">
                      <input
                        className={`${inputClass} text-right`}
                        value={nf2(marginPct)}
                        disabled
                      />
                    </div>

                    {/* Amount */}
                    <div className="col-span-1 px-2 mb-2 md:mb-0">
                      <input
                        className={`${inputClass} text-right`}
                        value={nf2(lineAmount)}
                        disabled
                      />
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 px-2 flex gap-2 justify-center">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                            title="Save"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => beginEdit(row)}
                            className="hover:text-blue-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => removeItem(row.id)}
                            className="hover:text-red-600"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mobile Card */}
                  <div className="md:hidden mx-3 my-2 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">
                          {prod.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          Code: {prod.code}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {qty} × {unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          € {nf2(lineAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Margin: € {nf2(marginAmount)}
                        </div>
                      </div>
                    </div>

                    <details className="mt-3">
                      <summary className="text-xs text-gray-500 cursor-pointer">
                        Details
                      </summary>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        {/* Code */}
                        <div className="col-span-2">
                          <div className="text-gray-500 mb-1">Item Code</div>
                          {isEditing ? (
                            <Select
                              options={codeOptions}
                              value={draft?.codeSel || null}
                              onChange={onEditSelectCode}
                              isClearable
                              components={{
                                Option: OptionWithImage,
                                SingleValue: SingleValueWithImage,
                              }}
                            />
                          ) : (
                            <input
                              className={inputClass}
                              value={prod.code}
                              disabled
                            />
                          )}
                        </div>

                        {/* Name */}
                        <div className="col-span-2">
                          <div className="text-gray-500 mb-1">Item Name</div>
                          {isEditing ? (
                            <Select
                              options={nameOptions}
                              value={draft?.nameSel || null}
                              onChange={onEditSelectName}
                              isClearable
                              components={{
                                Option: OptionWithImage,
                                SingleValue: SingleValueWithImage,
                              }}
                            />
                          ) : (
                            <input
                              className={inputClass}
                              value={prod.name}
                              disabled
                            />
                          )}
                        </div>

                        {/* Qty */}
                        <div>
                          <div className="text-gray-500 mb-1">Quantity</div>
                          {isEditing ? (
                            <input
                              type="number"
                              min={1}
                              className={inputClass}
                              value={draft?.qty}
                              onChange={(e) =>
                                setDraft((d) => {
                                  const newQty = Math.max(
                                    1,
                                    Number(e.target.value || 1)
                                  );
                                  const newRate = d.auto
                                    ? Number(
                                        d.codeSel?.rate || prod.rate || 0
                                      ) * newQty
                                    : Number(d.rate || 0);
                                  return {
                                    ...d,
                                    qty: newQty,
                                    rate: newRate,
                                  };
                                })
                              }
                            />
                          ) : (
                            <input
                              className={inputClass}
                              value={qty}
                              disabled
                            />
                          )}
                        </div>

                        {/* UOM */}
                        <div>
                          <div className="text-gray-500 mb-1">
                            Weight Per Unit
                          </div>
                          <input
                            className={inputClass}
                            value={unit}
                            disabled
                          />
                        </div>

                        {/* Rate */}
                        <div>
                          <div className="text-gray-500 mb-1">
                            Line Total (EUR)
                          </div>
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              className={inputClass}
                              value={draft?.rate}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  rate: Number(e.target.value || 0),
                                  auto: false,
                                }))
                              }
                            />
                          ) : (
                            <input
                              className={inputClass}
                              value={nf2(rate)}
                              disabled
                            />
                          )}
                        </div>

                        {/* Buying */}
                        <div>
                          <div className="text-gray-500 mb-1">
                            Unit Buy (EUR)
                          </div>
                          <input
                            className={inputClass}
                            value={nf2(unitBuy)}
                            disabled
                          />
                        </div>

                        {/* Margin Amount */}
                        <div>
                          <div className="text-gray-500 mb-1">
                            Margin Amount
                          </div>
                          <input
                            className={inputClass}
                            value={nf2(marginAmount)}
                            disabled
                          />
                        </div>

                        {/* Margin % */}
                        <div>
                          <div className="text-gray-500 mb-1">Margin %</div>
                          <input
                            className={inputClass}
                            value={nf2(marginPct)}
                            disabled
                          />
                        </div>
                      </div>
                    </details>

                    <div className="mt-3 flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="px-3 py-2 rounded-md bg-green-600 text-white text-xs flex items-center gap-1"
                          >
                            <FaCheck /> Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 text-xs flex items-center gap-1"
                          >
                            <FaTimes /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => beginEdit(row)}
                            className="px-3 py-2 rounded-md bg-gray-100 text-xs flex items-center gap-1"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => removeItem(row.id)}
                            className="px-3 py-2 rounded-md bg-red-50 text-red-600 text-xs flex items-center gap-1"
                          >
                            <FaTrash /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* Add Row (Desktop) */}
            <div className="hidden md:grid md:grid-cols-12 md:px-6 md:py-3 border-t border-gray-200 text-sm md:items-center">
              {/* Item Code select */}
              <div className="col-span-2 px-2 mb-2 md:mb-0">
                <Select
                  options={codeOptions}
                  value={addSelCode}
                  onChange={onAddSelectCode}
                  placeholder="Select code"
                  isClearable
                  isDisabled={!form.customer}
                  components={{
                    Option: OptionWithImage,
                    SingleValue: SingleValueWithImage,
                  }}
                />
              </div>

              {/* Item Name select */}
              <div className="col-span-2 px-2 mb-2 md:mb-0">
                <Select
                  options={nameOptions}
                  value={addSelName}
                  onChange={onAddSelectName}
                  placeholder="Select item"
                  isClearable
                  isDisabled={!form.customer}
                  components={{
                    Option: OptionWithImage,
                    SingleValue: SingleValueWithImage,
                  }}
                />
              </div>

              {/* Quantity */}
              <div className="col-span-1 px-2 mb-2 md:mb-0">
                <input
                  type="number"
                  min={1}
                  className={`${inputClass} text-right`}
                  value={addQty}
                  disabled={!form.customer}
                  onChange={(e) => {
                    const newQty = Math.max(1, Number(e.target.value || 1));
                    setAddQty(newQty);
                    if (addRateAuto && addSelCode) {
                      setAddRate(Number(addSelCode.rate || 0) * newQty);
                    }
                  }}
                />
              </div>

              {/* Weight Per Unit */}
              <div className="col-span-1 px-2 mb-2 md:mb-0">
                <input
                  type="text"
                  className={inputClass}
                  value={addSelCode?.unit || ""}
                  disabled
                  placeholder="—"
                />
              </div>

              {/* Rate */}
              <div className="col-span-1 px-2 mb-2 md:mb-0">
                <input
                  type="number"
                  step="0.01"
                  className={`${inputClass} text-right`}
                  value={addRate}
                  disabled={!form.customer}
                  onChange={(e) => {
                    setAddRate(Number(e.target.value || 0));
                    setAddRateAuto(false);
                  }}
                  placeholder="0.00"
                />
              </div>

              {/* Buying Rate */}
              <div className="col-span-1 px-2 mb-2 md:mb-0">
                <input
                  type="number"
                  step="0.01"
                  className={`${inputClass} text-right`}
                  value={addSelCode?.buyingRate ?? ""}
                  disabled
                  placeholder="0.00"
                />
              </div>

              {/* Margin Amount */}
              <div className="col-span-1 px-2 mb-2 md:mb-0">
                <input
                  type="text"
                  className={`${inputClass} text-right`}
                  value={
                    addSelCode
                      ? nf2(
                          Number(
                            addRate || (addSelCode?.rate || 0) * addQty
                          ) -
                            Number(addSelCode?.buyingRate || 0) * addQty
                        )
                      : ""
                  }
                  disabled
                  placeholder="0.00"
                />
              </div>

              {/* Margin % */}
              <div className="col-span-1 px-2 mb-2 md:mb-0">
                <input
                  type="text"
                  className={`${inputClass} text-right`}
                  value={
                    addSelCode
                      ? (() => {
                          const totalBuy =
                            Number(addSelCode?.buyingRate || 0) *
                            Number(addQty || 0);
                          const margin =
                            Number(
                              addRate || (addSelCode?.rate || 0) * addQty
                            ) - totalBuy;
                          const pct =
                            totalBuy > 0 ? (margin / totalBuy) * 100 : 0;
                          return nf2(pct);
                        })()
                      : ""
                  }
                  disabled
                  placeholder="0.00"
                />
              </div>

              {/* Amount */}
              <div className="col-span-1 px-2 mb-2 md:mb-0">
                <input
                  type="text"
                  className={`${inputClass} text-right`}
                  value={
                    addSelCode
                      ? nf2(
                          Number(
                            addRate || (addSelCode?.rate || 0) * addQty
                          )
                        )
                      : ""
                  }
                  disabled
                  placeholder="0.00"
                />
              </div>

              {/* Add button */}
              <div className="col-span-1 px-2">
                <button
                  onClick={addItem}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm rounded-md disabled:opacity-50"
                  disabled={!form.customer}
                  title={
                    !form.customer
                      ? "Select a customer to add items"
                      : "Add"
                  }
                >
                  Add
                </button>
              </div>
            </div>

            {/* Add Row (Mobile) */}
            <div className="md:hidden border-t border-gray-200 px-3 py-4 bg-gray-50">
              <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Item Code
                  </label>
                  <Select
                    options={codeOptions}
                    value={addSelCode}
                    onChange={onAddSelectCode}
                    placeholder="Select code"
                    isClearable
                    isDisabled={!form.customer}
                    components={{
                      Option: OptionWithImage,
                      SingleValue: SingleValueWithImage,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Item Name
                  </label>
                  <Select
                    options={nameOptions}
                    value={addSelName}
                    onChange={onAddSelectName}
                    placeholder="Select item"
                    isClearable
                    isDisabled={!form.customer}
                    components={{
                      Option: OptionWithImage,
                      SingleValue: SingleValueWithImage,
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min={1}
                      className={inputClass}
                      value={addQty}
                      disabled={!form.customer}
                      onChange={(e) => {
                        const newQty = Math.max(
                          1,
                          Number(e.target.value || 1)
                        );
                        setAddQty(newQty);
                        if (addRateAuto && addSelCode) {
                          setAddRate(
                            Number(addSelCode.rate || 0) * newQty
                          );
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Weight Per Unit
                    </label>
                    <input
                      className={inputClass}
                      value={addSelCode?.unit || ""}
                      disabled
                      placeholder="—"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Line Total (EUR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={inputClass}
                      value={addRate}
                      disabled={!form.customer}
                      onChange={(e) => {
                        setAddRate(Number(e.target.value || 0));
                        setAddRateAuto(false);
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Buying Rate (EUR)
                    </label>
                    <input
                      className={inputClass}
                      value={
                        addSelCode?.buyingRate !== undefined
                          ? nf2(addSelCode.buyingRate)
                          : ""
                      }
                      disabled
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Margin Amount
                    </label>
                    <input
                      className={inputClass}
                      value={
                        addSelCode
                          ? nf2(
                              Number(
                                addRate ||
                                  (addSelCode?.rate || 0) * addQty
                              ) -
                                Number(
                                  addSelCode?.buyingRate || 0
                                ) *
                                  addQty
                            )
                          : ""
                      }
                      disabled
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Margin %
                    </label>
                    <input
                      className={inputClass}
                      value={
                        addSelCode
                          ? (() => {
                              const totalBuy =
                                Number(
                                  addSelCode?.buyingRate || 0
                                ) * Number(addQty || 0);
                              const margin =
                                Number(
                                  addRate ||
                                    (addSelCode?.rate || 0) *
                                      addQty
                                ) - totalBuy;
                              const pct =
                                totalBuy > 0
                                  ? (margin / totalBuy) * 100
                                  : 0;
                              return nf2(pct);
                            })()
                          : ""
                      }
                      disabled
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <button
                  onClick={addItem}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm rounded-md disabled:opacity-50 mt-1"
                  disabled={!form.customer}
                  title={
                    !form.customer
                      ? "Select a customer to add items"
                      : "Add"
                  }
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- TAXES & CHARGES ---------------- */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              Taxes And Charges
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 text-sm">
              {/* Tax Category */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-700">Tax Category</label>
                  <button
                    type="button"
                    onClick={() => toast.info("Add Tax Category (dummy).")}
                    className="h-7 w-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-xs"
                    title="Add Tax Category"
                  >
                    <FaPlus />
                  </button>
                </div>
                <Select
                  options={makeOptions(taxCategoryDummy)}
                  value={
                    taxCategory
                      ? { value: taxCategory, label: taxCategory }
                      : null
                  }
                  onChange={(opt) => setTaxCategory(opt?.value || "")}
                  placeholder="e.g. Netherlands 9%"
                  isClearable
                />
              </div>

              {/* Shipping Rule */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-700">Shipping Rule</label>
                  <button
                    type="button"
                    onClick={() => toast.info("Add Shipping Rule (dummy).")}
                    className="h-7 w-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-xs"
                    title="Add Shipping Rule"
                  >
                    <FaPlus />
                  </button>
                </div>
                <Select
                  options={makeOptions(shippingRuleDummy)}
                  value={
                    shippingRule
                      ? { value: shippingRule, label: shippingRule }
                      : null
                  }
                  onChange={(opt) => setShippingRule(opt?.value || "")}
                  placeholder="Optional"
                  isClearable
                />
              </div>

              {/* Incoterm */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-700">Incoterm</label>
                  <button
                    type="button"
                    onClick={() => toast.info("Add Incoterm (dummy).")}
                    className="h-7 w-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-xs"
                    title="Add Incoterm"
                  >
                    <FaPlus />
                  </button>
                </div>
                <Select
                  options={makeOptions(incotermDummy)}
                  value={incoterm ? { value: incoterm, label: incoterm } : null}
                  onChange={(opt) => setIncoterm(opt?.value || "")}
                  placeholder="Optional"
                  isClearable
                />
              </div>

              {/* Tax Template */}
              <div className="md:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-700">
                    Sales Taxes & Charges Template
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info("Add Tax Template (dummy).")}
                    className="h-7 w-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-xs"
                    title="Add Template"
                  >
                    <FaPlus />
                  </button>
                </div>
                <Select
                  options={makeOptions(taxTemplateDummy)}
                  value={
                    taxTemplate
                      ? { value: taxTemplate, label: taxTemplate }
                      : null
                  }
                  onChange={(opt) => {
                    setTaxTemplate(opt?.value || "");
                    if (opt?.value === "Default EU VAT" && items.length) {
                      setTaxRows([
                        {
                          id: Date.now(),
                          type: "On Net Total",
                          accountHead: "VAT Payable",
                          rate: 21,
                          amount: (totalAmount * 21) / 100,
                        },
                      ]);
                      toast.success("Loaded dummy EU VAT rows.");
                    }
                  }}
                  placeholder="Select template"
                  isClearable
                />
              </div>
            </div>

            {/* Desktop tax table */}
            <div className="mt-6 overflow-auto rounded-lg border border-gray-200 hidden md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600">
                  <tr>
                    <th className="px-3 py-2">No.</th>
                    <th className="px-3 py-2">
                      Type <span className="text-red-600">*</span>
                    </th>
                    <th className="px-3 py-2">
                      Account Head <span className="text-red-600">*</span>
                    </th>
                    <th className="px-3 py-2">Tax Rate %</th>
                    <th className="px-3 py-2">Amount (EUR)</th>
                    <th className="px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {taxRows.length === 0 && (
                    <tr>
                      <td
                        className="px-3 py-3 text-center text-gray-400 italic"
                        colSpan={6}
                      >
                        No tax rows added.
                      </td>
                    </tr>
                  )}
                  {taxRows.map((row, index) => (
                    <tr key={row.id}>
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2">
                        <select
                          className={inputClass}
                          value={row.type}
                          onChange={(e) =>
                            updateTaxRow(
                              row.id,
                              { type: e.target.value },
                              true
                            )
                          }
                        >
                          <option value="On Net Total">On Net Total</option>
                          <option value="Actual">Actual</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className={inputClass}
                          placeholder="e.g. VAT Payable"
                          value={row.accountHead}
                          onChange={(e) =>
                            updateTaxRow(row.id, {
                              accountHead: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          className={`${inputClass} text-right`}
                          value={row.rate}
                          onChange={(e) =>
                            updateTaxRow(
                              row.id,
                              { rate: e.target.value },
                              true
                            )
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          className={`${inputClass} text-right`}
                          value={nf2(row.amount)}
                          onChange={(e) =>
                            updateTaxRow(
                              row.id,
                              { amount: Number(e.target.value || 0) },
                              false
                            )
                          }
                          disabled={row.type === "On Net Total"}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => deleteTaxRow(row.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile tax cards */}
            <div className="md:hidden mt-4 space-y-2">
              {taxRows.length === 0 && (
                <div className="text-center text-xs text-gray-400 italic">
                  No tax rows added.
                </div>
              )}
              {taxRows.map((row, index) => (
                <div
                  key={row.id}
                  className="border border-gray-200 rounded-xl bg-white shadow-sm"
                >
                  <div className="flex items-center px-3 py-2 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500">
                        #{index + 1}
                      </div>
                      <div className="font-semibold text-gray-800 truncate">
                        {row.accountHead || "Tax"}
                      </div>
                    </div>
                    <div className="text-right mr-2">
                      <div className="text-xs text-gray-500">Amount</div>
                      <div className="font-semibold text-gray-900">
                        € {nf2(row.amount)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteTaxRow(row.id)}
                      className="h-8 w-8 rounded-md bg-red-50 text-red-600 flex items-center justify-center mr-1"
                      title="Delete"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                  <div className="px-3 py-3 grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <div className="text-gray-500 mb-1">Type</div>
                      <select
                        className={inputClass}
                        value={row.type}
                        onChange={(e) =>
                          updateTaxRow(
                            row.id,
                            { type: e.target.value },
                            true
                          )
                        }
                      >
                        <option value="On Net Total">On Net Total</option>
                        <option value="Actual">Actual</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-500 mb-1">Account Head</div>
                      <input
                        className={inputClass}
                        placeholder="e.g. VAT Payable"
                        value={row.accountHead}
                        onChange={(e) =>
                          updateTaxRow(row.id, {
                            accountHead: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Tax Rate %</div>
                      <input
                        type="number"
                        step="0.01"
                        className={inputClass}
                        value={row.rate}
                        onChange={(e) =>
                          updateTaxRow(
                            row.id,
                            { rate: e.target.value },
                            true
                          )
                        }
                      />
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">
                        Amount (EUR)
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        className={inputClass}
                        value={nf2(row.amount)}
                        onChange={(e) =>
                          updateTaxRow(
                            row.id,
                            {
                              amount: Number(e.target.value || 0),
                            },
                            false
                          )
                        }
                        disabled={row.type === "On Net Total"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={addTaxRow}
                className="px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-sm flex items-center gap-1 w-full sm:w-auto justify-center"
              >
                <FaPlus /> Add Row
              </button>
              <div className="sm:ml-auto w-full sm:w-auto">
                <div className="rounded-lg bg-gray-50 px-4 py-3 text-right">
                  <div className="text-xs sm:text-sm text-gray-500">
                    Total Taxes and Charges (EUR)
                  </div>
                  <div className="text-lg sm:text-xl font-semibold text-gray-800">
                    € {nf2(taxTotal)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Totals */}
          <div className="mt-6 mb-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-500">
                    Total Margin (EUR)
                  </div>
                  <div className="text-2xl font-semibold text-red-600">
                    EUR {nf2(totalMargin)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Total (EUR)
                  </div>
                  <div className="text-2xl font-semibold text-gray-800">
                    EUR {nf2(grandTotal)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    incl. taxes &amp; charges: € {nf2(taxTotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="mb-10">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Upload / Download / Print */}
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  id="upload-sales-order-items"
                  type="file"
                  className="hidden"
                  onChange={handleUploadFile}
                />
                <label
                  htmlFor="upload-sales-order-items"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
                >
                  <FaUpload className="text-xs" />
                  Upload
                </label>

                <button
                  type="button"
                  onClick={handleDownloadSalesOrder}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
                >
                  <FaDownload className="text-xs" />
                  Download
                </button>

                <button
                  type="button"
                  onClick={handlePrintSalesOrder}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
                >
                  <FaPrint className="text-xs" />
                  Print
                </button>
              </div>

              {/* Preview + Status flow */}
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => toast.info("Preview coming soon")}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm w-full sm:w-auto"
                >
                  Preview Sales Order
                </button>

                {!isSaved && (
                  <button
                    onClick={handleSaveSalesOrder}
                    className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition text-sm w-full sm:w-auto"
                    disabled={!form.customer || !items.length}
                  >
                    Save Sales Order
                  </button>
                )}

                {isSaved && !isSubmitted && !isCancelled && (
                  <button
                    onClick={handleSubmitSalesOrder}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition text-sm w-full sm:w-auto"
                  >
                    Submit
                  </button>
                )}

                {isSaved && !isCancelled && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-6 py-2.5 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition text-sm w-full sm:w-auto"
                  >
                    Cancel Order
                  </button>
                )}

                {isSubmitted && !isCancelled && !isPicked && (
                  <button
                    onClick={handleOrderPick}
                    className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition text-sm w-full sm:w-auto"
                    title="Proceed to Order Pick"
                  >
                    + Order Pick
                  </button>
                )}

                {isCancelled && (
                  <button
                    onClick={handleAmendOrder}
                    className="px-6 py-2.5 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition text-sm w-full sm:w-auto"
                    title="Amend cancelled order"
                  >
                    Amend
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        onConfirm={() => {
          if (confirmState.onConfirm) {
            confirmState.onConfirm();
          }
          closeConfirm();
        }}
        onCancel={closeConfirm}
      />
    </DashboardLayout>
  );
};

export default AddSalesOrder;
