import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskStats } from '@/types/task';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface StatsCardProps {
  stats: TaskStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Task Overview</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <CheckCircle size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.completed}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
            <Clock size={20} color={colors.error} />
          </View>
          <View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.overdue}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Overdue</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary + '20' }]}>
            <Calendar size={20} color={colors.secondary} />
          </View>
          <View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.upcoming}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Upcoming</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.success + '20' }]}>
            <AlertCircle size={20} color={colors.success} />
          </View>
          <View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.total}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.completionContainer, { borderTopColor: colors.border }]}>
        <View style={styles.completionHeader}>
          <Text style={[styles.completionTitle, { color: colors.text }]}>Completion Rate</Text>
          <Text style={[styles.completionPercentage, { color: colors.primary }]}>{stats.completionRate}%</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${stats.completionRate}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  completionContainer: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  completionPercentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default StatsCard;