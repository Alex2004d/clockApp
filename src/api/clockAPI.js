// API para manejar las funcionalidades del reloj

export const clockAPI = {
  // Obtener la hora actual
  getCurrentTime: () => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      date: now.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  },

  // Formatear tiempo para el cronómetro
  formatStopwatchTime: (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(ms).padStart(2, '0'),
    };
  },

  // Formatear tiempo para el temporizador
  formatTimerTime: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
    };
  },

  // Alarmas predefinidas
  defaultAlarms: [
    { id: 1, time: '07:00', enabled: false, label: 'Despertar', sound: 'Campana' },
    { id: 2, time: '12:00', enabled: false, label: 'Almuerzo', sound: 'Suave' },
    { id: 3, time: '18:00', enabled: false, label: 'Salida', sound: 'Clásico' },
  ],

  // Sonidos disponibles para alarmas
  alarmSounds: [
    'Campana',
    'Suave',
    'Clásico',
    'Digital',
    'Melodía',
  ],

  // Temporizadores predefinidos
  defaultTimers: [
    { id: 1, name: '5 minutos', seconds: 300 },
    { id: 2, name: '10 minutos', seconds: 600 },
    { id: 3, name: '15 minutos', seconds: 900 },
    { id: 4, name: '30 minutos', seconds: 1800 },
    { id: 5, name: '1 hora', seconds: 3600 },
  ],

  // Verificar si una alarma debe sonar
  checkAlarm: (alarmTime, currentTime) => {
    const [alarmHour, alarmMinute] = alarmTime.split(':').map(Number);
    return (
      currentTime.hours === alarmHour &&
      currentTime.minutes === alarmMinute &&
      currentTime.seconds === 0
    );
  },
};