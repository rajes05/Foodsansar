import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const PAYMENT_OPTIONS = [
    {
        id: 'esewa',
        name: 'eSewa',
        tagline: 'Pay instantly, anywhere in Nepal',
        logo: 'https://esewa.com.np/common/images/esewa_logo.png',
        logoBg: '#f0faea',
        accent: '#60BB46',
        lightBg: '#f6fdf3',
        border: '#d4f0c4',
        logoSize: 'w-16 h-16',   // bigger for eSewa
    },
    {
        id: 'khalti',
        name: 'Khalti',
        tagline: 'Fast & Secure Payments',
        logo: 'https://web.khalti.com/static/img/logo1.png',
        logoBg: '#f5f0fc',
        accent: '#5C2D91',
        lightBg: '#faf7ff',
        border: '#ddd0f5',
        logoSize: 'w-14 h-14',
    },
];

export default function EPayModal({ isOpen, onClose, onSelect, amount }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!isOpen) return null;

    const modal = (
        <div
            className="fixed inset-0 flex items-end sm:items-center justify-center"
            style={{
                zIndex: 99999,          // well above Leaflet's max z-index (~1000)
                animation: 'fadeInBg 0.2s ease forwards',
            }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                style={{ zIndex: 0 }}
                onClick={onClose}
            />
            {/* End Backdrop */}


            {/* ===== Modal Card ===== */}
            <div
                className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
                style={{
                    zIndex: 1,
                    animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
                }}
            >
                {/* Mobile drag handle */}
                <div className="flex justify-center pt-3 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                {/* Header */}
                <div className="px-6 pt-5 pb-4 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                            Complete Payment
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Select your preferred payment method
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer mt-0.5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 text-xl leading-none"
                    >
                        ×
                    </button>
                </div>
                {/* End Header */}


                {/* Amount Banner */}
                <div
                    className="mx-6 mb-5 rounded-2xl px-5 py-4 flex items-center justify-between"
                    style={{ background: 'linear-gradient(135deg, #ff4d2d 0%, #ff7849 100%)' }}
                >
                    <div>
                        <p className="text-orange-100 text-xs font-medium">Amount to Pay</p>
                        <p className="text-white text-2xl font-extrabold tracking-tight mt-0.5">
                            Rs {amount}
                        </p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">₨</span>
                        </div>
                    </div>
                </div>
                {/* End Amount Banner */}


                {/* Payment Options */}
                <div className="px-6 pb-6 space-y-3">
                    {PAYMENT_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onSelect(option.id)}
                            className="w-full flex items-center gap-4 rounded-2xl border-2 px-4 py-4 transition-all duration-200 cursor-pointer text-left group"
                            style={{ borderColor: option.border, backgroundColor: option.lightBg }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = option.accent;
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = `0 6px 20px ${option.accent}28`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = option.border;
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Logo */}
                            <div
                                className={`shrink-0 ${option.logoSize} rounded-xl flex items-center justify-center overflow-hidden p-2`}
                                style={{ backgroundColor: option.logoBg, border: `1.5px solid ${option.border}` }}
                            >
                                <img
                                    src={option.logo}
                                    alt={option.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        const span = document.createElement('span');
                                        span.textContent = option.name;
                                        span.style.cssText = `font-weight:800;font-size:11px;color:${option.accent}`;
                                        e.target.replaceWith(span);
                                    }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 text-sm">{option.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{option.tagline}</p>
                            </div>

                            {/* Arrow */}
                            <div
                                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-white text-base transition-transform duration-200 group-hover:translate-x-0.5"
                                style={{ backgroundColor: option.accent }}
                            >
                                →
                            </div>
                        </button>
                    ))}
                </div>
                {/* End Payment Options */}


            </div>
            {/* ===== End Modal Card ===== */}


            <style>
                {`
        @keyframes fadeInBg {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(48px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}
            </style>

        </div>
    );

    // Portal renders modal at document.body level, completely outside the map DOM tree
    return createPortal(modal, document.body);
}