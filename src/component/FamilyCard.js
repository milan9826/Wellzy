import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ButtonWrapper from './Button';

const FamilyCard = ({ name = '', due, items, des, subdes, basket, color }) => {
  if (basket) {
    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.leftGroup}>
            <View style={[styles.avatar, { backgroundColor: color }]}>
              <Text style={styles.avatarText}>{name[0]?.toUpperCase()}</Text>
            </View>
            <View style={styles.nameBlock}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.items}>{items}</Text>
            </View>
          </View>
          <Text style={styles.due}>{due}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.des}>{des}</Text>
        <Text style={styles.subdes}>{subdes}</Text>

        <ButtonWrapper
          title="Reorder now"
          onPress={() => {}}
          style={styles.reorderBtn}
          textStyle={styles.reorderText}
        />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.reminderDue}>{due}</Text>
      <ButtonWrapper
        title="Reorder now"
        onPress={() => {}}
        style={styles.reorderBtn}
        textStyle={styles.reorderText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  /* ── Basket card ── */
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#1b1515',
    fontSize: 18,
    fontWeight: '700',
  },
  nameBlock: {
    flexShrink: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  items: {
    fontSize: 12,
    color: '#888888',
  },
  due: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 0,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  des: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
    lineHeight: 20,
  },
  subdes: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 16,
    lineHeight: 18,
  },
  reorderBtn: {
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  reorderText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  reminderDue: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 14,
  },
});

export default FamilyCard;
