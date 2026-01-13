import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  fetchDesserts,
  fetchDessertsByArea,
  fetchMealDetail,
  getShortDescription,
} from '../../src/services/api';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { RecipeCard } from '../../src/components/RecipeCard';
import { Colors } from '../../src/theme/colors';
import type { MealSummary } from '../../src/types/meals';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; meals: MealSummary[] };

export default function RecipeListScreen() {
  const router = useRouter();
  const { area } = useLocalSearchParams<{ area?: string }>();
  const areaLabel = typeof area === 'string' && area.trim() ? area : undefined;

  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [metaById, setMetaById] = useState<Record<string, { description?: string; area?: string }>>({});
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    setMetaById({});
    (async () => {
      const res = areaLabel ? await fetchDessertsByArea(areaLabel) : await fetchDesserts();
      if (cancelled) return;
      if (!res.ok) setState({ status: 'error', message: res.error });
      else setState({ status: 'ready', meals: res.data });
    })();
    return () => {
      cancelled = true;
    };
  }, [areaLabel, reloadKey]);

  // Optional UX enhancement: prefetch a handful of details to show short descriptions (when available)
  // and to avoid a "blank" feel on the list screen.
  useEffect(() => {
    if (state.status !== 'ready') return;
    let cancelled = false;
    (async () => {
      const first = state.meals.slice(0, 10);
      await Promise.all(
        first.map(async (m) => {
          const detail = await fetchMealDetail(m.idMeal);
          if (!detail.ok || cancelled) return;
          const desc = getShortDescription(detail.data.strInstructions, 90);
          setMetaById((prev) => ({
            ...prev,
            [m.idMeal]: { description: desc || undefined, area: detail.data.strArea ?? undefined },
          }));
        })
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [state]);

  const title = useMemo(() => (areaLabel ? `${areaLabel} desserts` : 'All desserts'), [areaLabel]);

  if (state.status === 'loading') return <LoadingSpinner label={`Loading ${title.toLowerCase()}…`} />;

  if (state.status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.muted}>We couldn’t load recipes.</Text>
        <Text style={styles.error}>{state.message}</Text>
        <Pressable
          onPress={() => {
            setState({ status: 'loading' });
            setReloadKey((v) => v + 1);
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title }} />
      <FlatList
        data={state.meals}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const meta = metaById[item.idMeal];
          const subtitle = areaLabel ? areaLabel : meta?.area ? meta.area : 'Global';
          return (
            <RecipeCard
              meal={item}
              subtitle={subtitle}
              description={meta?.description}
              onPress={() => router.push(`/recipes/${encodeURIComponent(item.idMeal)}`)}
            />
          );
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.headerHint}>
              Tap a recipe for ingredients and step-by-step instructions.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.muted}>No recipes found.</Text>
            {areaLabel ? (
              <Text style={styles.headerHint}>
                TheMealDB may not have desserts listed for this cuisine. Try browsing all desserts instead.
              </Text>
            ) : null}
            {areaLabel ? (
              <Pressable onPress={() => router.push('/recipes')} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Browse all desserts</Text>
              </Pressable>
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.chocolate,
  },
  headerHint: {
    marginTop: 6,
    color: Colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
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
  primaryButton: {
    marginTop: 14,
    backgroundColor: Colors.berry,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});

