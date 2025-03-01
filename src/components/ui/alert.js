import React from 'react';

export function Alert({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    destructive: "bg-red-500/15 text-red-500",
    warning: "bg-yellow-500/15 text-yellow-500",
    success: "bg-green-500/15 text-green-500",
    info: "bg-blue-500/15 text-blue-400",
  };

  return (
    <div className={`rounded-lg px-4 py-3 text-sm ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = "" }) {
  return (
    <h5 className={`font-medium leading-none tracking-tight mb-1 ${className}`}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className = "" }) {
  return (
    <div className={`text-sm opacity-90 ${className}`}>
      {children}
    </div>
  );
} 