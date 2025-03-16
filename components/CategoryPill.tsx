import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Category } from '@/types/task';
import { useTaskStore } from '@/store/task-store';
import { useTheme } from '@/contexts/ThemeContext';

interface CategoryPillProps {
  category: Category;
  selected?: boolean;
  onPress?: (id: string) => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  selected = false,
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(category.id);
    }
  };

  return (
    <Pressable
      style={[
        styles.container,
        { borderColor: category.color },
        selected && { backgroundColor: category.color },
      ]}
      onPress={handlePress}
    >
      <Text
        style={[
          styles.text,
          { color: category.color },
          selected && styles.selectedText,
        ]}
      >
        {category.name}
      </Text>
    </Pressable>
  );
};

interface CategoryFilterProps {
  onSelectCategory: (categoryId: string | undefined) => void;
  selectedCategoryId?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  onSelectCategory,
  selectedCategoryId,
}) => {
  const { colors } = useTheme();
  const categories = useTaskStore((state) => state.categories);

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      // If already selected, deselect it
      onSelectCategory(undefined);
    } else {
      onSelectCategory(categoryId);
    }
  };

  return (
    <View style={styles.filterContainer}>
      {categories.map((category) => (
        <CategoryPill
          key={category.id}
          category={category}
          selected={selectedCategoryId === category.id}
          onPress={handleCategoryPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});

export default CategoryPill;