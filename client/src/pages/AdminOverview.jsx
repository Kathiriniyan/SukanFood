// src/pages/AdminOverview.jsx
import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { FaArrowUp, FaArrowDown, FaSeedling, FaUsers, FaBoxes, FaTruck } from "react-icons/fa";
import gsap from "gsap";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({ title, value, change, up, icon }) => (
  <div className="group relative bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
    <div className="absolute -top-10 -right-10 h-24 w-24 bg-[#f4ac1b33] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-xl text-[#e92a29]">{icon}</div>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-green-600" : "text-red-600"}`}>
        {up ? <FaArrowUp /> : <FaArrowDown />}
        {change}
      </div>
    </div>
    <p className="mt-2 text-2xl font-extrabold text-gray-900">{value}</p>
  </div>
);

const AdminOverview = () => {
  const cardsRef = useRef([]);
  const chartsRef = useRef([]);
  const tableRef = useRef(null);
  const calendarRef = useRef(null);
  const tasksRef = useRef(null);
  cardsRef.current = [];
  chartsRef.current = [];

  const [tasks, setTasks] = useState([
    { id: 1, title: "Check inventory", done: false },
    { id: 2, title: "Call suppliers", done: true },
    { id: 3, title: "Update stock", done: false },
  ]);

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  const addChartRef = (el) => {
    if (el && !chartsRef.current.includes(el)) chartsRef.current.push(el);
  };

  useEffect(() => {
    gsap.from(cardsRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
    });
    gsap.from(chartsRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2,
    });
    gsap.from([calendarRef.current, tasksRef.current, tableRef.current], {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.4,
      stagger: 0.1,
    });
  }, []);

  // Data for Recharts (combined)
  const revenueData = [
    { month: "Jan", Revenue: 12000, Cost: 8000 },
    { month: "Feb", Revenue: 15000, Cost: 9000 },
    { month: "Mar", Revenue: 13000, Cost: 9500 },
    { month: "Apr", Revenue: 18000, Cost: 11000 },
    { month: "May", Revenue: 21000, Cost: 12000 },
    { month: "Jun", Revenue: 23500, Cost: 13000 },
    { month: "Jul", Revenue: 22000, Cost: 13500 },
    { month: "Aug", Revenue: 24500, Cost: 14000 },
  ];

  const stockData = [
    { item: "Tomatoes", Stock: 400 },
    { item: "Carrots", Stock: 520 },
    { item: "Onions", Stock: 310 },
    { item: "Beans", Stock: 250 },
    { item: "Cabbage", Stock: 180 },
    { item: "Potatoes", Stock: 430 },
  ];

  // Custom Tooltip for line chart
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow-lg border border-gray-200 text-sm">
          <p className="font-semibold">{label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-gray-700" style={{ color: entry.color }}>
              {entry.dataKey}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow-lg border border-gray-200 text-sm">
          <p className="font-semibold">{label}</p>
          <p className="text-gray-700">Stock: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div ref={addCardRef}><StatCard title="Vendors" value="150" change="+4.2%" up icon={<FaSeedling />} /></div>
          <div ref={addCardRef}><StatCard title="Customers" value="1,200" change="+2.1%" up icon={<FaUsers />} /></div>
          <div ref={addCardRef}><StatCard title="Products" value="450" change="+1.3%" up icon={<FaBoxes />} /></div>
          <div ref={addCardRef}><StatCard title="Deliveries" value="75" change="-3.1%" up={false} icon={<FaTruck />} /></div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Line Chart */}
          <div ref={addChartRef} className="xl:col-span-2 bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Revenue vs Cost</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-white/60 border border-white/50">Last 8 months</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5F6D" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FF5F6D" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFC371" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FFC371" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" tick={{ fill: "#444", fontWeight: "600" }} />
                <YAxis tick={{ fill: "#444" }} />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#FF5F6D"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 7 }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="Cost"
                  stroke="#FFC371"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCost)"
                  activeDot={{ r: 7 }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div ref={addChartRef} className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Stock Levels</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-white/60 border border-white/50">Current</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6F91" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF6F91" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="item" tick={{ fill: "#444", fontWeight: "600" }} />
                <YAxis tick={{ fill: "#444" }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="Stock"
                  fill="url(#colorStock)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar + Tasks + Orders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div ref={calendarRef} className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Calendar</h3>
            <div className="text-sm text-gray-600">📅 Upcoming Events:</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li>🔔 Stock Check – Aug 16</li>
              <li>📦 Delivery Schedule – Aug 17</li>
              <li>📝 Vendor Meeting – Aug 18</li>
            </ul>
          </div>

          <div ref={tasksRef} className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Tasks</h3>
            <ul className="space-y-2 text-sm">
              {tasks.map((task) => (
                <li key={task.id}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      className="accent-[#e92a29]"
                    />
                    <span className={task.done ? "line-through text-gray-500" : ""}>{task.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={tableRef}
            className="bg-white/25 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg overflow-x-auto"
          >
            <h3 className="font-semibold text-gray-800 mb-3">Recent Orders</h3>
            <table className="w-full text-sm min-w-[320px]">
              <thead>
                <tr className="text-left text-gray-600">
                  <th>Order</th>
                  <th>Item</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {[
                  { id: "#A001", item: "Tomatoes", status: "Delivered", color: "green" },
                  { id: "#A002", item: "Potatoes", status: "Pending", color: "yellow" },
                  { id: "#A003", item: "Onions", status: "Delayed", color: "red" },
                ].map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 font-medium">{r.id}</td>
                    <td className="py-2">{r.item}</td>
                    <td className={`py-2 font-semibold text-${r.color}-600`}>
                      {r.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminOverview;
