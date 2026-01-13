import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { RecipeCard } from '../../src/components/RecipeCard';
import { Colors } from '../../src/theme/colors';
import {
  fetchDessertSummariesAll,
  fetchDessertSummariesForArea,
  fetchDessertSummariesForCountry,
} from '../../src/services/recipes';
import type { RecipeSummary } from '../../src/types/recipes';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; recipes: RecipeSummary[] };

export default function RecipeListScreen() {
  const router = useRouter();
  const { country, area } = useLocalSearchParams<{ country?: string; area?: string }>();
  const countryLabel = typeof country === 'string' && country.trim() ? country : undefined;
  // Back-compat: "area" is treated as a country-like label (e.g. "Mexican", "Japanese").
  const areaLabel = typeof area === 'string' && area.trim() ? area : undefined;
  const scopeLabel = countryLabel ?? areaLabel ?? undefined;

  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    (async () => {
      const res = countryLabel
        ? await fetchDessertSummariesForCountry(countryLabel)
        : areaLabel
          ? await fetchDessertSummariesForArea(areaLabel)
          : await fetchDessertSummariesAll();
      if (cancelled) return;
      if (!res.ok) setState({ status: 'error', message: res.error });
      else setState({ status: 'ready', recipes: res.data });
    })();
    return () => {
      cancelled = true;
    };
  }, [scopeLabel, reloadKey]);

  const title = useMemo(() => (scopeLabel ? `${scopeLabel} desserts` : 'All desserts'), [scopeLabel]);

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
        data={state.recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const subtitle = scopeLabel
            ? scopeLabel
            : item.country
              ? item.country
              : item.cuisine
                ? item.cuisine
                : 'Global';
          return (
            <RecipeCard
              title={item.title}
              imageUrl={item.imageUrl}
              subtitle={subtitle}
              description={item.description}
              onPress={() => router.push(`/recipes/${encodeURIComponent(item.id)}`)}
            />
          );
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.headerHint}>
              Tap a recipe for ingredients and step-by-step instructions.
            </Text>
            {scopeLabel ? (
              <Text style={styles.headerHint}>
                Showing desserts from multiple sources when available.
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.muted}>No recipes found.</Text>
            {scopeLabel ? (
              <Text style={styles.headerHint}>
                Some sources have limited coverage for this country/cuisine. Try browsing all desserts instead.
              </Text>
            ) : null}
            {scopeLabel ? (
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

