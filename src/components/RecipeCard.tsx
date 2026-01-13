import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import type { MealSummary } from '../types/meals';

type Props = {
  meal: MealSummary;
  subtitle?: string;
  description?: string;
  onPress: () => void;
};

export function RecipeCard({ meal, subtitle, description, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {meal.strMeal}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        {!!description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.88,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.cream,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.berry,
    fontWeight: '600',
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    color: Colors.mutedText,
    lineHeight: 18,
  },
});

