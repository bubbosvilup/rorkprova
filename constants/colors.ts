// Color palette for the application
export const colors = {
  // Primary colors
  primary: '#6366F1', // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary colors
  secondary: '#F59E0B', // Amber
  secondaryLight: '#FBBF24',
  secondaryDark: '#D97706',
  
  // Neutral colors
  background: '#FFFFFF',
  card: '#F9FAFB',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  
  // Status colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Priority colors
  highPriority: '#EF4444',
  mediumPriority: '#F59E0B',
  lowPriority: '#10B981',
};

// Theme configuration
export const theme = {
  light: {
    text: colors.text,
    textSecondary: colors.textSecondary,
    background: colors.background,
    card: colors.card,
    primary: colors.primary,
    secondary: colors.secondary,
    border: colors.border,
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    background: '#111827',
    card: '#1F2937',
    primary: colors.primaryLight,
    secondary: colors.secondaryLight,
    border: '#374151',
  },
};

export default colors;