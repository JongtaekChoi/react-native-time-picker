# react-native-wheel-time-picker

Simple and pure js time picker for react-native. It provides the same UI for Android and IOS. You can use the Wheel component independantly.

|                                                            Android                                                             |                                                              IOS                                                               |
| :----------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
| ![Jun-17-2021 12-57-47](https://user-images.githubusercontent.com/17980230/122329052-b16b9480-cf6b-11eb-867a-13cccf114b91.gif) | ![Jun-17-2021 12-59-10](https://user-images.githubusercontent.com/17980230/122329138-d4964400-cf6b-11eb-80b6-2a20838b4502.gif)
 |

## Installation

```sh
npm install react-native-wheel-time-picker
```

## Props

### TimePicker Props

|                | necessary | types                          | default   | info                                                                                                               |
| -------------- | :-------: | ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------ |
| label          |           | string                         | undefined |                                                                                                                    |
| value          |           | number                         | undefined | millisecond value after 0 0                                                                                        |
| onChange       |           | (newValue: number) => void     | undefined | changing value function                                                                                            |
| containerStyle |           | ViewStyle                      | undefined | container style                                                                                                    |
| onScroll       |           | (scrollState: boolean) => void | undefined | a callback function. it may be used when the TimePicker is inside of a scroll view to preventing the outer scroll. |
| textStyle      |           | TextStyle                      | undefined | text style                                                                                                         |
| use24HourSystem|           | boolean                        | undefined | show the time in 24-hour system format                   |
| showSeconds    |           | boolean                        | undefined | show seconds value                |
| wheelProps     |           | StyleProps type of Wheel       | undefined | see next                                                                                                           |

### Wheel StyleProps

|                | necessary | types     | default   | info                    |
| -------------- | :-------: | --------- | --------- | ----------------------- |
| containerStyle |           | ViewStyle | undefined | Wheel container style   |
| itemHeight     |           | number    | 15        | Wheel item height       |
| itemGap        |           | number    | 10        | Gap between items       |
| selectedColor  |           | string    | 'black'   | Selected item color     |
| disabledColor  |           | string    | 'gray'    | Other items color       |
| textStyle      |           | TextStyle | undefined | Text style of each item |

### Other Wheel Props

|             | necessary | types                          | default   | info                                                                                                               |
| ----------- | :-------: | ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------ |
| value       |     v     | string                         |           | item value                                                                                                         |
| setValue    |     v     | (newValue: string) => void     |           | Changing value function                                                                                            |
| values      |     v     | string[]                       |           | List of values to choose from                                                                                      |
| onScroll    |           | (scrollState: boolean) => void | undefined | a callback function. it may be used when the TimePicker is inside of a scroll view to preventing the outer scroll. |
| renderCount |           | number                         |           | Number of item to render                                                                                           |

## Usage

```ts
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import TimePicker from 'react-native-wheel-time-picker';
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
        value={timeValue}
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
  },
  timeValue: {
    marginVertical: 20,
  },
});
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
