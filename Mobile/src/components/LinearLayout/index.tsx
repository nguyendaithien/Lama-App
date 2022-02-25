import React, { ReactElement } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@ui-kitten/components';

type Props = {
  style?: Object;
  children: ReactElement;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  colors?: string[];
};

export const LinearLayout = ({
  children,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  colors
}: Props): ReactElement => {
  const theme = useTheme();
  return (
    <LinearGradient
      style={style}
      start={start}
      end={end}
      colors={colors ? colors : [theme['color-linear-primary'], theme['color-linear-secondary']]}
    >
      {children}
    </LinearGradient>
  );
};
