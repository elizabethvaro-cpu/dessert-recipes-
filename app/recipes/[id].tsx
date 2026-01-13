import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { fetchMealDetail, parseIngredients } from '../../src/services/api';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { Colors } from '../../src/theme/colors';
import type { MealDetail } from '../../src/types/meals';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; meal: MealDetail };

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const mealId = typeof id === 'string' ? id : '';
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    (async () => {
      const res = await fetchMealDetail(mealId);
      if (cancelled) return;
      if (!res.ok) setState({ status: 'error', message: res.error });
      else setState({ status: 'ready', meal: res.data });
    })();
    return () => {
      cancelled = true;
    };
  }, [mealId]);

  const title = useMemo(() => {
    if (state.status === 'ready') return state.meal.strMeal;
    return 'Recipe';
  }, [state]);

  if (state.status === 'loading') return <LoadingSpinner label="Loading recipe…" />;

  if (state.status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Recipe</Text>
        <Text style={styles.muted}>We couldn’t load this recipe.</Text>
        <Text style={styles.error}>{state.message}</Text>
      </View>
    );
  }

  const meal = state.meal;
  const ingredients = parseIngredients(meal);

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {meal.strMealThumb ? (
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imageFallback]} />
        )}

        <View style={styles.card}>
          <Text style={styles.title}>{meal.strMeal}</Text>
          <View style={styles.badgesRow}>
            {!!meal.strArea && <Badge label={meal.strArea} />}
            {!!meal.strCategory && <Badge label={meal.strCategory} variant="secondary" />}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.length === 0 ? (
            <Text style={styles.muted}>No ingredient list provided.</Text>
          ) : (
            ingredients.map((line, idx) => (
              <View key={`${line.ingredient}-${idx}`} style={styles.ingredientRow}>
                <Text style={styles.ingredientBullet}>•</Text>
                <Text style={styles.ingredientText}>
                  {line.measure ? `${line.measure} ` : ''}
                  {line.ingredient}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>
            {(meal.strInstructions ?? '').trim() || 'No instructions provided.'}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

function Badge({
  label,
  variant = 'primary',
}: {
  label: string;
  variant?: 'primary' | 'secondary';
}) {
  const style = variant === 'primary' ? styles.badgePrimary : styles.badgeSecondary;
  const textStyle = variant === 'primary' ? styles.badgeTextPrimary : styles.badgeTextSecondary;
  return (
    <View style={[styles.badge, style]}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: Colors.border,
  },
  imageFallback: {
    backgroundColor: Colors.border,
  },
  card: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.chocolate,
  },
  badgesRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgePrimary: {
    backgroundColor: '#FCE7F3',
    borderColor: '#FBCFE8',
  },
  badgeSecondary: {
    backgroundColor: '#FFEDD5',
    borderColor: '#FED7AA',
  },
  badgeTextPrimary: {
    color: Colors.berry,
    fontWeight: '800',
    fontSize: 12,
  },
  badgeTextSecondary: {
    color: Colors.chocolate,
    fontWeight: '800',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ingredientBullet: {
    width: 18,
    color: Colors.berry,
    fontSize: 16,
    lineHeight: 20,
  },
  ingredientText: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  instructions: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.cream,
  },
  muted: {
    marginTop: 8,
    color: Colors.mutedText,
    textAlign: 'center',
  },
  error: {
    marginTop: 6,
    color: Colors.danger,
    textAlign: 'center',
  },
});

