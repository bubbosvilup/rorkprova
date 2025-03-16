import React, { useState } from 'react';
import { View, StyleSheet, Modal, Platform, Text } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '@/store/task-store';
import { useSettingsStore } from '@/store/settings-store';
import TaskList from '@/components/TaskList';
import FloatingActionButton from '@/components/FloatingActionButton';
import TaskForm from '@/components/TaskForm';
import TaskDetail from '@/components/TaskDetail';
import { useTheme } from '@/contexts/ThemeContext';

export default function TasksScreen() {
  const { colors } = useTheme();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);
  const selectTask = useTaskStore((state) => state.selectTask);
  const userName = useSettingsStore((state) => state.userName);
  
  const handleAddTask = () => {
    selectTask(null);
    setIsEditMode(false);
    setIsFormVisible(true);
  };
  
  const handleTaskPress = (taskId: string) => {
    selectTask(taskId);
    setIsDetailVisible(true);
  };
  
  const handleEditTask = () => {
    setIsDetailVisible(false);
    setIsEditMode(true);
    setIsFormVisible(true);
  };
  
  const handleCloseForm = () => {
    setIsFormVisible(false);
    if (isEditMode) {
      setIsEditMode(false);
      setIsDetailVisible(true);
    }
  };
  
  const handleCloseDetail = () => {
    setIsDetailVisible(false);
    selectTask(null);
  };
  
  // For web, we'll use a different layout approach
  const isWeb = Platform.OS === 'web';
  
  // Create a greeting based on user name
  const greeting = userName ? `Hello, ${userName}` : 'My Tasks';
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: greeting,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />
      
      <View style={styles.content}>
        <TaskList onTaskPress={handleTaskPress} />
        
        {!isWeb ? (
          // Mobile modals
          <>
            <Modal
              visible={isFormVisible}
              animationType="slide"
              presentationStyle="pageSheet"
              onRequestClose={handleCloseForm}
            >
              <TaskForm
                taskId={isEditMode ? selectedTaskId || undefined : undefined}
                onClose={handleCloseForm}
              />
            </Modal>
            
            <Modal
              visible={isDetailVisible}
              animationType="slide"
              presentationStyle="pageSheet"
              onRequestClose={handleCloseDetail}
            >
              {selectedTaskId && (
                <TaskDetail
                  taskId={selectedTaskId}
                  onClose={handleCloseDetail}
                  onEdit={handleEditTask}
                />
              )}
            </Modal>
          </>
        ) : (
          // Web "modals" (actually just conditionally rendered components)
          <>
            {isFormVisible && (
              <View style={[styles.webModal, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                <View style={[styles.webModalContent, { backgroundColor: colors.background }]}>
                  <TaskForm
                    taskId={isEditMode ? selectedTaskId || undefined : undefined}
                    onClose={handleCloseForm}
                  />
                </View>
              </View>
            )}
            
            {isDetailVisible && selectedTaskId && (
              <View style={[styles.webModal, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                <View style={[styles.webModalContent, { backgroundColor: colors.background }]}>
                  <TaskDetail
                    taskId={selectedTaskId}
                    onClose={handleCloseDetail}
                    onEdit={handleEditTask}
                  />
                </View>
              </View>
            )}
          </>
        )}
        
        <FloatingActionButton onPress={handleAddTask} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  webModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  webModalContent: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
});