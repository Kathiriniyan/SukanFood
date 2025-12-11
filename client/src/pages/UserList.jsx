import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { users } from "../assets/assets"; // 100 dummy users
import { FaEdit, FaTrash } from "react-icons/fa";

const UserList = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages.map((num, i) =>
      num === "..." ? (
        <span key={i} className="px-2 py-1 text-gray-500">...</span>
      ) : (
        <button
          key={i}
          onClick={() => setCurrentPage(num)}
          className={`px-3 py-1.5 rounded-lg ${
            currentPage === num
              ? "bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          {num}
        </button>
      )
    );
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: rowsPerPage }).map((_, i) => (
      <tr key={i} className="border-b border-white/30 animate-pulse">
        {Array.from({ length: 6 }).map((_, j) => (
          <td key={j} className="p-3">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb and Add Button */}
      <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
        <div>
          <span
            className="hover:text-red-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Dashboard
          </span>{" "}
          / <span className="font-semibold text-red-500">User List</span>
        </div>
        <button
          onClick={() => navigate("/create-user")}
          className="bg-[#e92a29] text-white px-4 py-2 rounded-md hover:bg-[#c42020] transition text-sm"
        >
          + Add User
        </button>
      </div>

      {/* Search Input */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by email or role..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-200"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto backdrop-blur-lg bg-white/60 rounded-2xl shadow-lg border border-white/20">
        <table className="min-w-full text-sm transition-opacity duration-300 ease-in-out">
          <thead className="bg-indigo-100/70 text-gray-700">
            <tr>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Role</th>
              <th className="p-3 text-left font-semibold">Login Count</th>
              <th className="p-3 text-left font-semibold">Last Login Time</th>
              <th className="p-3 text-left font-semibold">Last Login IP</th>
              <th className="p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeletonRows()
            ) : currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/30 hover:bg-indigo-50/60 transition duration-200"
                >
                  <td className="p-3 text-gray-700">{user.email}</td>
                  <td className="p-3 text-gray-700 capitalize">{user.role}</td>
                  <td className="p-3 text-gray-700">
                    {user.loginCount ?? "N/A"}
                  </td>
                  <td className="p-3 text-gray-700">
                    {user.lastLoginTime?.split("T")[0] || "Never"}
                  </td>
                  <td className="p-3 text-gray-700">{user.lastLoginIP}</td>
                  <td className="p-3 text-center text-gray-700 flex justify-center gap-4">
                    <button
                      onClick={() => navigate(`/user/edit-user/${user.id}`)}
                      className="text-[#e92a29] hover:scale-110 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => alert("Delete not implemented")}
                      className="text-gray-500 hover:text-black hover:scale-110 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-5 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-between items-center mt-6 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
          >
            Prev
          </button>
          <div className="flex flex-wrap justify-center gap-1">
            {renderPageNumbers()}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white disabled:opacity-40 hover:bg-red-600 transition"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserList;
