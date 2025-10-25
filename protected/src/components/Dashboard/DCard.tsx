import React from "react";

interface DCardProps {
  title: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function DCard({ title, value, color, icon, className }: DCardProps) {
  return (
    <div
      className={`
        p-5 rounded-xl shadow-md flex items-center gap-4 transition-transform duration-300 ease-in-out transform
        hover:scale-105 hover:shadow-xl ${color} ${className ?? ""}
      `}
    >
      {icon && <div className="w-10 h-10">{icon}</div>}
      <div>
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
