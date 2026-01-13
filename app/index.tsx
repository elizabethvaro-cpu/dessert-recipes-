import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { fetchAreas } from '../src/services/api';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import { Colors } from '../src/theme/colors';
import { flagForArea } from '../src/utils/flags';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; areas: string[] };

export default function HomeScreen() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetchAreas();
      if (cancelled) return;
      if (!res.ok) setState({ status: 'error', message: res.error });
      else setState({ status: 'ready', areas: res.data });
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const areas = useMemo(() => (state.status === 'ready' ? state.areas : []), [state]);

  if (state.status === 'loading') return <LoadingSpinner label="Loading cuisines…" />;

  if (state.status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Global Dessert Recipes</Text>
        <Text style={styles.muted}>We couldn’t load cuisines.</Text>
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
      <Stack.Screen options={{ title: 'Desserts' }} />
      <View style={styles.hero}>
        <Text style={styles.title}>Global Dessert Recipes</Text>
        <Text style={styles.subtitle}>
          Discover sweet treats by country — tap a cuisine or browse all desserts.
        </Text>
        <Pressable onPress={() => router.push('/recipes')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Browse all desserts</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Browse by country / cuisine</Text>
        <Text style={styles.sectionHint}>Powered by TheMealDB</Text>
      </View>

      <FlatList
        data={areas}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.areasRow}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/recipes?area=${encodeURIComponent(item)}`)}
            style={({ pressed }) => [styles.areaTile, pressed && styles.areaTilePressed]}
          >
            <Text style={styles.areaName} numberOfLines={1}>
              {item}
            </Text>
            <Text style={styles.areaFlag} accessibilityLabel={`${item} flag`}>
              {flagForArea(item)}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.muted}>No cuisines found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.cream,
  },
  hero: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.chocolate,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.mutedText,
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 14,
    backgroundColor: Colors.berry,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionHint: {
    fontSize: 12,
    color: Colors.mutedText,
  },
  areasRow: {
    paddingBottom: 8,
  },
  areaTile: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaTilePressed: {
    opacity: 0.88,
  },
  areaName: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  areaFlag: {
    marginTop: 8,
    fontSize: 22,
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
  emptyWrap: {
    paddingVertical: 8,
  },
});

