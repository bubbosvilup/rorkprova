import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClipboardList, CheckCircle, Calendar, BarChart } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'clipboard-list' | 'check-circle' | 'calendar' | 'bar-chart';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'clipboard-list',
}) => {
  const { colors } = useTheme();
  
  const renderIcon = () => {
    const iconSize = 64;
    const iconColor = colors.primary;

    switch (icon) {
      case 'clipboard-list':
        return <ClipboardList size={iconSize} color={iconColor} />;
      case 'check-circle':
        return <CheckCircle size={iconSize} color={iconColor} />;
      case 'calendar':
        return <Calendar size={iconSize} color={iconColor} />;
      case 'bar-chart':
        return <BarChart size={iconSize} color={iconColor} />;
      default:
        return <ClipboardList size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default EmptyState;