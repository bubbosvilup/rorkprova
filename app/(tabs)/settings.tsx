import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert, Platform, TextInput, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/store/settings-store';
import { useTaskStore } from '@/store/task-store';
import {
  Moon,
  Sun,
  Eye,
  EyeOff,
  List,
  Trash2,
  Info,
  HelpCircle,
  ChevronRight,
  User,
  Github,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  
  const {
    showCompletedTasks,
    userName,
    setShowCompletedTasks,
    setUserName,
  } = useSettingsStore();
  
  const tasks = useTaskStore((state) => state.tasks);
  const clearCompletedTasks = useTaskStore((state) => state.clearCompletedTasks);
  
  const [nameInput, setNameInput] = useState(userName);
  const [isEditingName, setIsEditingName] = useState(false);
  
  const handleToggleShowCompleted = (value: boolean) => {
    setShowCompletedTasks(value);
  };
  
  const handleClearCompletedTasks = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    
    if (completedCount === 0) {
      if (Platform.OS === 'web') {
        alert('No completed tasks to clear.');
      } else {
        Alert.alert('No Tasks', 'There are no completed tasks to clear.');
      }
      return;
    }
    
    const confirmClear = () => {
      clearCompletedTasks();
      if (Platform.OS === 'web') {
        alert(`Cleared ${completedCount} completed tasks.`);
      } else {
        Alert.alert('Success', `Cleared ${completedCount} completed tasks.`);
      }
    };
    
    if (Platform.OS === 'web') {
      if (confirm(`Are you sure you want to clear ${completedCount} completed tasks?`)) {
        confirmClear();
      }
    } else {
      Alert.alert(
        'Clear Completed Tasks',
        `Are you sure you want to clear ${completedCount} completed tasks?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: confirmClear },
        ]
      );
    }
  };
  
  const handleSaveName = () => {
    setUserName(nameInput.trim());
    setIsEditingName(false);
  };
  
  const handleOpenGithub = () => {
    Linking.openURL('https://github.com/bubbosvilup');
  };
  
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
        pressed && onPress && [styles.settingItemPressed, { backgroundColor: colors.border + '50' }],
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{description}</Text>
        )}
      </View>
      {rightElement}
    </Pressable>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>User Profile</Text>
          {isEditingName ? (
            <View style={[styles.settingItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <View style={styles.settingIcon}>
                <User size={22} color={colors.text} />
              </View>
              <View style={styles.settingContent}>
                <TextInput
                  style={[styles.nameInput, { color: colors.text, borderColor: colors.border }]}
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textSecondary}
                  autoFocus
                  onSubmitEditing={handleSaveName}
                />
              </View>
              <Pressable onPress={handleSaveName} style={styles.saveButton}>
                <Text style={[styles.saveButtonText, { color: colors.primary }]}>Save</Text>
              </Pressable>
            </View>
          ) : (
            renderSettingItem(
              <User size={22} color={colors.text} />,
              'Your Name',
              userName ? userName : 'Set your name to personalize the app',
              <ChevronRight size={20} color={colors.textSecondary} />,
              () => setIsEditingName(true)
            )
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Appearance</Text>
          {renderSettingItem(
            isDark ? <Moon size={22} color={colors.text} /> : <Sun size={22} color={colors.text} />,
            'Theme',
            isDark ? 'Dark theme is currently active' : 'Light theme is currently active',
            <View style={styles.themeToggle}>
              <Sun size={18} color={!isDark ? colors.primary : colors.textSecondary} />
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDark ? colors.primary : colors.border}
              />
              <Moon size={18} color={isDark ? colors.primary : colors.textSecondary} />
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Task Display</Text>
          {renderSettingItem(
            showCompletedTasks ? (
              <Eye size={22} color={colors.text} />
            ) : (
              <EyeOff size={22} color={colors.text} />
            ),
            'Show Completed Tasks',
            showCompletedTasks
              ? 'Completed tasks are visible'
              : 'Completed tasks are hidden',
            <Switch
              value={showCompletedTasks}
              onValueChange={handleToggleShowCompleted}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : showCompletedTasks ? colors.primary : colors.border}
            />
          )}
          
          {renderSettingItem(
            <List size={22} color={colors.text} />,
            'Default View',
            'Choose how tasks are displayed',
            <ChevronRight size={20} color={colors.textSecondary} />,
            () => {
              // In a real app, this would open a view selection screen
              if (Platform.OS === 'web') {
                alert('This feature is not implemented in the demo.');
              } else {
                Alert.alert('Coming Soon', 'This feature is not implemented in the demo.');
              }
            }
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Data Management</Text>
          {renderSettingItem(
            <Trash2 size={22} color={colors.error} />,
            'Clear Completed Tasks',
            'Remove all completed tasks',
            <ChevronRight size={20} color={colors.textSecondary} />,
            handleClearCompletedTasks
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>About</Text>
          {renderSettingItem(
            <Info size={22} color={colors.text} />,
            'Version',
            'TaskMaster 1.0.0'
          )}
          
          {renderSettingItem(
            <Github size={22} color={colors.text} />,
            'Developer',
            'Coded by: Bubbo',
            <ChevronRight size={20} color={colors.textSecondary} />,
            handleOpenGithub
          )}
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingItemPressed: {
    opacity: 0.7,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontWeight: '600',
  },
});