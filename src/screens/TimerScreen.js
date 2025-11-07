import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { clockAPI } from '../api/clockAPI';

export default function TimerScreen() {
  const [customTimers, setCustomTimers] = useState(clockAPI.defaultTimers);
  const [activeTimer, setActiveTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTimerName, setNewTimerName] = useState('');
  const [newTimerMinutes, setNewTimerMinutes] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (remainingTime === 0 && isRunning) {
      handleTimerComplete();
    }
  }, [remainingTime, isRunning]);

  const startTimer = (timer) => {
    setActiveTimer(timer);
    setRemainingTime(timer.seconds);
    setIsRunning(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveTimer(null);
    setRemainingTime(0);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    Alert.alert('¡Tiempo completado!', `El temporizador "${activeTimer?.name}" ha terminado.`, [
      { text: 'OK', onPress: resetTimer },
    ]);
  };

  const deleteTimer = (id) => {
    Alert.alert(
      'Eliminar temporizador',
      '¿Estás seguro de que quieres eliminar este temporizador?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setCustomTimers((prev) => prev.filter((timer) => timer.id !== id));
          },
        },
      ]
    );
  };

  const addCustomTimer = () => {
    if (newTimerName && newTimerMinutes) {
      const minutes = parseInt(newTimerMinutes);
      if (minutes > 0) {
        const newTimer = {
          id: Date.now(),
          name: newTimerName,
          seconds: minutes * 60,
        };
        setCustomTimers((prev) => [...prev, newTimer]);
        setModalVisible(false);
        setNewTimerName('');
        setNewTimerMinutes('');
      } else {
        Alert.alert('Error', 'Ingresa un tiempo válido en minutos');
      }
    } else {
      Alert.alert('Error', 'Completa todos los campos');
    }
  };

  const formattedTime = clockAPI.formatTimerTime(remainingTime);

  return (
    <View style={styles.container}>
      {activeTimer ? (
        <>
          <View style={styles.activeTimerContainer}>
            <Text style={styles.timerName}>{activeTimer.name}</Text>
            <Text style={styles.timerDisplay}>
              {formattedTime.hours}:{formattedTime.minutes}:{formattedTime.seconds}
            </Text>

            <View style={styles.activeButtonContainer}>
              <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                <Ionicons name="arrow-back" size={28} color="#fff" />
                <Text style={styles.buttonLabel}>Regresar</Text>
              </TouchableOpacity>

              {isRunning ? (
                <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
                  <Ionicons name="pause" size={40} color="#fff" />
                  <Text style={styles.buttonLabel}>Pausar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => startTimer(activeTimer)}
                >
                  <Ionicons name="play" size={40} color="#fff" />
                  <Text style={styles.buttonLabel}>Iniciar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Temporizadores</Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.timersGrid}>
              {customTimers.map((timer) => (
                <View key={timer.id} style={styles.timerCard}>
                  <TouchableOpacity
                    style={styles.timerCardContent}
                    onPress={() => startTimer(timer)}
                  >
                    <Ionicons name="timer-outline" size={32} color="#007AFF" />
                    <Text style={styles.timerCardName}>{timer.name}</Text>
                    <Text style={styles.timerCardTime}>
                      {Math.floor(timer.seconds / 60)} min
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.timerCardActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => Alert.alert('Editar', 'Función de edición')}
                    >
                      <Ionicons name="create-outline" size={20} color="#007AFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteTimer(timer.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addTimerCard}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="add-circle-outline" size={48} color="#007AFF" />
                <Text style={styles.addTimerText}>Nuevo</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      )}

      {/* Modal para agregar temporizador */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Temporizador</Text>

            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={newTimerName}
              onChangeText={setNewTimerName}
              placeholder="Ej: Ejercicio, Cocinar, etc."
              placeholderTextColor="#888"
            />

            <Text style={styles.inputLabel}>Tiempo (minutos)</Text>
            <TextInput
              style={styles.input}
              value={newTimerMinutes}
              onChangeText={setNewTimerMinutes}
              placeholder="Ej: 10, 30, 60"
              placeholderTextColor="#888"
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewTimerName('');
                  setNewTimerMinutes('');
                }}
              >
                <Text style={styles.buttonTextModal}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addCustomTimer}
              >
                <Text style={styles.buttonTextModal}>Agregar</Text>
              </TouchableOpacity>
            </View>
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
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    padding: 20,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  timersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-around',
  },
  timerCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    width: '45%',
    marginBottom: 15,
    overflow: 'hidden',
  },
  timerCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  timerCardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  timerCardTime: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  timerCardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  editButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#2C2C2E',
  },
  deleteButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  addTimerCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    width: '45%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    marginBottom: 15,
  },
  addTimerText: {
    color: '#007AFF',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  activeTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  timerName: {
    fontSize: 24,
    color: '#888',
    marginBottom: 30,
  },
  timerDisplay: {
    fontSize: 64,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 60,
  },
  activeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  startButton: {
    backgroundColor: '#00C851',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#FF4444',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF8800',
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
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
});