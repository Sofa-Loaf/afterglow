import { Image, StyleSheet, View } from 'react-native';

/** Locked brand wordmark. Soft amber glow is in the PNG — do not re-glow or swap it. */
type Props = {
  size?: 'hero' | 'header';
};

export function Wordmark({ size = 'hero' }: Props) {
  return (
    <View
      style={[styles.wrap, size === 'header' && styles.headerWrap]}
      accessibilityRole="image"
      accessibilityLabel="Afterglow"
    >
      <Image
        source={require('../../assets/brand/afterglow-wordmark.png')}
        style={size === 'header' ? styles.header : styles.hero}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: 2,
  },
  headerWrap: {
    marginBottom: 0,
  },
  hero: {
    width: '100%',
    height: 120,
  },
  header: {
    width: 188,
    height: 40,
  },
});
