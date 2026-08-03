import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { ActivityIndicator, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import ButtonWrapper from '../component/Button';
import { logout } from '../api/authApi';

const CustomDrawer = props => {
  const [loading, setLoading] = React.useState(false);
  const [confirmVisible, setConfirmVisible] = React.useState(false);

  const openLogoutConfirm = () => {
    setConfirmVisible(true);
  };

  const closeLogoutConfirm = () => {
    if (!loading) {
      setConfirmVisible(false);
    }
  };
  const handleLogout = async () => {
    try {
      setConfirmVisible(false);
      setLoading(true);
      await logout();
    } catch (error) {
      console.error('Error occurred while logging out:', error);
    } finally {
      await AsyncStorage.removeMany(['flag', 'password', 'token']);
      setConfirmVisible(false);
      setLoading(false);
      props.navigation.replace('Login');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        <DrawerItem
          label="Logout"
          onPress={openLogoutConfirm}
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonText}
        />
      </DrawerContentScrollView>

      {confirmVisible && (
        <View
          style={[StyleSheet.absoluteFill, { zIndex: 1000, elevation: 10 }]}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Log out?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to log out?
              </Text>

              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="large" color="#DC2626" />
                  <Text style={styles.loadingText}>Logging out...</Text>
                </View>
              ) : (
                <View style={styles.buttonRow}>
                  <View style={styles.buttonSpacing}>
                    <ButtonWrapper
                      title="Log Out"
                      onPress={handleLogout}
                      style={styles.modalButton}
                    />
                  </View>
                  <View style={styles.buttonSpacing}>
                    <ButtonWrapper title="No" onPress={closeLogoutConfirm} />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    spacing: 0.5,
  },
  modalMessage: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSpacing: {
    flex: 1,
    marginHorizontal: 4,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    marginTop: 330,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#DC2626',
    minHeight: 48,
  },
  loadingRow: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 15,
    color: '#DC2626',
    fontWeight: '600',
  },
});
