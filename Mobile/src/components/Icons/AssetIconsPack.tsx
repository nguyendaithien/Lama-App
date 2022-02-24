import React from 'react';
import { Image, ImageProps } from 'react-native';

const IconProvider = (source: ImageProps) => ({
  toReactElement: ({ animation, ...props }: any) => <Image {...props} source={source} />
});

export const AssetIconsPack = {
  name: 'assets',
  icons: {
    gender: IconProvider(require('@src/assets/images/gender_color.png')),
    email: IconProvider(require('@src/assets/images/email.png')),
    money: IconProvider(require('@src/assets/images/money.png'))
  }
};
