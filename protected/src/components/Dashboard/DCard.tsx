import React from 'react';
import { TrendingUp, DollarSign, Package } from 'lucide-react'; // Contoh ikon

interface DCardProps {
    title: string;
    value: string;
    color: string;
    icon?: React.ReactNode;
}

export default function DCard({ title, value, color, icon }: DCardProps) {
    return (
        <div className={`p-5 rounded-xl shadow-lg text-white ${color}`}>
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium opacity-80">{title}</p>
                {icon}
            </div>
            <h3 className="mt-1 text-3xl font-bold">{value}</h3>
        </div>
    );
}