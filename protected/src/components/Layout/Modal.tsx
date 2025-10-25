import type { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [visible, setVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setVisible(true);
    }, [isOpen]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 200); 
    };

    if (!isOpen && !visible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${
                visible ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-200 ${
                    isDark ? "bg-black/50" : "bg-black/25"
                }`}
                onClick={handleClose}
            ></div>

            <div
                onClick={(e) => e.stopPropagation()}
                className={`
                    relative z-50 flex flex-col w-full max-w-3xl 
                    rounded-lg shadow-lg transform transition-transform duration-200
                    ${visible ? "scale-100" : "scale-95"}
                    ${isDark ? "bg-gray-800 border border-gray-700 text-gray-100" : "bg-white border border-gray-200 text-gray-800"}
                `}
            >
                <div className={`flex items-start justify-between p-5 border-b rounded-t-md ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    <h3 className="text-2xl font-semibold">{title}</h3>
                    <button
                        className={isDark ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-black"}
                        onClick={handleClose}
                    >
                        <span className="block w-6 h-6 text-2xl font-bold text-red-600">X</span>
                    </button>
                </div>

                <div className={`p-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
