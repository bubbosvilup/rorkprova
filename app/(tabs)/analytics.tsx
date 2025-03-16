import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '@/store/task-store';
import { calculateTaskStats } from '@/utils/helpers';
import StatsCard from '@/components/StatsCard';
import { BarChart2, PieChart, TrendingUp, Calendar } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const tasks = useTaskStore((state) => state.tasks);
  const categories = useTaskStore((state) => state.categories);
  
  const stats = calculateTaskStats(tasks);
  
  // Calculate category distribution
  const categoryStats = categories.map(category => {
    const count = stats.byCategory[category.id] || 0;
    const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      count,
      percentage
    };
  }).filter(cat => cat.count > 0);
  
  // Calculate priority distribution
  const priorityStats = [
    { name: 'High', color: colors.highPriority, count: stats.byPriority.high },
    { name: 'Medium', color: colors.mediumPriority, count: stats.byPriority.medium },
    { name: 'Low', color: colors.lowPriority, count: stats.byPriority.low },
    { name: 'None', color: colors.textSecondary, count: stats.byPriority.none },
  ].filter(p => p.count > 0);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Analytics',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <StatsCard stats={stats} />
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <PieChart size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          </View>
          
          {categoryStats.length > 0 ? (
            <View style={styles.distributionContainer}>
              {categoryStats.map((category) => (
                <View key={category.id} style={styles.distributionItem}>
                  <View style={[styles.distributionBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.distributionFill,
                        { width: `${category.percentage}%`, backgroundColor: category.color },
                      ]}
                    />
                  </View>
                  <View style={styles.distributionLabelContainer}>
                    <Text style={[styles.distributionLabel, { color: colors.text }]}>{category.name}</Text>
                    <Text style={[styles.distributionValue, { color: colors.textSecondary }]}>{category.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No category data available</Text>
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <BarChart2 size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority Distribution</Text>
          </View>
          
          {priorityStats.length > 0 ? (
            <View style={styles.distributionContainer}>
              {priorityStats.map((priority) => (
                <View key={priority.name} style={styles.distributionItem}>
                  <View style={[styles.distributionBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.distributionFill,
                        {
                          width: `${tasks.length > 0 ? (priority.count / tasks.length) * 100 : 0}%`,
                          backgroundColor: priority.color,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.distributionLabelContainer}>
                    <Text style={[styles.distributionLabel, { color: colors.text }]}>{priority.name}</Text>
                    <Text style={[styles.distributionValue, { color: colors.textSecondary }]}>{priority.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No priority data available</Text>
          )}
        </View>
        
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Calendar size={24} color={colors.primary} />
          <View style={styles.infoCardContent}>
            <Text style={[styles.infoCardTitle, { color: colors.text }]}>Task Insights</Text>
            <Text style={[styles.infoCardDescription, { color: colors.textSecondary }]}>
              {stats.overdue > 0
                ? `You have ${stats.overdue} overdue task${stats.overdue !== 1 ? 's' : ''}. Consider prioritizing these tasks.`
                : 'Great job! You have no overdue tasks.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  distributionContainer: {
    marginTop: 8,
  },
  distributionItem: {
    marginBottom: 12,
  },
  distributionBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distributionLabel: {
    fontSize: 14,
  },
  distributionValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoCardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});