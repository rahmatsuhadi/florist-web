"use client";

import React, { useState, useEffect } from "react";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue'> {
  name?: string;
  defaultValue?: string | number;
  value?: string | number;
  onValueChange?: (rawNumericValue: string) => void;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  name, 
  defaultValue,
  value,
  onValueChange,
  className = "", 
  onChange,
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [rawValue, setRawValue] = useState("");

  const formatRupiah = (val: string) => {
    const numberString = val.replace(/\D/g, "");
    if (!numberString) return "";
    return new Intl.NumberFormat("id-ID").format(Number(numberString));
  };

  // Handle uncontrolled mode (defaultValue)
  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== null && value === undefined) {
      const numericString = String(defaultValue).replace(/\D/g, "");
      setRawValue(numericString);
      setDisplayValue(formatRupiah(numericString));
    }
  }, [defaultValue, value]);

  // Handle controlled mode (value)
  useEffect(() => {
    if (value !== undefined && value !== null) {
      const numericString = String(value).replace(/\D/g, "");
      setRawValue(numericString);
      setDisplayValue(formatRupiah(numericString));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    
    // Only update internal state if it's uncontrolled
    if (value === undefined) {
      setRawValue(raw);
      setDisplayValue(formatRupiah(raw));
    }

    if (onValueChange) {
      onValueChange(raw);
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span className="text-gray-500 font-medium">Rp</span>
      </div>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand outline-none bg-gray-50/50 ${className}`}
        {...props}
      />
      {name && <input type="hidden" name={name} value={rawValue} />}
    </div>
  );
};
