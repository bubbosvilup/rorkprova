import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useTaskStore } from '@/store/task-store';
import { formatDate, getRelativeDateLabel, isOverdue } from '@/utils/date';
import { calculateTaskCompletion, getPriorityColor } from '@/utils/helpers';
import {
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  Trash2,
  Edit,
  CheckCircle,
  Circle,
  ChevronLeft,
  MoreVertical,
} from 'lucide-react-native';
import { Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
  onEdit: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({
  taskId,
  onClose,
  onEdit,
}) => {
  const { colors } = useTheme();
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const getCategoryById = useTaskStore((state) => state.getCategoryById);
  const toggleTaskCompletion = useTaskStore((state) => state.toggleTaskCompletion);
  const toggleSubtaskCompletion = useTaskStore((state) => state.toggleSubtaskCompletion);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  
  const task = getTaskById(taskId);
  const category = task?.categoryId ? getCategoryById(task.categoryId) : undefined;
  
  const [showOptions, setShowOptions] = useState(false);
  
  if (!task) {
    return null;
  }
  
  const completionPercentage = calculateTaskCompletion(task);
  const isTaskOverdue = isOverdue(task.dueDate);
  
  const handleToggleCompletion = () => {
    toggleTaskCompletion(taskId);
  };
  
  const handleToggleSubtask = (subtaskId: string) => {
    toggleSubtaskCompletion(taskId, subtaskId);
  };
  
  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this task?')) {
        deleteTask(taskId);
        onClose();
      }
    } else {
      Alert.alert(
        'Delete Task',
        'Are you sure you want to delete this task?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteTask(taskId);
              onClose();
            },
          },
        ]
      );
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable style={styles.backButton} onPress={onClose}>
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Task Details
        </Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerButton} onPress={onEdit}>
            <Edit size={20} color={colors.text} />
          </Pressable>
          <Pressable
            style={styles.headerButton}
            onPress={() => setShowOptions(!showOptions)}
          >
            <MoreVertical size={20} color={colors.text} />
          </Pressable>
        </View>
        
        {showOptions && (
          <View style={[styles.optionsMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Pressable style={styles.optionItem} onPress={handleDelete}>
              <Trash2 size={18} color={colors.error} />
              <Text style={[styles.optionText, { color: colors.error }]}>
                Delete Task
              </Text>
            </Pressable>
          </View>
        )}
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.titleContainer}>
          <Pressable
            style={styles.checkboxContainer}
            onPress={handleToggleCompletion}
          >
            {task.completed ? (
              <CheckCircle size={24} color={colors.success} />
            ) : (
              <Circle size={24} color={colors.textSecondary} />
            )}
          </Pressable>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              task.completed && [styles.completedTitle, { color: colors.textSecondary }],
            ]}
          >
            {task.title}
          </Text>
        </View>
        
        <View style={styles.metaContainer}>
          {task.priority !== 'none' && (
            <View style={styles.metaItem}>
              <AlertCircle
                size={16}
                color={getPriorityColor(task.priority)}
              />
              <Text
                style={[
                  styles.metaText,
                  { color: getPriorityColor(task.priority) },
                ]}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </Text>
            </View>
          )}
          
          {task.dueDate && (
            <View style={styles.metaItem}>
              <Clock
                size={16}
                color={
                  isTaskOverdue && !task.completed
                    ? colors.error
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.metaText,
                  { color: colors.textSecondary },
                  isTaskOverdue && !task.completed && [styles.overdueText, { color: colors.error }],
                ]}
              >
                Due {getRelativeDateLabel(task.dueDate)}
              </Text>
            </View>
          )}
          
          {category && (
            <View style={styles.metaItem}>
              <Tag size={16} color={category.color} />
              <Text
                style={[styles.metaText, { color: category.color }]}
              >
                {category.name}
              </Text>
            </View>
          )}
        </View>
        
        {task.description ? (
          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.description, { color: colors.text }]}>{task.description}</Text>
          </View>
        ) : null}
        
        {task.subtasks && task.subtasks.length > 0 && (
          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Subtasks</Text>
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
            
            {task.subtasks.map((subtask) => (
              <Pressable
                key={subtask.id}
                style={styles.subtaskItem}
                onPress={() => handleToggleSubtask(subtask.id)}
              >
                {subtask.completed ? (
                  <CheckCircle size={20} color={colors.success} />
                ) : (
                  <Circle size={20} color={colors.textSecondary} />
                )}
                <Text
                  style={[
                    styles.subtaskText,
                    { color: colors.text },
                    subtask.completed && [styles.completedSubtaskText, { color: colors.textSecondary }],
                  ]}
                >
                  {subtask.title}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Created</Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {formatDate(task.createdAt)}
          </Text>
        </View>
        
        {task.updatedAt !== task.createdAt && (
          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Last Updated</Text>
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              {formatDate(task.updatedAt)}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  optionsMenu: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
    borderWidth: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  optionText: {
    fontSize: 14,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 6,
  },
  overdueText: {
    color: '#EF4444',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  completedProgressFill: {
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 14,
    minWidth: 40,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subtaskText: {
    fontSize: 16,
    marginLeft: 12,
  },
  completedSubtaskText: {
    textDecorationLine: 'line-through',
  },
  dateText: {
    fontSize: 14,
  },
});

export default TaskDetail;