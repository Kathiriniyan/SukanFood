import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { FaTrash, FaEdit, FaHome, FaChevronRight } from "react-icons/fa";
import Select from "react-select";

const dummy = {
  suppliers: ["Supplier A", "Supplier B"],
  companies: ["Company X", "Company Y"],
  categories: ["Vegetables", "Fruits"],
  products: {
    Vegetables: ["Onion", "Beetroot"],
    Fruits: ["Mango", "Banana"],
  },
  packaging: ["Box", "Pallet"],
};

const CreateSupplierQuotation = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    series: "PUR-SQTN-YYYY",
    date: new Date().toISOString().split("T")[0],
    orderType: "Purchase",
    validTill: "",
    supplier: null,
    company: null,
  });

  const [currentItem, setCurrentItem] = useState({
    category: null,
    product: null,
    quantity: "",
    packaging: null,
    gross: "",
    discount: "",
  });

  const [items, setItems] = useState([]);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleItemChange = (field, value) =>
    setCurrentItem((prev) => ({ ...prev, [field]: value }));

  const calcNet = (item) => {
    const gross = parseFloat(item.gross) || 0;
    const discount = parseFloat(item.discount) || 0;
    return gross - (gross * discount) / 100;
  };

  const addItem = () => {
    if (!currentItem.category || !currentItem.product) {
      alert("Please select category and product");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...currentItem,
        quantity: parseFloat(currentItem.quantity) || 0,
        gross: parseFloat(currentItem.gross) || 0,
        discount: parseFloat(currentItem.discount) || 0,
      },
    ]);

    setCurrentItem({
      category: null,
      product: null,
      quantity: "",
      packaging: null,
      gross: "",
      discount: "",
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalGross = items.reduce((sum, i) => sum + i.gross, 0);
  const totalNet = items.reduce((sum, i) => sum + calcNet(i), 0);

  const inputClass =
    "border border-gray-200 rounded-md px-2.5 py-1.5 w-full text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500";

  const handlePreview = () => {
    if (!form.validTill || !form.supplier || !form.company) {
      alert("Please fill all required fields in the quotation info.");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    navigate("/purchase/preview-supplier-quotation", {
      state: {
        form,
        items,
        totalGross,
        totalNet,
      },
    });
  };

  // Convert dummy arrays to react-select options
  const toOptions = (arr) => arr.map((v) => ({ value: v, label: v }));

  return (
    <DashboardLayout>
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6 gap-2">
        <span className="hover:text-red-400 cursor-pointer">Purchase</span>
        <FaChevronRight />
        <span className="text-gray-700 font-medium">Create Supplier Quotation</span>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Supplier Quotation
      </h2>

      {/* Quotation Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-5">
          Quotation Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Series<span className="text-red-500">*</span>
            </label>
            <select
              className={inputClass}
              value={form.series}
              onChange={(e) => handleChange("series", e.target.value)}
            >
              <option value="PUR-SQTN-YYYY">PUR-SQTN-YYYY</option>
              <option value="PUR-SQTN-0001">PUR-SQTN-0001</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Order Type<span className="text-red-500">*</span>
            </label>
            <select
              className={inputClass}
              value={form.orderType}
              onChange={(e) => handleChange("orderType", e.target.value)}
            >
              <option value="Purchase">Purchase</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Shopping Cart">Shopping Cart</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Valid Till<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={inputClass}
              value={form.validTill}
              onChange={(e) => handleChange("validTill", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Supplier<span className="text-red-500">*</span>
            </label>
            <Select
              options={toOptions(dummy.suppliers)}
              value={form.supplier}
              onChange={(val) => handleChange("supplier", val)}
              placeholder="Select Supplier"
              isSearchable
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Company<span className="text-red-500">*</span>
            </label>
            <Select
              options={toOptions(dummy.companies)}
              value={form.company}
              onChange={(val) => handleChange("company", val)}
              placeholder="Select Company"
              isSearchable
            />
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Quotation Items</h3>
          <button
            onClick={addItem}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            + Add Item
          </button>
        </div>

        {/* Header */}
        <div className="grid grid-cols-12 bg-gray-50 text-gray-600 text-xs font-semibold uppercase px-6 py-3 border-b border-gray-200">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-2 px-2">Category</div>
          <div className="col-span-2 px-2">Product</div>
          <div className="col-span-1 pl-2 pr-6 text-right">Qty</div>
          <div className="col-span-2 pr-2 pl-6">Packaging</div>
          <div className="col-span-1 px-2 text-right">Gross</div>
          <div className="col-span-1 px-2 text-right">Discount</div>
          <div className="col-span-1 px-2 text-right">Net</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {/* Item Rows */}
        {items.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-400">
            No items added yet.
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className="grid grid-cols-12 px-6 py-3 border-b border-gray-200 text-sm hover:bg-gray-50"
            >
              <div className="col-span-1 text-center">{idx + 1}</div>
              <div className="col-span-2 px-2">{item.category.label}</div>
              <div className="col-span-2 px-2">{item.product.label}</div>
              <div className="col-span-1 text-right">{item.quantity}</div>
              <div className="col-span-2 pl-6">{item.packaging?.label}</div>
              <div className="col-span-1 text-right">{item.gross.toFixed(2)}</div>
              <div className="col-span-1 text-right">{item.discount}%</div>
              <div className="col-span-1 text-right font-semibold">
                {calcNet(item).toFixed(2)}
              </div>
              <div className="col-span-1 flex justify-center gap-3 text-gray-500">
                <button className="hover:text-blue-600">
                  <FaEdit />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Add Item Inline */}
        <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 items-center gap-3 border-t border-gray-200">
          <div className="col-span-1 text-center text-gray-400">#</div>
          <div className="col-span-2">
            <Select
              options={toOptions(dummy.categories)}
              value={currentItem.category}
              onChange={(val) => handleItemChange("category", val)}
              placeholder="-- Category --"
              isSearchable
            />
          </div>
          <div className="col-span-2">
            <Select
              options={currentItem.category ? toOptions(dummy.products[currentItem.category.value]) : []}
              value={currentItem.product}
              onChange={(val) => handleItemChange("product", val)}
              placeholder="-- Product --"
              isSearchable
              isDisabled={!currentItem.category}
            />
          </div>
          <div className="col-span-1">
            <input
              type="number"
              className={`${inputClass} text-right`}
              value={currentItem.quantity}
              onChange={(e) => handleItemChange("quantity", e.target.value)}
              placeholder="Qty"
            />
          </div>
          <div className="col-span-2">
            <Select
              options={toOptions(dummy.packaging)}
              value={currentItem.packaging}
              onChange={(val) => handleItemChange("packaging", val)}
              placeholder="-- Packaging --"
              isSearchable
            />
          </div>
          <div className="col-span-1">
            <input
              type="number"
              className={`${inputClass} text-right`}
              value={currentItem.gross}
              onChange={(e) => handleItemChange("gross", e.target.value)}
              placeholder="Gross"
            />
          </div>
          <div className="col-span-1">
            <input
              type="number"
              className={`${inputClass} text-right`}
              value={currentItem.discount}
              onChange={(e) => handleItemChange("discount", e.target.value)}
              placeholder="%"
            />
          </div>
          <div className="col-span-1 text-right font-semibold">
            {calcNet(currentItem).toFixed(2)}
          </div>
          <div className="col-span-1 flex justify-center">
            <button
              onClick={addItem}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end gap-12 mt-6 mb-8 font-semibold text-gray-700 text-right">
        <div>
          <div className="text-sm">Total (Gross)</div>
          <div className="text-xl text-gray-800">EUR {totalGross.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm">Total (Net)</div>
          <div className="text-xl text-red-600">EUR {totalNet.toFixed(2)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-5 mb-10">
        <button
          onClick={handlePreview}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm"
        >
          Preview Invoice
        </button>
        <button className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition text-sm">
          Save Invoice
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CreateSupplierQuotation;
