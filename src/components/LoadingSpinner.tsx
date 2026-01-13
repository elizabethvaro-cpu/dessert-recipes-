import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

export function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" aria-label={label}>
      <ActivityIndicator size="large" color={Colors.berry} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    marginTop: 10,
    color: Colors.mutedText,
    fontSize: 14,
  },
});

