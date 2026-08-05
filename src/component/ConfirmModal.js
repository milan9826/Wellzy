import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';


 const ConfirmModal = ({ visible, onClose, onConfirm, message, btn1Title, btn2Title }) => {
    const hasSingleButton = Boolean(btn1Title) !== Boolean(btn2Title);

  return (
    <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                        <Ionicons name="close" size={22} color="#111827" />
                                </TouchableOpacity>
                <Text style={styles.modalMessage}>{message}</Text>
                                <View
                                    style={[
                                        styles.modalButtons,
                                        hasSingleButton && styles.modalButtonsSingle,
                                    ]}
                                >
                    {btn1Title && (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.cancelButton,
                                                        hasSingleButton && styles.singleButton,
                                                    ]}
                                                    onPress={onClose}
                                                >
                            <Text style={styles.cancelButtonText}>{btn1Title}</Text>
                        </TouchableOpacity>
                    )}
                    {btn2Title && 
                                        (<TouchableOpacity
                                                style={[
                                                    styles.confirmButton,
                                                    hasSingleButton && styles.singleButton,
                                                ]}
                                                onPress={onConfirm}
                                            >
                        <Text style={styles.confirmButtonText}>{btn2Title}</Text>
                    </TouchableOpacity>)}
                </View>
            </View>
        </View>
    </Modal>
  );
}
export default ConfirmModal;


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    },
    modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    paddingTop: 28,
    position: 'relative',
    },
    closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 4,
    },
    modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    },
    modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    },
    modalButtonsSingle: {
    justifyContent: 'center',
    },
    cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    },
    singleButton: {
    flex: 0,
    minWidth: '55%',
    },
    cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    },
    confirmButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    },
    confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    },
}); 


