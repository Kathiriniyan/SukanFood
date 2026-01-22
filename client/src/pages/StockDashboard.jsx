// src/pages/StockDashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiList,
  FiGrid,
  FiCheck,
  FiX,
  FiMenu,
  FiPlus,
  FiArrowUpRight,
  FiUpload,
  FiDownload,
} from "react-icons/fi";
import { stockItems as seedStockItems } from "../assets/assets";
import * as XLSX from "xlsx";

/* -------------------- HELPERS -------------------- */

const fmtDate = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const statusBadge = (status) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-700";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-700";
    case "Out of Stock":
      return "bg-red-100 text-red-700";
    case "Discontinued":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const shortDesc = (desc = "", max = 34) => {
  const clean = String(desc).replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trimEnd() + "…";
};

const nowISO = () => new Date().toISOString();

/**
 * ✅ FIX for "row jumping":
 * Your UI sorts by updatedAt, so if you modify updatedAt on toggle, item re-sorts.
 * Solution: keep updatedAt only for real edits (edit form), and for toggles use lastActivityAt.
 */
const stableSortKey = (item) => item.updatedAt || item.createdAt || "1970-01-01T00:00:00.000Z";

const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onChange?.();
    }}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
      checked ? "bg-green-500" : "bg-gray-300"
    }`}
    aria-label="toggle"
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

/* -------------------- ACTIVITY / HISTORY -------------------- */

const ensureActivityFields = (item) => {
  const createdAt = item.createdAt || nowISO();
  const updatedAt = item.updatedAt || createdAt;

  const base = {
    ...item,
    createdAt,
    updatedAt,
    updatedBy: item.updatedBy || "Admin",
  };

  if (!base.lastActivity) {
    base.lastActivity = {
      type: "created",
      at: createdAt,
      by: base.updatedBy || "Admin",
      summary: "Created item",
    };
  }

  if (!Array.isArray(base.activityLog)) {
    base.activityLog = [
      {
        type: "created",
        at: createdAt,
        by: base.updatedBy || "Admin",
        summary: "Created item",
      },
    ];
  }

  return base;
};

const pushActivity = (item, entry) => {
  const log = Array.isArray(item.activityLog) ? item.activityLog : [];
  const nextLog = [...log, entry].slice(-25);
  return {
    ...item,
    lastActivity: entry,
    activityLog: nextLog,
    // optional: quick field for UI / future
    lastActivityAt: entry.at,
  };
};

const activityPill = (type) => {
  switch (type) {
    case "created":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "updated":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "visibility":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "active":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

/* -------------------- EXCEL: EXPORT / IMPORT -------------------- */

const toExportRow = (p) => ({
  ID: p.id,
  Name: p.name,
  Origin: p.origin,
  Stock: p.stock,
  Status: p.status,
  "WP Unit (€)": p.wpUnit,
  Description: p.description,
  Active: p.isActive ? "Yes" : "No",
  Visible: p.visibility?.productVisible ? "Yes" : "No",
  "Created At": p.createdAt,
  "Updated At": p.updatedAt,
  "Updated By": p.updatedBy,
  "Last Activity": p.lastActivity?.summary || "",
  "Last Activity At": p.lastActivity?.at || "",
  "Last Activity By": p.lastActivity?.by || "",
});

const normalizeYesNo = (v) => {
  const s = String(v ?? "").trim().toLowerCase();
  return s === "yes" || s === "true" || s === "1";
};

const normalizeNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeString = (v, fallback = "") => {
  const s = String(v ?? "").trim();
  return s || fallback;
};

const mergeImportedRows = (existingItems, importedRows) => {
  // Merge by ID. If ID exists -> update that item (treat as "updated")
  const now = nowISO();
  const by = "Excel Import";

  const map = new Map(existingItems.map((x) => [x.id, x]));

  importedRows.forEach((r, idx) => {
    const id = normalizeString(r.ID || r.Id || r.id, "");
    if (!id) return;

    const prev = map.get(id) || null;

    const nextBase = ensureActivityFields({
      ...(prev || {}),
      id,
      name: normalizeString(r.Name, prev?.name || `Item ${idx + 1}`),
      origin: normalizeString(r.Origin, prev?.origin || ""),
      stock: normalizeNumber(r.Stock, prev?.stock ?? 0),
      status: normalizeString(r.Status, prev?.status || "In Stock"),
      wpUnit: normalizeNumber(r["WP Unit (€)"] ?? r.WPUnit ?? r.wpUnit, prev?.wpUnit ?? 0),
      description: normalizeString(r.Description, prev?.description || ""),
      isActive: normalizeYesNo(r.Active) ?? prev?.isActive ?? true,
      visibility: {
        productVisible:
          normalizeYesNo(r.Visible) ?? prev?.visibility?.productVisible ?? true,
      },
      // If you want: keep createdAt if exists, otherwise now
      createdAt: prev?.createdAt || normalizeString(r["Created At"], now) || now,
      // "updatedAt" is a real update here
      updatedAt: now,
      updatedBy: by,
    });

    const next = pushActivity(nextBase, {
      type: "updated",
      at: now,
      by,
      summary: "Updated from Excel",
    });

    map.set(id, next);
  });

  return Array.from(map.values());
};

/* -------------------- PAGE -------------------- */

const StockDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [items, setItems] = useState(() =>
    (seedStockItems || []).map(ensureActivityFields)
  );

  const [search, setSearch] = useState("");

  // view
  const [viewType, setViewType] = useState("table");
  const [userToggledView, setUserToggledView] = useState(false);

  // selection mode
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // pagination / infinite
  const [paginationEnabled, setPaginationEnabled] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // infinite
  const BATCH_SIZE = 18;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sentinelRef = useRef(null);
  const debounceRef = useRef(null);

  /* ---------- Responsive view: iPad uses cards ---------- */
  useEffect(() => {
    const apply = () => {
      if (userToggledView) return;
      const w = window.innerWidth;
      setViewType(w < 1024 ? "cards" : "table");
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [userToggledView]);

  /* ---------- Data pipeline ---------- */

  const sorted = useMemo(() => {
    // ✅ Stable sorting: keep table position stable when toggles happen
    // We sort by updatedAt ONLY (real edits). Visibility/active changes do NOT change updatedAt.
    return [...items].sort((a, b) => new Date(stableSortKey(b)) - new Date(stableSortKey(a)));
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sorted;

    return sorted.filter((p) => {
      const s = `${p.id} ${p.name} ${p.origin} ${p.description} ${p.status}`.toLowerCase();
      return s.includes(q);
    });
  }, [sorted, search]);

  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(BATCH_SIZE);
  }, [search]);

  useEffect(() => {
    if (paginationEnabled) setCurrentPage(1);
    else setVisibleCount(BATCH_SIZE);
  }, [paginationEnabled]);

  useEffect(() => {
    if (!selectMode) setSelectedIds([]);
  }, [selectMode]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  const infiniteItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const displayItems = paginationEnabled ? pagedItems : infiniteItems;

  /* ---------- Selection helpers ---------- */

  const isSelected = (id) => selectedIds.includes(id);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onRowOrCardClick = (id) => {
    if (!selectMode) return;
    toggleSelect(id);
  };

  const clearSelection = () => setSelectedIds([]);

  const selectAllVisible = () => {
    setSelectedIds((prev) => {
      const set = new Set(prev);
      displayItems.forEach((p) => set.add(p.id));
      return [...set];
    });
  };

  /* ---------- Actions ---------- */

  const toggleVisibility = (id) => {
    const now = nowISO();
    setItems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const nextVisible = !p.visibility?.productVisible;

        // ✅ do NOT change updatedAt (prevents jumping)
        const next = {
          ...p,
          visibility: { productVisible: nextVisible },
        };

        return pushActivity(next, {
          type: "visibility",
          at: now,
          by: "Admin",
          summary: nextVisible ? "Visibility: Visible" : "Visibility: Hidden",
        });
      })
    );
  };

  const toggleActive = (id) => {
    const now = nowISO();
    setItems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const nextActive = !p.isActive;

        // ✅ do NOT change updatedAt (prevents jumping)
        const next = {
          ...p,
          isActive: nextActive,
        };

        return pushActivity(next, {
          type: "active",
          at: now,
          by: "Admin",
          summary: nextActive ? "Activity: Active" : "Activity: Inactive",
        });
      })
    );
  };

  /* ---------- Pagination numbers ---------- */
  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, 4, "...", totalPages);
      else if (currentPage >= totalPages - 2)
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      else pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages.map((num, index) =>
      num === "..." ? (
        <span key={index} className="px-2 py-1 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={index}
          onClick={() => setCurrentPage(num)}
          className={`px-3 py-1.5 rounded-lg ${
            currentPage === num ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {num}
        </button>
      )
    );
  };

  /* ---------- Infinite loading ---------- */
  useEffect(() => {
    if (paginationEnabled) return;
    if (!sentinelRef.current) return;

    const el = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (isLoadingMore) return;
        if (visibleCount >= filtered.length) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((c) => Math.min(c + BATCH_SIZE, filtered.length));
            setIsLoadingMore(false);
          }, 450);
        }, 200);
      },
      { root: null, threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [paginationEnabled, visibleCount, filtered.length, isLoadingMore]);

  const totalLabel = paginationEnabled
    ? filtered.length
    : `${displayItems.length}/${filtered.length}`;

  /* ---------- Navigation ---------- */
  const goAddItem = () => navigate("/stock/create-item");
  const goDetail = (id) => navigate(`/stock/${id}`);

  /* ---------- Export / Import ---------- */

  const onExportExcel = () => {
    const rows = filtered.map(toExportRow);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StockItems");
    XLSX.writeFile(wb, "stock_items.xlsx");
  };

  const onPickImport = () => fileInputRef.current?.click();

  const onImportExcel = async (file) => {
    if (!file) return;

    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheetName = wb.SheetNames?.[0];
    if (!sheetName) return;

    const ws = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws, { defval: "" }); // array of rows

    setItems((prev) => mergeImportedRows(prev, json));
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb row + Add + Export/Import */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="text-sm text-gray-500">
          <span className="hover:text-red-500 cursor-pointer">Inventory</span> /{" "}
          <span className="text-gray-800 font-medium">Stock Dashboard</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Hidden input for import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              onImportExcel(f);
              e.target.value = ""; // allow re-upload same file
            }}
          />

          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50"
            title="Export to Excel"
          >
            <FiDownload className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={onPickImport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm hover:bg-gray-50"
            title="Import from Excel"
          >
            <FiUpload className="w-4 h-4" />
            Import
          </button>

          <button
            onClick={goAddItem}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
          >
            <FiPlus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg p-4 shadow flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Stock Items</h2>
            <p className="text-xs text-gray-500 mt-1">
              Manage stock, status, activity and visibility.
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Hamburger: toggle pagination / infinite */}
            <button
              onClick={() => setPaginationEnabled((p) => !p)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              title={
                paginationEnabled
                  ? "Disable pagination (enable scroll load)"
                  : "Enable pagination"
              }
            >
              <FiMenu className="w-5 h-5" />
            </button>

            {selectMode ? (
              <>
                <button
                  onClick={selectAllVisible}
                  className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
                >
                  Select all {paginationEnabled ? "(page)" : "(loaded)"}
                </button>

                <button
                  onClick={clearSelection}
                  className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
                >
                  Clear
                </button>

                <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                  Selected: <b>{selectedIds.length}</b>
                </span>

                <button
                  onClick={() => alert("Bulk action placeholder")}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Bulk Action
                </button>

                <button
                  onClick={() => setSelectMode(false)}
                  className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50 inline-flex items-center gap-2"
                  title="Exit selection"
                >
                  <FiX /> Exit
                </button>
              </>
            ) : (
              <>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {totalLabel} items
                </span>
                <button
                  onClick={() => setSelectMode(true)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                  title="Enable selection mode"
                >
                  Select
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search + View Toggle */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-xl">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, product name, status, origin, description…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUserToggledView(true);
                setViewType("table");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm ${
                viewType === "table"
                  ? "border-red-600 bg-red-50 text-red-600"
                  : "border-gray-200"
              }`}
              title="Table view"
            >
              <FiList className="w-4 h-4" /> Table
            </button>

            <button
              type="button"
              onClick={() => {
                setUserToggledView(true);
                setViewType("cards");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm ${
                viewType === "cards"
                  ? "border-red-600 bg-red-50 text-red-600"
                  : "border-gray-200"
              }`}
              title="Card view"
            >
              <FiGrid className="w-4 h-4" /> Cards
            </button>
          </div>
        </div>

        {!paginationEnabled && (
          <div className="text-xs text-gray-500">
            Pagination is <b>OFF</b> • Loading with scroll ({displayItems.length} of{" "}
            {filtered.length})
          </div>
        )}
      </div>

      {/* TABLE VIEW */}
      {viewType === "table" ? (
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left sticky top-0 z-10">
                <tr className="text-gray-600">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Origin</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">W.P Unit</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Last Activity</th>
                  <th className="px-4 py-3">Visibility</th>
                </tr>
              </thead>

              <tbody>
                {displayItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                      No items found.
                    </td>
                  </tr>
                ) : (
                  displayItems.map((p) => {
                    const selected = isSelected(p.id);
                    const last = p.lastActivity;

                    return (
                      <tr
                        key={p.id}
                        onClick={() => onRowOrCardClick(p.id)}
                        className={`border-t border-gray-100 hover:bg-gray-50/60 ${
                          selectMode ? "cursor-pointer" : ""
                        } ${selected ? "bg-green-50/40" : ""}`}
                      >
                        {/* Product */}
                        <td className="px-4 py-3 cursor-pointer"
                            onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        goDetail(p.id);
                                    }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-50 shrink-0 ${
                                selected ? "border-green-500 border-2" : "border-gray-200"
                              }`}
                            >
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              {selected && (
                                <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                                  <FiCheck className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 w-full">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="font-medium truncate max-w-[28ch]">{p.name}</div>
                                  <div className="text-[11px] text-gray-500">{p.id}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge(p.status)}`}>
                            {p.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">{p.origin}</td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              p.stock <= 50
                                ? "bg-red-100 text-red-700"
                                : p.stock <= 200
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>

                        <td className="px-4 py-3">€ {Number(p.wpUnit).toFixed(2)}</td>

                        <td className="px-4 py-3">
                          <div className="text-xs text-gray-600 max-w-[34ch] truncate" title={p.description}>
                            {shortDesc(p.description, 34)}
                          </div>
                        </td>

                        {/* Last activity */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`w-fit px-2 py-0.5 rounded-full text-xs border ${activityPill(last?.type)}`}>
                              {last?.summary || "—"}
                            </span>
                            <div className="text-[10px] text-gray-500">
                              {fmtDate(last?.at || p.updatedAt)} • {last?.by || p.updatedBy}
                            </div>
                          </div>
                        </td>

                        {/* Visibility */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Switch checked={!!p.visibility?.productVisible} onChange={() => toggleVisibility(p.id)} />
                            <span className="text-xs text-gray-600">
                              {p.visibility?.productVisible ? "Visible" : "Hidden"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          {paginationEnabled && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-between items-center mt-6 text-sm px-4 pb-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
              >
                Prev
              </button>

              <div className="flex flex-wrap justify-center gap-1">{renderPageNumbers()}</div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
              >
                Next
              </button>
            </div>
          )}

          {!paginationEnabled && (
            <div className="px-4 pb-4">
              <div ref={sentinelRef} className="h-10 flex items-center justify-center">
                {isLoadingMore ? (
                  <span className="text-xs text-gray-500">Loading more…</span>
                ) : visibleCount >= filtered.length ? (
                  <span className="text-xs text-gray-400">All items loaded</span>
                ) : (
                  <span className="text-xs text-gray-400">Scroll to load more</span>
                )}
              </div>
            </div>
          )}
        </section>
      ) : (
        /* CARD VIEW */
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {displayItems.length === 0 ? (
            <div className="col-span-full py-10 text-center text-gray-500 text-sm">
              No items found.
            </div>
          ) : (
            displayItems.map((p) => {
              const selected = isSelected(p.id);
              const last = p.lastActivity;

              return (
                <div
                  key={p.id}
                  onClick={() => onRowOrCardClick(p.id)}
                  className={`border rounded-2xl p-4 bg-white hover:shadow-sm transition-all ${
                    selectMode ? "cursor-pointer" : ""
                  } ${selected ? "border-green-500 border-2" : "border-gray-100"}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border bg-gray-50 shrink-0 ${
                        selected ? "border-green-500 border-2" : "border-gray-200"
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      {selected && (
                        <div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center">
                          <FiCheck className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{p.name}</div>
                          <div className="text-[11px] text-gray-500">{p.id}</div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            goDetail(p.id);
                          }}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                          title="View item"
                        >
                          <FiArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge(p.status)}`}>
                          {p.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                          {p.origin}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Stock</div>
                      <div className="font-medium">{p.stock}</div>
                    </div>

                    <div>
                      <div className="text-gray-500 text-xs">W.P Unit</div>
                      <div className="font-medium">€ {Number(p.wpUnit).toFixed(2)}</div>
                    </div>

                    <div className="col-span-2">
                      <div className="text-gray-500 text-xs">Description</div>
                      <div className="text-xs text-gray-700 mt-1 truncate" title={p.description}>
                        {shortDesc(p.description, 44)}
                      </div>
                    </div>

                    <div className="col-span-2 mt-2 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-xs border ${activityPill(last?.type)}`}>
                          {last?.summary || "—"}
                        </span>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {fmtDate(last?.at || p.updatedAt)} • {last?.by || p.updatedBy}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch checked={!!p.visibility?.productVisible} onChange={() => toggleVisibility(p.id)} />
                        <span className="text-xs text-gray-600">
                          {p.visibility?.productVisible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {paginationEnabled && (
            <div className="col-span-full">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-between items-center mt-2 text-sm">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
                >
                  Prev
                </button>

                <div className="flex flex-wrap justify-center gap-1">{renderPageNumbers()}</div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {!paginationEnabled && (
            <div className="col-span-full">
              <div ref={sentinelRef} className="h-10 flex items-center justify-center">
                {isLoadingMore ? (
                  <span className="text-xs text-gray-500">Loading more…</span>
                ) : visibleCount >= filtered.length ? (
                  <span className="text-xs text-gray-400">All items loaded</span>
                ) : (
                  <span className="text-xs text-gray-400">Scroll to load more</span>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </DashboardLayout>
  );
};

export default StockDashboard;
