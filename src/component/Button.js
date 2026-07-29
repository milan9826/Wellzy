import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ButtonWrapper = ({ title, onPress, style, textStyle, icon,disable,iconstyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={0.8}
      disabled={disable}
    >
      {title ? (
        <Text style={textStyle || styles.buttonText} numberOfLines={1}>
          {title}
        </Text>
      ) : null}
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color="#FFFFFF"
          style={[{ marginLeft: 8 }, iconstyle]}
        />
      )}
    </TouchableOpacity>
  );
};

export default ButtonWrapper;

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    numberOfLines: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
