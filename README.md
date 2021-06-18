# react-native-wheel-time-picker

Simple and pure js time picker for react-native. It provides the same UI for Android and IOS. You can use the Wheel component independantly.

|                                                            Android                                                             |                                                              IOS                                                               |
| :----------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
| ![Jun-18-2021 14-16-57](https://user-images.githubusercontent.com/17980230/122510071-e6491b80-d03f-11eb-8c47-ac670fa4555e.gif) | ![Jun-18-2021 14-16-45](https://user-images.githubusercontent.com/17980230/122510087-ee08c000-d03f-11eb-8f46-a25817109316.gif) |

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
| wheelHeight    |           | number    | 70        | Wheel height            |
| displayCount   |           | number    | 5         | Number of items to show in front of the wheel.   |
| containerStyle |           | ViewStyle | undefined | Wheel container style   |
| itemHeight     |           | number    | 15        | Wheel item height       |
| selectedColor  |           | string    | 'black'   | Selected item color     |
| disabledColor  |           | string    | 'gray'    | Other items color       |
| textStyle      |           | TextStyle | undefined | Text style of each item |

### Other Wheel Props
Below props are provided by the TimePicker component.

|             | necessary | types                          | default   | info                                                                                                               |
| ----------- | :-------: | ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------ |
| value       |     v     | string                         |           | item value                                                                                                         |
| setValue    |     v     | (newValue: string) => void     |           | Changing value function                                                                                            |
| values      |     v     | string[]                       |           | List of values to choose from                                                                                      |
| onScroll    |           | (scrollState: boolean) => void | undefined | a callback function. it may be used when the TimePicker is inside of a scroll view to preventing the outer scroll. |

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
        wheelProps={{
          wheelHeight: 70,
          itemHeight: 15,
        }}
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

## Animated sine function
The sin function of the AnimatedMath.ts file is really inspired by 'react-native-animated-math' package. We tried to import the package and use it, but there was a performance issue, so we created a new function that omitted some terms. The function uses the Taylor series approximation as below.
```
 x - x^3 / 3! + x^5 / 5! - x^7 / 7!
``` 
The x value range is [-PI , PI] so it's maximum error will be 
```
PI^9 / 9! = 0.08214 .....
```
If the x range is [-PI/2, PI/2] than the maximum error will be about 0.00016 ....



## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
