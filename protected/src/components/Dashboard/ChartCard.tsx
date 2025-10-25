import React from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <div
      className={`
        p-5 rounded-xl shadow-md border transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
        ${className ?? ""}
      `}
    >
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
      <div>{children}</div>
    </div>
  );
}
