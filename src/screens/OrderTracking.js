import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../component/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import CardWrapper from '../component/CardWrapper';
import { theme } from '../theme';

const OrderTracking = ({ navigation }) => {
  const orderStatus = [
    {
      id: 1,
      title: 'Pharmacist reviewing',
      subtitle: 'Sharma medical store is verifying your prescription',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Pharmacist verifying prescription',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Order confirmed',
      status: 'current',
    },
    {
      id: 4,
      title: 'Preparing your order',
      status: 'pending',
    },
    {
      id: 5,
      title: 'Out for delivery',
      status: 'pending',
    },
    {
      id: 6,
      title: 'Delivered',
      status: 'pending',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Order Tracking"
        lefticon={() => navigation.navigate('Orders',{ screen: 'Tabs' })}
        icon="arrow-back"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerInfo}>
          <Text style={styles.orderId}>Order #12345</Text>
          <Text style={styles.mainTitle}>Pharmacist reviewing</Text>
        </View>

        <View style={styles.timelineContainer}>
          {orderStatus.map((item, index) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';
            const isPending = item.status === 'pending';
            const isLast = index === orderStatus.length - 1;

            const lineColor = isCompleted ? '#388E3C' : '#E0E0E0';

            return (
              <View key={item.id} style={styles.stepRow}>
                <View style={styles.leftColumn}>
                  <View
                    style={[
                      styles.circle,
                      isCompleted && styles.completedCircle,
                       isCurrent && styles.currentCircle,
                      isPending && styles.pendingCircle,
                    ]}
                  >
                    {isCompleted && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </View>
                  {!isLast && (
                    <View
                      style={[styles.line, { backgroundColor: lineColor }]}
                    />
                  )}
                </View>

                <View style={styles.rightColumn}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isCompleted || isCurrent
                        ? styles.activeTitle
                        : styles.pendingTitle,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.subtitle ? (
                    <Text style={styles.stepSubtitle}>{item.subtitle}</Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        <View>
          <CardWrapper title="Sharma medical store" des={true} content="123 Main street,Mumbai" titleColor="#afa5a5" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerInfo: {
    marginBottom: 28,
  },
  orderId: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#383838',
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
  },
  leftColumn: {
    width: 28,
    alignItems: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: '#388E3C',
  },
  currentCircle: {
    backgroundColor: '#965C13',
  },
  pendingCircle: {
    backgroundColor: '#E5E7EB',
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 4,
    marginBottom: 4,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 28,
  },
  stepTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  activeTitle: {
    fontWeight: '600',
    color: '#333333',
  },
  pendingTitle: {
    fontWeight: '500',
    color: '#8E8E93',
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
    lineHeight: 18,
  },
});

export default OrderTracking;