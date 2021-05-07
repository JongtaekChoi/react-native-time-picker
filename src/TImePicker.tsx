import React, { useCallback, useState } from 'react';
/* eslint-disable radix */
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Wheel, { WheelStyleProps } from './Wheel';

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60;
const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 200,
    height: 100,
    borderWidth: 1,
    borderColor: 'gray',
    overflow: 'hidden',
  },
});

const TWENTY_FOUR_LIST = new Array(24)
  .fill(0)
  .map((_, index) => (index < 10 ? `0${index}` : `${index}`));
const SIXTY_LIST = new Array(60)
  .fill(0)
  .map((_, index) => (index < 10 ? `0${index}` : `${index}`));

interface Props {
  label?: string;
  value?: number | null; // milliseconds of date
  onChange: (value: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  onScroll?: (scrollState: boolean) => void;
  textStyle?: TextStyle;
  wheelProps?: WheelStyleProps;
}

export default function TimePicker({
  label,
  value,
  onChange,
  onScroll,
  containerStyle,
  textStyle,
  wheelProps = {},
}: Props): React.ReactElement {
  const [current, setCurrent] = useState(
    (value ?? Date.now()) % MILLISECONDS_PER_DAY
  );
  const [hour, setHour] = useState(Math.floor(current / MILLISECONDS_PER_HOUR));
  const [minute, setMinute] = useState(
    Math.floor(current / MILLISECONDS_PER_MINUTE) % 60
  );
  const [second, setSecond] = useState(Math.floor(current / 1000) % 60);

  const changeTimeValue = useCallback(
    (type: 'hour' | 'minute' | 'second', newValue: number) => {
      let newHour = hour;
      let newMinute = minute;
      let newSecond = second;
      switch (type) {
        case 'hour':
          setHour(newValue);
          newHour = newValue;
          break;
        case 'minute':
          setMinute(newValue);
          newMinute = newValue;
          break;
        case 'second':
          setSecond(newValue);
          newSecond = newValue;
          break;
      }
      const newCurrent =
        newHour * MILLISECONDS_PER_HOUR +
        newMinute * MILLISECONDS_PER_MINUTE +
        newSecond * 1000;
      setCurrent(newCurrent);
      onChange && onChange(newCurrent);
    },
    [hour, minute, onChange, second]
  );
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={textStyle}>{label}</Text>}
      <Wheel
        value={hour < 10 ? `0${hour}` : `${hour}`}
        values={TWENTY_FOUR_LIST}
        setValue={(newValue) => changeTimeValue('hour', parseInt(newValue))}
        onScroll={onScroll}
        textStyle={textStyle}
        {...wheelProps}
      />
      <Text style={textStyle}>:</Text>
      <Wheel
        value={minute < 10 ? `0${minute}` : `${minute}`}
        values={SIXTY_LIST}
        setValue={(newValue) => changeTimeValue('minute', parseInt(newValue))}
        onScroll={onScroll}
        textStyle={textStyle}
        {...wheelProps}
      />
      <Text style={textStyle}>:</Text>
      <Wheel
        value={second < 10 ? `0${second}` : `${second}`}
        values={SIXTY_LIST}
        setValue={(newValue) => changeTimeValue('second', parseInt(newValue))}
        onScroll={onScroll}
        textStyle={textStyle}
        {...wheelProps}
      />
    </View>
  );
}
