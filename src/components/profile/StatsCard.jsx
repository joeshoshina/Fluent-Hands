import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({
  icon: Icon,
  label,
  value,
  color,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-2"
    >
      <div
        className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-2xl font-black text-gray-900">{value}</span>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </span>
    </motion.div>
  );
}
