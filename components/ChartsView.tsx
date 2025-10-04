"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ChartsView() {
  // 🧠 Example static data — replace this later with your Supabase data
  const data = [
    { topic: "Human Biology", count: 120 },
    { topic: "Plant Growth", count: 95 },
    { topic: "Microgravity", count: 80 },
    { topic: "Radiation Effects", count: 60 },
    { topic: "Cellular Response", count: 45 },
  ];

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="font-semibold mb-4 text-lg text-center">Publication Topics Overview</h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
