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
        <div className="fixed inset-0 z-50 flex justify-center overflow-x-hidden overflow-y-auto bg-center outline-none items focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
                {/* kontnen */}
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg outline-none focus:outline-none">
                    {/* header */}
                    <div className="flex items-start justify-between p-5 border-b border-gray-500 border-solid rounded-t-md">
                        <h3 className="text-2xl font-semibold">{title}</h3>
                        <button
                            className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-50 focus:outline-none"
                            onClick={onClose}
                        >
                            <span className="block w-6 h-6 text-2xl text-black">X</span>
                        </button>
                    </div>
                    {/* body */}
                    <div className="relative flex-auto p-6">
                        {children}
                    </div>
                    {/* overlay */}
                    <div className="fixed inset-0 z-40 bg-black opacity-25" onClick={onClose}></div>
                </div>

            </div>
        </div>
    )
}
