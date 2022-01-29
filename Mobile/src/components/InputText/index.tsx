import React, { ReactElement } from 'react';
import { Input, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { ImageProps, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { RenderProp } from '@ui-kitten/components/devsupport';
import { KeyboardTypeOptions } from 'react-native';

type Props = {
  style?: Object;
  placeholder?: string;
  accessoryRight?: RenderProp<Partial<ImageProps>>;
  accessoryLeft?: RenderProp<Partial<ImageProps>>;
  value?: string | number;
  secureTextEntry?: boolean;
  disabled?: boolean;
  status?: string;
  size?: string;
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (text: string) => void;
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
};

const InputText = ({
  style,
  placeholder,
  accessoryRight,
  accessoryLeft,
  value,
  label,
  secureTextEntry,
  disabled,
  status = 'basic',
  size = 'large',
  keyboardType = 'ascii-capable',
  onChangeText,
  onBlur
}: Props): ReactElement => {
  const styles = useStyleSheet(themedStyles);
  return (
    <>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <Input
        style={style || styles.input}
        placeholder={placeholder}
        accessoryRight={accessoryRight}
        accessoryLeft={accessoryLeft}
        value={value?.toString()}
        secureTextEntry={secureTextEntry}
        disabled={disabled}
        onChangeText={onChangeText}
        onBlur={onBlur}
        status={status}
        size={size}
        keyboardType={keyboardType}
      />
    </>
  );
};

const themedStyles = StyleService.create({
  label: {
    marginBottom: 5,
    marginTop: 15,
    marginLeft: 10
  },
  input: {
    borderRadius: 3
  }
});

export default InputText;
