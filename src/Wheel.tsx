import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, { useMemo, useRef } from 'react';

const Value = Animated.createAnimatedComponent(Text);
const DISPLAY_COUNT = 5;

export interface WheelStyleProps {
  containerStyle?: ViewStyle;
  itemHeight?: number;
  itemGap?: number;
  selectedColor?: string;
  disabledColor?: string;
  textStyle?: TextStyle;
}

export interface WheelProps<T> extends WheelStyleProps {
  value: T;
  setValue: (value: T) => void;
  values: T[];
  onScroll?: (scrollState: boolean) => void;
  renderCount?: number;
}

export default function Wheel<T>({
  value,
  setValue,
  onScroll,
  values,
  containerStyle,
  textStyle,
  renderCount: renderCountProp = 21,
  itemHeight = 15,
  itemGap = 10,
  selectedColor = 'black',
  disabledColor = 'gray',
}: WheelProps<T>): React.ReactElement {
  const translateY = useRef(new Animated.Value(0));
  const renderCount = Math.max(
    DISPLAY_COUNT,
    Math.min(values.length - (1 - (values.length % 2)), renderCountProp)
  );
  const circular = values.length >= DISPLAY_COUNT;

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
        let newValueIndex =
          valueIndex - Math.round(gestureState.dy / (itemHeight + itemGap));
        if (circular)
          newValueIndex = (newValueIndex + values.length) % values.length;
        else {
          if (newValueIndex < 0) newValueIndex = 0;
          else if (newValueIndex >= values.length)
            newValueIndex = values.length - 1;
        }
        const newValue = values[newValueIndex];
        if (newValue === value) {
          translateY.current.setOffset(0);

          translateY.current.setValue(0);
        } else setValue(newValue);
      },
    });
  }, [circular, itemGap, itemHeight, onScroll, setValue, value, values]);

  const displayValues = useMemo(() => {
    let valueIndex = values.indexOf(value);
    if (valueIndex === -1) valueIndex = -1;
    const centerIndex = Math.floor(renderCount / 2);

    return new Array(renderCount).fill(undefined).map((_, index) => {
      let targetIndex = valueIndex + index - centerIndex;
      if (targetIndex < 0 || targetIndex >= values.length) {
        if (!circular) {
          return null;
        }
        targetIndex = (targetIndex + values.length) % values.length;
      }
      return values[targetIndex];
    });
  }, [values, value, renderCount, circular]);

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
        {displayValues.map((displayValue: T | null, index: number) => (
          <Value
            style={[
              textStyle,
              {
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
              },
            ]}
            key={`${displayValue ?? 'null' + index}`}
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
