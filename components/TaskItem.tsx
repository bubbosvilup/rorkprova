import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/task-store';
import { formatDate, isOverdue } from '@/utils/date';
import { calculateTaskCompletion, getPriorityColor } from '@/utils/helpers';
import { CheckCircle, Circle, Clock, Tag } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TaskItemProps {
  task: Task;
  onPress: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  const { colors } = useTheme();
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const getCategoryById = useTaskStore((state) => state.getCategoryById);
  
  const category = task.categoryId ? getCategoryById(task.categoryId) : undefined;
  const completionPercentage = calculateTaskCompletion(task);
  const isTaskOverdue = isOverdue(task.dueDate);
  
  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
  };
  
  return (
    <Pressable
      style={[
        styles.container, 
        { backgroundColor: colors.card },
        task.completed && styles.completedContainer
      ]}
      onPress={() => onPress(task.id)}
    >
      <Pressable
        style={styles.checkboxContainer}
        onPress={handleToggleCompletion}
        hitSlop={10}
      >
        {task.completed ? (
          <CheckCircle size={24} color={colors.success} />
        ) : (
          <Circle size={24} color={colors.textSecondary} />
        )}
      </Pressable>
      
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              task.completed && [styles.completedTitle, { color: colors.textSecondary }],
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          
          {task.priority !== 'none' && (
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor(task.priority) },
              ]}
            />
          )}
        </View>
        
        {task.description ? (
          <Text
            style={[
              styles.description,
              { color: colors.textSecondary },
              task.completed && styles.completedText,
            ]}
            numberOfLines={1}
          >
            {task.description}
          </Text>
        ) : null}
        
        <View style={styles.metaContainer}>
          {task.dueDate && (
            <View style={styles.metaItem}>
              <Clock
                size={14}
                color={isTaskOverdue && !task.completed ? colors.error : colors.textSecondary}
              />
              <Text
                style={[
                  styles.metaText,
                  { color: colors.textSecondary },
                  isTaskOverdue && !task.completed && [styles.overdueText, { color: colors.error }],
                  task.completed && styles.completedText,
                ]}
              >
                {formatDate(task.dueDate)}
              </Text>
            </View>
          )}
          
          {category && (
            <View style={styles.metaItem}>
              <Tag size={14} color={category.color} />
              <Text
                style={[
                  styles.metaText,
                  { color: category.color },
                  task.completed && styles.completedText,
                ]}
              >
                {category.name}
              </Text>
            </View>
          )}
        </View>
        
        {task.subtasks && task.subtasks.length > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionPercentage}%`, backgroundColor: colors.primary },
                  task.completed && [styles.completedProgressFill, { backgroundColor: colors.success }],
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    opacity: 0.7,
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  overdueText: {
    color: '#EF4444',
  },
  completedText: {
    opacity: 0.7,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  completedProgressFill: {
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 12,
    minWidth: 30,
  },
});

export default TaskItem;