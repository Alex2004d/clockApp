import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { clockAPI } from '../api/clockAPI';

export default function ClockScreen() {
  const [currentTime, setCurrentTime] = useState(clockAPI.getCurrentTime());
  const [is24Hour, setIs24Hour] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(clockAPI.getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    let hours = currentTime.hours;
    let period = '';

    if (!is24Hour) {
      period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
    }

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(currentTime.minutes).padStart(2, '0'),
      seconds: String(currentTime.seconds).padStart(2, '0'),
      period,
    };
  };

  const time = formatTime();

  const handleSettings = () => {
    Alert.alert(
      'Configuración',
      'Opciones de configuración',
      [
        {
          text: is24Hour ? 'Formato 12 horas' : 'Formato 24 horas',
          onPress: () => setIs24Hour(!is24Hour),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
        <Ionicons name="settings-outline" size={28} color="#007AFF" />
      </TouchableOpacity>

      <View style={styles.clockContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {time.hours}:{time.minutes}
          </Text>
          <Text style={styles.secondsText}>:{time.seconds}</Text>
        </View>
        {!is24Hour && <Text style={styles.periodText}>{time.period}</Text>}
      </View>

      <Text style={styles.dateText}>{currentTime.date}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <Ionicons name="sunny-outline" size={24} color="#FFA500" />
          <Text style={styles.infoLabel}>Amanecer</Text>
          <Text style={styles.infoValue}>06:45</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="moon-outline" size={24} color="#4169E1" />
          <Text style={styles.infoLabel}>Atardecer</Text>
          <Text style={styles.infoValue}>18:30</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeText: {
    fontSize: 80,
    fontWeight: '200',
    color: '#fff',
    letterSpacing: -2,
  },
  secondsText: {
    fontSize: 40,
    fontWeight: '300',
    color: '#888',
    marginLeft: 5,
  },
  periodText: {
    fontSize: 32,
    color: '#888',
    marginTop: 10,
  },
  dateText: {
    fontSize: 18,
    color: '#888',
    textTransform: 'capitalize',
    marginBottom: 40,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 40,
  },
  infoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '45%',
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
  infoValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 5,
  },
});