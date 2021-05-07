import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React, { useMemo, useRef } from 'react';

const Value = Animated.createAnimatedComponent(Text);

interface WheelProps<T> {
  value: T;
  setValue: (value: T) => void;
  values: T[];
  onScroll?: (scrollState: boolean) => void;
  renderCount?: number;
  containerStyle?: ViewStyle;
  itemHeight?: number;
  itemGap?: number;
  selectedColor?: string;
  disabledColor?: string;
}

export default function Wheel<T>({
  value,
  setValue,
  onScroll,
  values,
  renderCount = 21,
  containerStyle,
  itemHeight = 15,
  itemGap = 10,
  selectedColor = 'black',
  disabledColor = 'gray',
}: WheelProps<T>): React.ReactElement {
  const translateY = useRef(new Animated.Value(0));

  const panResponder = React.useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        translateY.current.setValue(0);
        onScroll && onScroll(true);
      },
      onPanResponderMove: (evt, gestureState) => {
        translateY.current.setValue(gestureState.dy);
        evt.stopPropagation();
      },
      onPanResponderRelease: (_, gestureState) => {
        onScroll && onScroll(false);
        translateY.current.extractOffset();
        const valueIndex = values.indexOf(value);
        const newValueIndex =
          valueIndex - Math.round(gestureState.dy / (itemHeight + itemGap));
        const newValue =
          values[(newValueIndex + values.length) % values.length];
        setValue(newValue);
      },
    });
  }, [itemGap, itemHeight, onScroll, setValue, value, values]);

  const displayValues = useMemo(() => {
    if (values.length < 5) return values;
    let currentIndex = values.indexOf(value);
    if (currentIndex === -1) currentIndex = -1;
    return new Array(renderCount)
      .fill(0)
      .map(
        (_, index) =>
          values[
            (currentIndex +
              index -
              Math.floor(renderCount / 2) +
              values.length) %
              values.length
          ]
      );
  }, [values, value, renderCount]);

  const currentIndex = useMemo(() => {
    translateY.current.setValue(0);
    translateY.current.setOffset(0);
    return displayValues.indexOf(value);
  }, [displayValues, value]);

  const contentHeight = useMemo(() => {
    return renderCount * (itemGap + itemHeight) - itemGap;
  }, [itemGap, itemHeight, renderCount]);

  return (
    <View
      style={[styles.container, containerStyle]}
      {...panResponder.panHandlers}
    >
      <View
        key={displayValues.join(',')}
        style={[styles.contentContainer, { height: contentHeight }]}
      >
        {displayValues.map((displayValue: T, index: number) => (
          <Value
            style={{
              height: itemHeight,
              transform: [
                {
                  translateY: translateY.current,
                },
                {
                  rotateX: translateY.current.interpolate({
                    extrapolate: 'clamp',
                    inputRange: [
                      -50 + (currentIndex - index) * 25,
                      50 + (currentIndex - index) * 25,
                    ],
                    outputRange: ['-90deg', '90deg'],
                  }),
                },
              ],
              color: displayValue === value ? selectedColor : disabledColor,
            }}
            key={`${displayValue}`}
          >
            {displayValue}
          </Value>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    minWidth: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
