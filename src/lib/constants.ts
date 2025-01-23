export const COLORS = {
  // Brand Colors
  primary: {
    light: "#F3E8FF", // violet-50
    medium: "#8B5CF6", // violet-500
    dark: "#6D28D9", // violet-700
  },
  success: {
    light: "#ECFDF5", // emerald-50
    medium: "#34D399", // emerald-400
    dark: "#047857", // emerald-700
    ring: "#D1FAE5", // emerald-100
  },
  error: {
    light: "#FEF2F2", // red-50
    medium: "#F87171", // red-400
    dark: "#B91C1C", // red-700
    ring: "#FEE2E2", // red-100
  },
  warning: {
    light: "#FFFBEB", // amber-50
    medium: "#F59E0B", // amber-500
    dark: "#B45309", // amber-700
  },
  info: {
    light: "#EFF6FF", // blue-50
    medium: "#3B82F6", // blue-500
    dark: "#1D4ED8", // blue-700
  },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  }
}

export const SPACING = {
  xs: "0.5rem",    // 8px
  sm: "0.75rem",   // 12px
  md: "1rem",      // 16px
  lg: "1.5rem",    // 24px
  xl: "2rem",      // 32px
  "2xl": "3rem",   // 48px
}

export const SHADOWS = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
}

export const TRANSITIONS = {
  DEFAULT: "all 0.3s ease",
  fast: "all 0.15s ease",
  slow: "all 0.5s ease",
}

export const BORDER_RADIUS = {
  sm: "0.375rem",   // 6px
  DEFAULT: "0.5rem", // 8px
  md: "0.75rem",    // 12px
  lg: "1rem",       // 16px
  full: "9999px",
}

export const CARD_STYLES = {
  DEFAULT: "bg-white rounded-xl p-6 shadow-sm border border-gray-100",
  hover: "hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
  interactive: "cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
}

export const STAT_INDICATOR_STYLES = {
  success: "bg-emerald-50 text-emerald-700",
  error: "bg-red-50 text-red-700",
  warning: "bg-amber-50 text-amber-700",
  info: "bg-blue-50 text-blue-700",
  neutral: "bg-gray-50 text-gray-700",
} 