import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { fetchAreas } from '../../src/services/api';
import { Colors } from '../../src/theme/colors';
import { flagForArea } from '../../src/utils/flags';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; areas: string[] };

export default function CountriesScreen() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [query, setQuery] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
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

  const filtered = useMemo(() => {
    if (state.status !== 'ready') return [];
    const q = query.trim().toLowerCase();
    if (!q) return state.areas;
    return state.areas.filter((a) => a.toLowerCase().includes(q));
  }, [state, query]);

  if (state.status === 'loading') return <LoadingSpinner label="Loading cuisines…" />;

  if (state.status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Search Cuisines</Text>
        <Text style={styles.muted}>We couldn’t load cuisines.</Text>
        <Text style={styles.error}>{state.message}</Text>
        <Pressable onPress={() => setReloadKey((v) => v + 1)} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cuisines' }} />

      <Text style={styles.headerTitle}>Search Cuisines</Text>
      <Text style={styles.headerHint}>
        TheMealDB supports a limited set of cuisines/areas. Each one shows all available desserts.
      </Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search cuisines…"
        placeholderTextColor={Colors.mutedText}
        style={styles.search}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/recipes?area=${encodeURIComponent(item)}`)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Text style={styles.flag}>{flagForArea(item)}</Text>
            <Text style={styles.countryName} numberOfLines={1}>
              {item}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.muted}>No matches.</Text>
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
    padding: 16,
  },
  headerTitle: {
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
  search: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.text,
  },
  list: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  rowPressed: {
    opacity: 0.88,
  },
  flag: {
    fontSize: 18,
    width: 28,
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
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
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.chocolate,
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

