import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TimePicker, { TimeType } from 'react-native-wheel-time-picker';
import { useMemo } from 'react';

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

export default function App() {
  const [timeValue, setTimeValue] = useState(Date.now() % MILLISECONDS_PER_DAY);
  const [hour, min] = useMemo(() => {
    return [
      Math.floor(timeValue / MILLISECONDS_PER_HOUR),
      Math.floor((timeValue % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE),
      Math.floor((timeValue % MILLISECONDS_PER_MINUTE) / 1000),
    ];
  }, [timeValue]);
  return (
    <View style={styles.container}>
      <TimePicker
        containerStyle={styles.timePickerContainer}
        wheelProps={{
          wheelHeight: 70,
          itemHeight: 15,
        }}
        value={timeValue}
        timeFormat={[TimeType.hours12, ':', TimeType.min, TimeType.ampm]}
        onChange={(newValue) => setTimeValue(newValue)}
      />
      <Text style={styles.timeValue}>{`${hour < 10 ? '0' : ''}${hour}:${
        min < 10 ? '0' : ''
      }${min}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ededed',
  },
  timePickerContainer: {
    height: 90,
    backgroundColor: 'white',
  },
  timeValue: {
    marginVertical: 20,
  },
});
