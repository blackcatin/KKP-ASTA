import type { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div className="fixed inset-0 z-40 bg-black opacity-25" onClick={onClose}></div>

            {/* kontnen */}
            <div onClick={e => e.stopPropagation()}
                className="relative z-50 flex flex-col w-full max-w-3xl bg-white border-0 rounded-lg">
                {/* header */}
                <div className="flex items-start justify-between p-5 border-b border-gray-500 border-solid rounded-t-md">
                    <h3 className="text-2xl font-semibold">{title}</h3>
                    <button
                        className="text-gray-500 hover:text-black"
                        onClick={onClose}
                    >
                        <span className="block w-6 h-6 text-2xl font-bold text-red-600">X</span>
                    </button>
                </div>
                {/* body */}
                <div className="p-6">
                    {children}
                </div>
            </div>

        </div>
    )
}
