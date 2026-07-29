import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ButtonWrapper from './Button';

const CardWrapper = ({
  title,
  content,
  button,
  btntitle,
  onPress,
  btnstyle,
  des,
  backgroundColor,
  borderColor,
  btnColor,
  stutus,
  cardStyle,
}) => {
  return button ? (
    <View
      style={[
        styles.cardWrapper,
        {
          backgroundColor: backgroundColor || '#FFFFFF',
          borderColor: borderColor || '#E5E7EB',
        },
        cardStyle,
      ]}
    >
      <Text style={styles.cardTitle} numberOfLines={2}>
        {title}
      </Text>
      {des && (
        <View style={styles.cardContent}>
          <Text>{content}</Text>
        </View>
      )}
      <ButtonWrapper
        title={btntitle}
        style={[styles.cardButton, btnstyle, { backgroundColor: btnColor }]}
        onPress={onPress}
      />
      {stutus && (
        <Text
          style={{
            marginTop: 18,
            fontSize: 12,
            backgroundColor: '#d6d0d0',
            color: '#585452',
          }}
        >
          Coming soon
        </Text>
      )}
    </View>
  ) : (
    <View
      style={[
        styles.cardWrapper,
        {
          backgroundColor: backgroundColor || '#FFFFFF',
          borderColor: borderColor || '#E5E7EB',
        },
        cardStyle,
      ]}
    >
      {stutus ? (
        <Text style={styles.cardTitle} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <Text style={styles.cardTitle} numberOfLines={2}>
          {title}
        </Text>
      )}
      {des && (
        <View style={styles.cardContent}>
          <Text>{content}</Text>
        </View>
      )}
      {stutus && (
        <View
          style={{
            backgroundColor: '#e2e1e1',
            width: '60%',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}
        >
          <Text
            style={{
              marginTop: 8,
              fontSize: 12,
              marginBottom: 8,
              color: '#585452',
            }}
          >
            Coming soon
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 12,
  },
  cardButton: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default CardWrapper;
