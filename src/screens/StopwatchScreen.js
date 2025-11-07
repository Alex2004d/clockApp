import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { clockAPI } from '../api/clockAPI';

export default function StopwatchScreen() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  const handleStart = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 10);
    }, 10);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps((prevLaps) => [
        { id: prevLaps.length + 1, time: time },
        ...prevLaps,
      ]);
    }
  };

  const formattedTime = clockAPI.formatStopwatchTime(time);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {formattedTime.minutes}:{formattedTime.seconds}
        </Text>
        <Text style={styles.millisecondsText}>.{formattedTime.milliseconds}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isRunning && time === 0 && (
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Ionicons name="play" size={40} color="#fff" />
          </TouchableOpacity>
        )}

        {!isRunning && time > 0 && (
          <>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={32} color="#fff" />
              <Text style={styles.buttonText}>Regresar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Ionicons name="play" size={40} color="#fff" />
              <Text style={styles.buttonText}>Iniciar</Text>
            </TouchableOpacity>
          </>
        )}

        {isRunning && (
          <>
            <TouchableOpacity style={styles.lapButton} onPress={handleLap}>
              <Ionicons name="flag" size={32} color="#fff" />
              <Text style={styles.buttonText}>Vuelta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
              <Ionicons name="pause" size={40} color="#fff" />
              <Text style={styles.buttonText}>Pausar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {laps.length > 0 && (
        <ScrollView style={styles.lapsContainer}>
          <Text style={styles.lapsTitle}>Vueltas</Text>
          {laps.map((lap) => {
            const lapTime = clockAPI.formatStopwatchTime(lap.time);
            return (
              <View key={lap.id} style={styles.lapItem}>
                <Text style={styles.lapNumber}>Vuelta {lap.id}</Text>
                <Text style={styles.lapTime}>
                  {lapTime.minutes}:{lapTime.seconds}.{lapTime.milliseconds}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 60,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 60,
  },
  timerText: {
    fontSize: 72,
    fontWeight: '300',
    color: '#fff',
    letterSpacing: -2,
  },
  millisecondsText: {
    fontSize: 36,
    fontWeight: '300',
    color: '#888',
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#00C851',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#FF4444',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF8800',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lapButton: {
    backgroundColor: '#007AFF',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  lapsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  lapsTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 15,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  lapNumber: {
    color: '#fff',
    fontSize: 16,
  },
  lapTime: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});