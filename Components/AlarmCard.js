// Components/AlarmCard.js
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // For the pill icon

// Bu bileşen artık kendi içinde alarm state'i tutmayacak
// ve useNavigation kullanmayacak, çünkü navigasyon sorumluluğu AlarmListScreen'de olabilir.
// Eğer AlarmCard'dan bir navigasyon işlemi (örneğin karta tıklayınca detay sayfasına gitme) olacaksa
// useNavigation burada kullanılabilir veya navigation prop olarak geçirilebilir.
// Şimdilik sadece render etme ve switch'i yönetme odaklı tutuyorum.

export default function AlarmCard({ alarm, toggleSwitch }) {
  // `alarm` prop'undan gelen verileri kullanıyoruz
  const {
    id,
    type,
    time,
    isEnabled,
    iconColor,
    activeTrackColor,
    inactiveTrackColor,
  } = alarm;

  return (
    <View key={id} style={styles.alarmCard}>
      <View style={styles.leftContent}>
        <MaterialCommunityIcons
          name="pill"
          size={30}
          color={iconColor}
          style={styles.pillIcon}
        />
        <View>
          <Text style={styles.alarmType}>Medicine / {type}</Text>
          <Text style={styles.alarmTime}>today at o'clock {time}</Text>
        </View>
      </View>
      <Switch
        trackColor={{
          false: inactiveTrackColor,
          true: activeTrackColor,
        }}
        thumbColor={'#f4f3f4'} // Keeps thumb color consistent
        ios_backgroundColor={inactiveTrackColor} // For iOS
        onValueChange={() => toggleSwitch(id)} // toggleSwitch'i prop olarak alıp kullanıyoruz
        value={isEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  alarmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillIcon: {
    marginRight: 15,
  },
  alarmType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  alarmTime: {
    fontSize: 14,
    color: '#666',
  },
});