"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { motion, AnimatePresence } from "framer-motion";

interface DatePickerModalProps {
  initialStartDate?: string;
  initialEndDate?: string;
  onApply: (startDate: string, endDate: string) => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  initialStartDate,
  initialEndDate,
  onApply,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(() => {
    return {
      from: initialStartDate ? new Date(initialStartDate) : undefined,
      to: initialEndDate ? new Date(initialEndDate) : undefined,
    };
  });

  // Sync when initial values change via URL
  useEffect(() => {
    setRange({
      from: initialStartDate ? new Date(initialStartDate) : undefined,
      to: initialEndDate ? new Date(initialEndDate) : undefined,
    });
  }, [initialStartDate, initialEndDate]);

  const handleApply = () => {
    if (range?.from) {
      const start = format(range.from, "yyyy-MM-dd");
      const end = range.to ? format(range.to, "yyyy-MM-dd") : start;
      onApply(start, end);
    } else {
      onApply("", "");
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setRange(undefined);
    onApply("", "");
    setIsOpen(false);
  };

  const displayText = () => {
    if (initialStartDate && initialEndDate) {
      if (initialStartDate === initialEndDate) {
        return format(new Date(initialStartDate), "dd MMM yyyy", { locale: id });
      }
      return `${format(new Date(initialStartDate), "dd MMM", { locale: id })} - ${format(
        new Date(initialEndDate),
        "dd MMM yyyy",
        { locale: id }
      )}`;
    }
    return "Pilih Rentang Tanggal";
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white border border-brand/20 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:border-brand focus:ring-1 focus:ring-brand shadow-sm cursor-pointer transition-all hover:border-brand/40 whitespace-nowrap"
      >
        <CalendarIcon size={16} className="text-gray-400" />
        {displayText()}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-gray-900/20 z-40 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-xl overflow-hidden w-[95vw] sm:w-auto border border-gray-100"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                <h3 className="font-serif font-semibold text-gray-900">Filter Tanggal</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 bg-white">
                <style>{`
                  .rdp-root {
                    --rdp-accent-color: #1e3a8a; /* Custom brand color */
                    --rdp-background-color: #f1f5f9;
                    margin: 0;
                  }
                `}</style>
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  locale={id}
                  showOutsideDays
                />
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="px-5 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-hover transition-colors shadow-sm"
                >
                  Terapkan
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
