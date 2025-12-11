import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

const PreviewSupplierQuotation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { form, items, totalGross, totalNet } = location.state || {};

  const calcNet = (item) => {
    const gross = parseFloat(item.gross) || 0;
    const discount = parseFloat(item.discount) || 0;
    return gross - (gross * discount) / 100;
  };

  if (!form || !items) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 mt-20">
          No data to preview. Please go back and fill the quotation form.
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 max-w-6xl mx-auto mt-6">
        {/* Header */}
        <div className="mb-8 border-b pb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Supplier Quotation
            </h2>
            <p className="text-sm text-gray-500">Preview before saving</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Date:</div>
            <div className="font-semibold text-gray-700">{form.date}</div>
          </div>
        </div>

        {/* Quotation Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-sm">
          <div>
            <div className="text-gray-500">Quotation Series</div>
            <div className="font-medium text-gray-800">{form.series}</div>
          </div>
          <div>
            <div className="text-gray-500">Order Type</div>
            <div className="font-medium text-gray-800">{form.orderType}</div>
          </div>
          <div>
            <div className="text-gray-500">Valid Till</div>
            <div className="font-medium text-gray-800">{form.validTill}</div>
          </div>
          <div>
            <div className="text-gray-500">Supplier</div>
            <div className="font-medium text-gray-800">{form.supplier}</div>
          </div>
          <div>
            <div className="text-gray-500">Company</div>
            <div className="font-medium text-gray-800">{form.company}</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8">
          <div className="text-lg font-semibold text-gray-700 mb-4">
            Quotation Items
          </div>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="text-left px-4 py-3 border-b">#</th>
                  <th className="text-left px-4 py-3 border-b">Category</th>
                  <th className="text-left px-4 py-3 border-b">Product</th>
                  <th className="text-right px-4 py-3 border-b">Qty</th>
                  <th className="text-left px-4 py-3 border-b">Packaging</th>
                  <th className="text-right px-4 py-3 border-b">Gross</th>
                  <th className="text-right px-4 py-3 border-b">Discount (%)</th>
                  <th className="text-right px-4 py-3 border-b">Net</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{item.product}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3">{item.packaging}</td>
                    <td className="px-4 py-3 text-right">
                      € {item.gross.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">{item.discount}%</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      € {calcNet(item).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end gap-10 mt-8 text-sm font-medium text-gray-700">
          <div className="text-right">
            <div className="text-gray-500">Total Gross</div>
            <div className="text-lg text-gray-800">
              € {totalGross.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-500">Total Net</div>
            <div className="text-lg text-red-600 font-bold">
              € {totalNet.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end mt-10 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Edit Quotation
          </button>
          <button className="px-6 py-2.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
            Submit Quotation
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PreviewSupplierQuotation;
