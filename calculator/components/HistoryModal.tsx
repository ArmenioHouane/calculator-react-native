import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { X } from 'lucide-react-native';

interface HistoryModalProps {
  isVisible: boolean;
  onClose: () => void;
  history: string[];
  onHistoryItemPress: (item: string) => void;
}

export default function HistoryModal({
  isVisible,
  onClose,
  history,
  onHistoryItemPress,
}: HistoryModalProps) {
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X style={styles.closeIcon} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>History</Text>
          <ScrollView style={styles.historyContainer}>
            {history.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => onHistoryItemPress(item)}
              >
                <Text style={styles.historyText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const lightStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeIcon: {
    width: 24,
    height: 24,
    color: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  historyContainer: {
    width: '100%',
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  historyText: {
    fontSize: 16,
    color: '#333',
  },
});

const darkStyles = StyleSheet.create({
  ...lightStyles,
  modalView: {
    ...lightStyles.modalView,
    backgroundColor: '#333',
  },
  closeIcon: {
    ...lightStyles.closeIcon,
    color: '#fff',
  },
  modalTitle: {
    ...lightStyles.modalTitle,
    color: '#fff',
  },
  historyItem: {
    ...lightStyles.historyItem,
    borderBottomColor: '#4a4a4a',
  },
  historyText: {
    ...lightStyles.historyText,
    color: '#fff',
  },
});

