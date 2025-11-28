"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { ToggleSwitch } from "@/components/atomic/ToggleSwitch"
import { CheckboxWithLabel } from "@/components/atomic/CheckboxWithLabel"

export interface CheckboxOption {
  checked: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
}

export interface InputField {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  type?: string;
  disabled?: boolean;
  showSaveButton?: boolean;
  onSave?: () => void;
  saveButtonLoading?: boolean;
  helperText?: string;
}

export interface AlertSectionProps {
  // Header
  icon: LucideIcon;
  iconBgColor: string; // e.g., "amber", "indigo", "blue", "purple", "red"
  iconColor: string; // e.g., "amber-600", "indigo-600"
  title: string;

  // Toggle Section
  toggleTitle: string;
  toggleDescription: string;
  enabled: boolean;
  onToggle: () => void;
  loading?: boolean;
  disabled?: boolean;

  // Optional: Checkboxes (for budget alerts)
  checkboxes?: CheckboxOption[];

  // Optional: Input Field (for large expense alerts)
  inputField?: InputField;

  // Optional: Show border after toggle section
  showBorderAfterToggle?: boolean;
}

export function AlertSection({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  toggleTitle,
  toggleDescription,
  enabled,
  onToggle,
  loading = false,
  disabled = false,
  checkboxes,
  inputField,
  showBorderAfterToggle = false,
}: AlertSectionProps) {
  // Dark mode color mappings for icon backgrounds
  const iconBgColorMap: Record<string, string> = {
    amber: "bg-amber-50 dark:bg-amber-900/20",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20",
    blue: "bg-blue-50 dark:bg-blue-900/20",
    purple: "bg-purple-50 dark:bg-purple-900/20",
    red: "bg-red-50 dark:bg-red-900/20",
  };

  const iconColorMap: Record<string, string> = {
    "amber-600": "text-amber-600 dark:text-amber-400",
    "indigo-600": "text-indigo-600 dark:text-indigo-400",
    "blue-600": "text-blue-600 dark:text-blue-400",
    "purple-600": "text-purple-600 dark:text-purple-400",
    "red-600": "text-red-600 dark:text-red-400",
  };

  const iconBg = iconBgColorMap[iconBgColor] || "bg-gray-50 dark:bg-gray-800";
  const iconTextColor = iconColorMap[iconColor] || "text-gray-600 dark:text-gray-400";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon size={20} strokeWidth={1.5} className={iconTextColor} />
        </div>
        <h3 className="text-lg sm:text-xl font-light text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </div>

      {/* Toggle Section */}
      <div
        className={`flex items-start justify-between ${
          (enabled && (checkboxes || inputField)) || showBorderAfterToggle
            ? "mb-4 pb-4 border-b border-gray-100 dark:border-gray-700"
            : ""
        }`}
      >
        <div className="flex-1">
          <p className="text-sm sm:text-base font-light text-gray-900 dark:text-gray-100 mb-1">
            {toggleTitle}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light">
            {toggleDescription}
          </p>
        </div>
        <ToggleSwitch
          enabled={enabled}
          onToggle={onToggle}
          disabled={disabled || loading}
          loading={loading}
        />
      </div>

      {/* Conditional: Checkboxes */}
      {enabled && checkboxes && checkboxes.length > 0 && (
        <div className="space-y-3 pl-1">
          {checkboxes.map((checkbox, index) => (
            <CheckboxWithLabel
              key={index}
              checked={checkbox.checked}
              onToggle={checkbox.onToggle}
              label={checkbox.label}
              disabled={checkbox.disabled || loading}
            />
          ))}
        </div>
      )}

      {/* Conditional: Input Field */}
      {enabled && inputField && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {inputField.label}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              {inputField.prefix && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-base font-light">
                  {inputField.prefix}
                </span>
              )}
              <input
                type={inputField.type || "text"}
                value={inputField.value}
                onChange={(e) => inputField.onChange(e.target.value)}
                placeholder={inputField.placeholder}
                disabled={inputField.disabled || loading}
                className={`w-full ${
                  inputField.prefix ? "pl-10" : "pl-4"
                } pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all font-light disabled:opacity-50 disabled:cursor-not-allowed`}
              />
            </div>
            {inputField.showSaveButton && inputField.onSave && (
              <button
                onClick={inputField.onSave}
                disabled={inputField.saveButtonLoading || inputField.disabled || loading}
                className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {inputField.saveButtonLoading ? "Saving..." : "Save"}
              </button>
            )}
          </div>
          {inputField.helperText && (
            <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light">
              {inputField.helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AlertSection;

