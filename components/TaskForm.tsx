import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { useTaskStore } from '@/store/task-store';
import { Task, Priority } from '@/types/task';
import { Calendar, Clock, Tag, AlertCircle, X, Plus, Check } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TaskFormProps {
  taskId?: string;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ taskId, onClose }) => {
  const { colors } = useTheme();
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const categories = useTaskStore((state) => state.categories);
  
  const existingTask = taskId ? getTaskById(taskId) : undefined;
  
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [priority, setPriority] = useState<Priority>(existingTask?.priority || 'none');
  const [categoryId, setCategoryId] = useState<string | undefined>(existingTask?.categoryId);
  const [dueDate, setDueDate] = useState<string | undefined>(existingTask?.dueDate);
  const [completed, setCompleted] = useState(existingTask?.completed || false);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  
  const isEditing = !!existingTask;
  
  useEffect(() => {
    if (existingTask?.subtasks) {
      const incompleteTitles = existingTask.subtasks
        .filter(subtask => !subtask.completed)
        .map(subtask => subtask.title);
      setSubtasks(incompleteTitles);
    }
  }, [existingTask]);
  
  const handleSave = () => {
    if (!title.trim()) {
      // Show validation error
      return;
    }
    
    if (isEditing && taskId) {
      updateTask(taskId, {
        title,
        description: description || undefined,
        priority,
        categoryId,
        dueDate,
        completed,
      });
      
      // Add new subtasks
      if (subtasks.length > 0) {
        const existingSubtaskTitles = existingTask?.subtasks?.map(s => s.title) || [];
        const newSubtaskTitles = subtasks.filter(s => !existingSubtaskTitles.includes(s));
        
        newSubtaskTitles.forEach(subtaskTitle => {
          if (subtaskTitle.trim()) {
            useTaskStore.getState().addSubtask(taskId, subtaskTitle);
          }
        });
      }
    } else {
      const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        description: description || undefined,
        priority,
        categoryId,
        dueDate,
        completed,
      };
      
      addTask(newTask);
    }
    
    onClose();
  };
  
  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtask('');
    }
  };
  
  const handleRemoveSubtask = (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks.splice(index, 1);
    setSubtasks(updatedSubtasks);
  };
  
  const renderPriorityOption = (value: Priority, label: string, color: string) => (
    <Pressable
      style={[
        styles.priorityOption,
        { borderColor: colors.border },
        priority === value && { backgroundColor: color, borderColor: color },
      ]}
      onPress={() => setPriority(value)}
    >
      <Text
        style={[
          styles.priorityLabel,
          { color: priority === value ? '#FFFFFF' : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEditing ? 'Edit Task' : 'New Task'}
        </Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={24} color={colors.text} />
        </Pressable>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Title</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={colors.textSecondary}
            autoFocus
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[
              styles.input, 
              styles.textArea, 
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about this task"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
          <View style={styles.priorityContainer}>
            {renderPriorityOption('high', 'High', colors.highPriority)}
            {renderPriorityOption('medium', 'Medium', colors.mediumPriority)}
            {renderPriorityOption('low', 'Low', colors.lowPriority)}
            {renderPriorityOption('none', 'None', colors.textSecondary)}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryOption,
                  {
                    backgroundColor:
                      categoryId === category.id
                        ? category.color
                        : 'transparent',
                    borderColor: category.color,
                  },
                ]}
                onPress={() => setCategoryId(category.id)}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    {
                      color:
                        categoryId === category.id
                          ? '#FFFFFF'
                          : category.color,
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        
        {isEditing && (
          <View style={styles.formGroup}>
            <View style={styles.switchRow}>
              <Text style={[styles.label, { color: colors.text }]}>Completed</Text>
              <Switch
                value={completed}
                onValueChange={setCompleted}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : completed ? colors.success : colors.border}
              />
            </View>
          </View>
        )}
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Subtasks</Text>
          {subtasks.map((subtask, index) => (
            <View key={index} style={[styles.subtaskItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.subtaskText, { color: colors.text }]} numberOfLines={1}>
                {subtask}
              </Text>
              <Pressable
                style={styles.subtaskRemoveButton}
                onPress={() => handleRemoveSubtask(index)}
              >
                <X size={16} color={colors.textSecondary} />
              </Pressable>
            </View>
          ))}
          
          <View style={[styles.subtaskInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.subtaskInput, { color: colors.text }]}
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholder="Add a subtask"
              placeholderTextColor={colors.textSecondary}
              onSubmitEditing={handleAddSubtask}
              returnKeyType="done"
            />
            <Pressable
              style={[
                styles.subtaskAddButton,
                !newSubtask.trim() && styles.subtaskAddButtonDisabled,
              ]}
              onPress={handleAddSubtask}
              disabled={!newSubtask.trim()}
            >
              <Plus
                size={20}
                color={
                  newSubtask.trim() ? colors.primary : colors.textSecondary
                }
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Pressable 
          style={[styles.cancelButton, { backgroundColor: colors.card, borderColor: colors.border }]} 
          onPress={onClose}
        >
          <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[
            styles.saveButton, 
            { backgroundColor: colors.primary },
            !title.trim() && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!title.trim()}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update' : 'Create'}
          </Text>
        </Pressable>
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
  },
  subtaskRemoveButton: {
    padding: 4,
  },
  subtaskInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  subtaskInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  subtaskAddButton: {
    padding: 12,
  },
  subtaskAddButtonDisabled: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default TaskForm;