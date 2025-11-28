"use client"

import * as React from "react"

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ToggleSwitch({ enabled, onToggle, disabled, loading }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled || loading}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        enabled ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${
        disabled ? 'cursor-not-allowed' : ''
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full transition-transform ${
          enabled ? 'transform translate-x-5' : ''
        } ${loading ? 'animate-pulse' : ''}`}
      />
    </button>
  );
}

