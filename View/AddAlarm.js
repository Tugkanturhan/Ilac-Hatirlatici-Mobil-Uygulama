// AddAlarm.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Platform,
  FlatList,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const weekDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const repeatTypes = ['Tekrar Yok', 'Günlük', 'Haftalık', 'Aylık'];

const medicineDatabase = [
  { id: '1', name: 'Parol 500 mg Tablet' },
  { id: '2', name: 'Aferin Fort Tablet' },
  { id: '3', name: 'Augmentin 1 g Tablet' },
  { id: '4', name: 'Ventolin 100 mcg Inhaler' },
  { id: '5', name: 'Arveles 25 mg Tablet' },
  { id: '6', name: 'Majezik 200 mg Tablet' },
  { id: '7', name: 'Dolorex 550 mg Tablet' },
  { id: '8', name: 'Metpamid 10 mg Tablet' },
  { id: '9', name: 'Cipro 500 mg Tablet' },
  { id: '10', name: 'Dideral 40 mg Tablet' },
  { id: '11', name: 'Aritmal 200 mg Tablet' },
  { id: '12', name: 'Zinadol 600 mg Tablet' },
];

export default function AddAlarmScreen({ navigation }) {
  // Kullanıcı ID state
  const [kullaniciId, setKullaniciId] = useState(null);

  // İlaç arama ve seçim state'leri
  const [searchQuery, setSearchQuery] = useState('');
  const [medicineType, setMedicineType] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredMeds, setFilteredMeds] = useState(medicineDatabase.slice(0, 10));

  // Diğer state'ler
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeatType, setRepeatType] = useState('Tekrar Yok');
  const [selectedDays, setSelectedDays] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(true);

  // Kullanıcı ID'yi AsyncStorage'dan çek
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id !== null) {
          setKullaniciId(id);
        } else {
          console.warn('Kullanıcı ID bulunamadı! Giriş yapınız.');
          // İstersen burda login sayfasına yönlendirme yapabilirsin
        }
      } catch (error) {
        console.error('Kullanıcı ID alınamadı:', error);
      }
    };
    getUserId();
  }, []);

  // İlaç arama filtreleme
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMeds(medicineDatabase.slice(0, 10));
    } else {
      const filtered = medicineDatabase.filter(med =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMeds(filtered);
    }
  }, [searchQuery]);

  const handleSelectMedicine = (medicine) => {
    setMedicineType(medicine.name);
    setShowDropdown(false);
    setSearchQuery(medicine.name);
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) setTime(selectedTime);
  };

  const onDateChange = (event, selected) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) setSelectedDate(selected);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Alarmı kaydet
  const saveAlarm = async () => {
    if (!kullaniciId) {
      alert('Kullanıcı bilgisi alınamadı, lütfen giriş yapınız.');
      return;
    }

    const alarmData = {
      kullanici_id: parseInt(kullaniciId),
      ilac_adi: medicineType,
      doz: "1 tablet",  // Opsiyonel, dilersen input yapabilirsin
      tekrar_tipi: repeatType,
      pazartesi: selectedDays.includes('Pzt'),
      sali: selectedDays.includes('Sal'),
      carsamba: selectedDays.includes('Çar'),
      persembe: selectedDays.includes('Per'),
      cuma: selectedDays.includes('Cum'),
      cumartesi: selectedDays.includes('Cmt'),
      pazar: selectedDays.includes('Paz'),
      gun: repeatType === 'Aylık' ? selectedDate.getDate() : null,
      baslangic_tarihi: selectedDate.toISOString().split('T')[0],
      saat: time.toTimeString().split(' ')[0],
      aktif_mi: isEnabled,
    };

    try {
      const response = await fetch('http://192.168.108.108:3000/api/alarmEkle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alarmData),
      });

      const json = await response.json();
      if (json.success) {
        alert('Alarm kaydedildi!');
        navigation.goBack();
      } else {
        alert('Kaydetme hatası: ' + json.message);
      }
    } catch (e) {
      alert('Sunucu bağlantı hatası!');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yeni Alarm Ekle</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* İlaç Seçimi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İlaç Seçimi</Text>

          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setShowDropdown(true)}
          >
            <Text style={medicineType ? styles.dropdownText : styles.dropdownPlaceholder}>
              {medicineType || 'İlaç seçiniz...'}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#777" />
          </TouchableOpacity>

          {/* Dropdown Modal */}
          <Modal
            visible={showDropdown}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDropdown(false)}
          >
            <View style={styles.dropdownModal}>
              <View style={styles.dropdownContainer}>
                {/* Arama Çubuğu */}
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="İlaç ara..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true}
                  />
                  <TouchableOpacity onPress={() => setShowDropdown(false)}>
                    <Ionicons name="close" size={24} color="#777" />
                  </TouchableOpacity>
                </View>

                {/* İlaç Listesi */}
                <FlatList
                  data={filteredMeds}
                  keyExtractor={(item) => item.id}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.medicineItem}
                      onPress={() => handleSelectMedicine(item)}
                    >
                      <Text style={styles.medicineText}>{item.name}</Text>
                      {medicineType === item.name && (
                        <Ionicons name="checkmark" size={20} color="#4CAF50" />
                      )}
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </View>
            </View>
          </Modal>
        </View>

        {/* Saat Seçimi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alarm Saati</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.timePicker}
          >
            <Ionicons name="time" size={24} color="#4CAF50" />
            <Text style={styles.timeText}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              mode="time"
              is24Hour={true}
              display="spinner"
              value={time}
              onChange={onTimeChange}
              style={styles.dateTimePicker}
            />
          )}
        </View>

        {/* Tekrar Seçimi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tekrar</Text>
          <View style={styles.buttonGroup}>
            {repeatTypes.map((rType) => (
              <TouchableOpacity
                key={rType}
                style={[
                  styles.pillButton,
                  repeatType === rType && styles.pillButtonActive,
                ]}
                onPress={() => setRepeatType(rType)}
              >
                <Text
                  style={[
                    styles.pillButtonText,
                    repeatType === rType && styles.pillButtonTextActive,
                  ]}
                >
                  {rType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Haftalık Tekrar İçin Gün Seçimi */}
        {repeatType === 'Haftalık' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tekrar Günleri</Text>
            <View style={styles.dayContainer}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonActive,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) && styles.dayButtonTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Tek Seferlik veya Aylık Tekrar İçin Tarih Seçimi */}
        {(repeatType === 'Tekrar Yok' || repeatType === 'Aylık') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {repeatType === 'Tekrar Yok' ? 'Alarm Tarihi' : 'Başlangıç Tarihi'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.timePicker}
            >
              <Ionicons name="calendar" size={24} color="#4CAF50" />
              <Text style={styles.timeText}>
                {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={selectedDate}
                onChange={onDateChange}
                style={styles.dateTimePicker}
              />
            )}
          </View>
        )}

        {/* Alarm Aktif/Pasif Switch */}
        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Ionicons name="notifications" size={20} color="#4CAF50" />
              <Text style={styles.switchText}>Alarm Aktif</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#81c784' }}
              thumbColor={isEnabled ? '#4CAF50' : '#f4f3f4'}
              value={isEnabled}
              onValueChange={setIsEnabled}
            />
          </View>
        </View>
      </ScrollView>

      {/* Kaydet Butonu */}
      <TouchableOpacity style={styles.saveButton} onPress={saveAlarm}>
        <Text style={styles.saveButtonText}>Alarmı Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#4CAF50',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  dropdownModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: '70%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  medicineText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  timeText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  pillButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  pillButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  pillButtonText: {
    color: '#555',
    fontSize: 14,
  },
  pillButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  dayButtonActive: {
    backgroundColor: '#4CAF50',
  },
  dayButtonText: {
    color: '#555',
    fontWeight: '500',
  },
  dayButtonTextActive: {
    color: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  dateTimePicker: {
    backgroundColor: 'white',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
