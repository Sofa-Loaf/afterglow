import { Image, StyleSheet, View } from 'react-native';

type Props = {
  size?: 'hero' | 'header';
};

export function Wordmark({ size = 'hero' }: Props) {
  return (
    <View style={[styles.wrap, size === 'header' && styles.headerWrap]} accessibilityRole="image" accessibilityLabel="Afterglow">
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
    marginBottom: 8,
  },
  headerWrap: {
    marginBottom: 0,
  },
  hero: {
    width: '100%',
    height: 92,
  },
  header: {
    width: 168,
    height: 36,
  },
});
