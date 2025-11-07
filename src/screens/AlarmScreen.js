import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { clockAPI } from '../api/clockAPI';

export default function AlarmScreen() {
  const [alarms, setAlarms] = useState(clockAPI.defaultAlarms);
  const [modalVisible, setModalVisible] = useState(false);
  const [soundModalVisible, setSoundModalVisible] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [editTime, setEditTime] = useState('');
  const [editLabel, setEditLabel] = useState('');

  const toggleAlarm = (id) => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const deleteAlarm = (id) => {
    Alert.alert(
      'Eliminar alarma',
      '¿Estás seguro de que quieres eliminar esta alarma?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setAlarms((prevAlarms) =>
              prevAlarms.filter((alarm) => alarm.id !== id)
            );
          },
        },
      ]
    );
  };

  const openEditModal = (alarm) => {
    setSelectedAlarm(alarm);
    setEditTime(alarm.time);
    setEditLabel(alarm.label);
    setModalVisible(true);
  };

  const openSoundModal = (alarm) => {
    setSelectedAlarm(alarm);
    setSoundModalVisible(true);
  };

  const saveAlarm = () => {
    if (selectedAlarm) {
      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.id === selectedAlarm.id
            ? { ...alarm, time: editTime, label: editLabel }
            : alarm
        )
      );
      setModalVisible(false);
    }
  };

  const changeSound = (sound) => {
    if (selectedAlarm) {
      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.id === selectedAlarm.id ? { ...alarm, sound: sound } : alarm
        )
      );
      setSoundModalVisible(false);
    }
  };

  const addNewAlarm = () => {
    const newAlarm = {
      id: Date.now(),
      time: '09:00',
      enabled: false,
      label: 'Nueva alarma',
      sound: 'Campana',
    };
    setAlarms((prevAlarms) => [...prevAlarms, newAlarm]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {alarms.map((alarm) => (
          <View key={alarm.id} style={styles.alarmCard}>
            <View style={styles.alarmHeader}>
              <View style={styles.alarmInfo}>
                <Text style={styles.alarmTime}>{alarm.time}</Text>
                <Text style={styles.alarmLabel}>{alarm.label}</Text>
              </View>
              <Switch
                value={alarm.enabled}
                onValueChange={() => toggleAlarm(alarm.id)}
                trackColor={{ false: '#3C3C3E', true: '#00C851' }}
                thumbColor={alarm.enabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.alarmActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openEditModal(alarm)}
              >
                <Ionicons name="create-outline" size={20} color="#007AFF" />
                <Text style={styles.actionText}>Modificar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => openSoundModal(alarm)}
              >
                <Ionicons name="musical-notes-outline" size={20} color="#007AFF" />
                <Text style={styles.actionText}>{alarm.sound}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => deleteAlarm(alarm.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={addNewAlarm}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Modal de edición */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modificar Alarma</Text>

            <Text style={styles.inputLabel}>Hora</Text>
            <TextInput
              style={styles.input}
              value={editTime}
              onChangeText={setEditTime}
              placeholder="HH:MM"
              placeholderTextColor="#888"
            />

            <Text style={styles.inputLabel}>Etiqueta</Text>
            <TextInput
              style={styles.input}
              value={editLabel}
              onChangeText={setEditLabel}
              placeholder="Nombre de la alarma"
              placeholderTextColor="#888"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonTextModal}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveAlarm}
              >
                <Text style={styles.buttonTextModal}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de cambio de música */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={soundModalVisible}
        onRequestClose={() => setSoundModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Música</Text>

            {clockAPI.alarmSounds.map((sound) => (
              <TouchableOpacity
                key={sound}
                style={styles.soundOption}
                onPress={() => changeSound(sound)}
              >
                <Text style={styles.soundText}>{sound}</Text>
                {selectedAlarm?.sound === sound && (
                  <Ionicons name="checkmark" size={24} color="#00C851" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { marginTop: 20 }]}
              onPress={() => setSoundModalVisible(false)}
            >
              <Text style={styles.buttonTextModal}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  alarmCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 36,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 5,
  },
  alarmLabel: {
    fontSize: 16,
    color: '#888',
  },
  alarmActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    color: '#007AFF',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 25,
    width: '85%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#3C3C3E',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonTextModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  soundOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  soundText: {
    color: '#fff',
    fontSize: 16,
  },
});