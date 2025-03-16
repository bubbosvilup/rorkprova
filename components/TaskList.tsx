import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { Task } from '@/types/task';
import TaskItem from './TaskItem';
import { useTaskStore } from '@/store/task-store';
import { useSettingsStore } from '@/store/settings-store';
import { CategoryFilter } from './CategoryPill';
import { SearchBar } from './SearchBar';
import { EmptyState } from './EmptyState';
import { useTheme } from '@/contexts/ThemeContext';

interface TaskListProps {
  onTaskPress: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onTaskPress }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  
  const tasks = useTaskStore((state) => state.tasks);
  const setFilter = useTaskStore((state) => state.setFilter);
  const filter = useTaskStore((state) => state.filter);
  const showCompletedTasks = useSettingsStore((state) => state.showCompletedTasks);
  
  // Get filtered tasks from store
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
  
  // Apply filters manually here instead of setting a filter that causes re-renders
  const filteredTasks = getFilteredTasks().filter(task => {
    // Apply the showCompletedTasks setting directly here
    if (!showCompletedTasks && task.completed) {
      return false;
    }
    return true;
  });
  
  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, you might fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const handleSearch = (query: string) => {
    setFilter({ searchQuery: query || undefined });
  };
  
  const handleCategorySelect = (categoryId: string | undefined) => {
    setFilter({ categoryId });
  };
  
  // Group tasks by completion status
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  
  // Render section header
  const renderSectionHeader = (title: string, count: number) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={[styles.countBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        value={filter.searchQuery || ''}
        onChangeText={handleSearch}
        placeholder="Search tasks..."
      />
      
      <CategoryFilter
        onSelectCategory={handleCategorySelect}
        selectedCategoryId={filter.categoryId}
      />
      
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Try changing your filters or create a new task"
          icon="clipboard-list"
        />
      ) : (
        <FlatList
          data={[...pendingTasks, ...completedTasks]}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            // Add section headers
            const isPendingHeader = index === 0 && pendingTasks.length > 0;
            const isCompletedHeader = index === pendingTasks.length && completedTasks.length > 0;
            
            return (
              <>
                {isPendingHeader && renderSectionHeader('Pending', pendingTasks.length)}
                {isCompletedHeader && renderSectionHeader('Completed', completedTasks.length)}
                <TaskItem task={item} onPress={onTaskPress} />
              </>
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  countBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TaskList;