import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

const TextInputWraper = ({
  value,
  onChangeText,
  placeholder,
  style,
  error,
  keyboardType,
  icon,
  keytype,
  errorStyle,
  containerStyle,
  ...rest
}) => {
  return (
    <View style={[styles.fieldContainer, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={rest.placeholderTextColor || '#9CA3AF'}
        style={style}
        keyboardType={keyboardType}
        returnKeyType={keytype}
        {...rest}
      />
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color="#000"
          style={{ position: 'absolute', right: 10, top: 12 }}
        />
      )}
      {error ? <Text style={[styles.errorText, errorStyle]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    minHeight: 18,
    marginTop: 4,
    marginBottom: 2,
  },
});

export default TextInputWraper;
