import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
// @ts-ignore
import AnimatedMath from 'react-native-animated-math';

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
  itemGap = 5,
  selectedColor = 'black',
  disabledColor = 'gray',
}: WheelProps<T>): React.ReactElement {
  const translateY = useRef(new Animated.Value(0));
  const renderCount = Math.max(DISPLAY_COUNT, renderCountProp);
  const circular = values.length >= DISPLAY_COUNT;
  const [height, setHeight] = useState(
    typeof containerStyle?.height == 'number' ? containerStyle.height : 100
  );

  const valueIndex = useMemo(() => values.indexOf(value), [values, value]);

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
  }, [
    circular,
    itemGap,
    itemHeight,
    onScroll,
    setValue,
    value,
    valueIndex,
    values,
  ]);

  const displayValues = useMemo(() => {
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
  }, [renderCount, valueIndex, values, circular]);

  const animatedAngles = useMemo(() => {
    translateY.current.setValue(0);
    translateY.current.setOffset(0);
    const currentIndex = displayValues.indexOf(value);
    return displayValues.map((_, index) =>
      translateY.current
        .interpolate({
          inputRange: [-height / 2, height / 2],
          outputRange: [
            -height / 2 + (itemHeight + itemGap) * (index - currentIndex),
            height / 2 + (itemHeight + itemGap) * (index - currentIndex),
          ],
          extrapolate: 'extend',
        })
        .interpolate({
          inputRange: [-height / 2, height / 2],
          outputRange: [-Math.PI / 2, Math.PI / 2],
          // extrapolate: 'clamp'
        })
    );
  }, [displayValues, height, itemGap, itemHeight, value]);

  return (
    <View
      style={[styles.container, containerStyle]}
      onLayout={(evt) => setHeight(evt.nativeEvent.layout.height)}
      {...panResponder.panHandlers}
    >
      {displayValues.map((displayValue: T | null, index: number) => {
        const animatedAngle = animatedAngles[index];
        return (
          <Value
            style={[
              textStyle,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                position: 'absolute',
                height: itemHeight,
                transform: [
                  {
                    translateY: Animated.multiply(
                      height / 2,
                      AnimatedMath.sin(animatedAngle)
                    ),
                  },
                  {
                    rotateX: animatedAngle.interpolate({
                      inputRange: [-Math.PI / 2, Math.PI / 2],
                      outputRange: ['-90deg', '90deg'],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
                color: displayValue === value ? selectedColor : disabledColor,
              },
            ]}
            key={`${index > displayValues.length / 2 ? 'Post' : 'Before'}${
              displayValue ?? 'null' + index
            }`}
          >
            {displayValue}
          </Value>
        );
      })}
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
