import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Screen from '../components/screen';
import { ComponentId, showcasedComponents } from '../showcase';
import { colors, monospace, radius, twoColumnBreakpoint } from '../theme';

//
const styles = StyleSheet.create({
  grid: {
    gap: 16,
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  tileWide: {
    flexBasis: 0,
    flexGrow: 1,
    minWidth: 320,
  },
  tilePressed: {
    borderColor: colors.accent,
  },
  tileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  chevron: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: '600',
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  packageName: {
    color: colors.accent,
    fontFamily: monospace,
    fontSize: 12,
    marginTop: 12,
  },
});

/**
 * Lists every showcased component; each tile opens that component's screen.
 *
 * @param {{ onOpen: (id: ComponentId) => void }} props
 * @returns {JSX.Element}
 */
export const HomeScreen = ({ onOpen }: { onOpen: (id: ComponentId) => void }) => {
  const { width } = useWindowDimensions();
  const wide = width >= twoColumnBreakpoint;

  return (
    <Screen
      eyebrow="React Native User Interface"
      intro="Modal pickers for React Native, built on Reanimated and Gesture Handler. Choose a component to try it out."
      testID="home-screen"
      title="Components"
    >
      <View style={[styles.grid, wide && styles.gridWide]}>
        {showcasedComponents.map((component) => (
          <Pressable
            accessibilityRole="button"
            key={component.id}
            onPress={() => onOpen(component.id)}
            style={({ pressed }) => [styles.tile, wide && styles.tileWide, pressed && styles.tilePressed]}
            testID={`open-${component.id}`}
          >
            <View style={styles.tileHeader}>
              <Text style={styles.title}>{component.title}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
            <Text style={styles.description}>{component.description}</Text>
            <Text style={styles.packageName}>{component.packageName}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
};

export default HomeScreen;
