// AlarmListScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import AlarmCard from '../Components/AlarmCard';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Expo Bildirimleri ve Ses için importlar
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

// Expo Bildirimlerini yapılandırma (genellikle App.js'de yapılır, ama burada da çalışır)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Deprecated, but still works for now.
    shouldShowBanner: true, // Recommended replacement for `shouldShowAlert`
    shouldShowList: true,   // Recommended replacement for `shouldShowAlert`
    shouldPlaySound: true, // Bildirim geldiğinde ses çal
    shouldSetBadge: false, // Uygulama ikonunda bildirim sayısı gösterme
  }),
});

export default function AlarmList({ navigation, route }) {
    const [userId, setUserId] = useState(route?.params?.userId || null);
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ses nesnesini tutmak için useRef kullanıyoruz
    const soundObject = useRef(new Audio.Sound());

    // Bildirim izinlerini isteme ve bildirim dinleyicisi kurma
    useEffect(() => {
        const registerForPushNotificationsAsync = async () => {
            // Android için bildirim kanalı oluşturma (Android Oreo ve sonrası)
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('medicine-alarms', {
                    name: 'İlaç Hatırlatıcı Alarmları',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                    // Android'de özel ses için, ses dosyasını assets/sounds/alarm_sound.mp3 gibi bir yere koyun
                    // ve app.json'da "android": { "sounds": ["./assets/sounds/alarm_sound.mp3"] } şeklinde belirtin
                    // veya doğrudan require ile yükleyin.
                    sound: 'alarm_sound.mp3', // Bu, app.json'da tanımlı bir ses olmalı veya varsayılan ses
                });
            }

            // Bildirim izinlerini kontrol et ve iste
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert.alert('Bildirim İzni Gerekli', 'İlaç hatırlatıcı bildirimlerini alabilmek için bildirim izni vermeniz gerekmektedir.');
                return false;
            }
            return true;
        };

        registerForPushNotificationsAsync();

        // Bildirim geldiğinde tetiklenecek dinleyici
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log("Gelen Bildirim (Expo):", notification);
            // Bildirim geldiğinde sesi çal
            playAlarmSound();
        });

        // Kullanıcı bildirime dokunduğunda tetiklenecek dinleyici
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Bildirim Yanıtı (Expo):", response);
            // Kullanıcı bildirime dokunduğunda sesi durdur
            stopAlarmSound();
            // Belirli bir aksiyon varsa burada işleyebilirsiniz
            if (response.actionIdentifier === 'durdur-alarm') { // Eğer özel bir aksiyon butonu eklerseniz
                console.log("Kullanıcı 'Durdur' aksiyonuna bastı.");
            }
        });

        // Bileşen unmount olduğunda dinleyicileri temizle ve sesi durdur
        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
            stopAlarmSound();
        };
    }, []); // Sadece bileşen mount edildiğinde bir kez çalışır

    // Alarm sesini çalma fonksiyonu
    const playAlarmSound = async () => {
        try {
            // Ses dosyasının yolu. Varsayılan olarak assets klasörü içindeki yolu kullanın.
            // Örneğin: require('../../assets/sounds/alarm_sound.mp3')
            // Eğer doğrudan projenizin kök dizinindeki assets klasöründeyse: require('./assets/alarm_sound.mp3')
            // Benim varsayımım: projenizin kök dizininde bir 'assets' klasörü var ve içinde 'alarm_sound.mp3' var.
            // Eğer AlarmListScreen.js src/screens içindeyse ve assets projenin kökündeyse, ../../assets/alarm_sound.mp3 doğru olabilir.
            // Eğer AlarmListScreen.js src/screens içindeyse ve assets src içindeyse, ../assets/alarm_sound.mp3 doğru olabilir.
            // Lütfen aşağıdaki yolu kendi projenizin yapısına göre kontrol edin ve düzeltin.
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/funny-alarm-317531.mp3'), // <-- BU YOLU KONTROL EDİN VE DÜZELTİN
                { shouldPlay: true, isLooping: true }
            );
            soundObject.current = sound; // Ses nesnesini useRef'e kaydet
            console.log('Alarm sesi çalmaya başladı.');
        } catch (error) {
            console.error('Alarm sesi çalınırken hata oluştu:', error);
            Alert.alert('Ses Hatası', `Alarm sesi çalınırken bir sorun oluştu: ${error.message}. Lütfen ses dosyasının yolunu kontrol edin.`);
        }
    };

    // Alarm sesini durdurma fonksiyonu
    const stopAlarmSound = async () => {
        try {
            if (soundObject.current && soundObject.current._loaded) {
                await soundObject.current.stopAsync();
                await soundObject.current.unloadAsync(); // Sesi bellekten kaldır
                console.log('Alarm sesi durduruldu ve bellekten kaldırıldı.');
            }
        } catch (error) {
            console.error('Alarm sesi durdurulurken hata oluştu:', error);
        }
    };

    // 1. useEffect: userId'yi yükle (önceki kodunuzdan)
    useEffect(() => {
        const loadUserId = async () => {
            if (userId === null) {
                try {
                    const id = await AsyncStorage.getItem('userId');
                    if (id) {
                        setUserId(parseInt(id));
                        console.log("AsyncStorage'dan yüklenen userId:", parseInt(id));
                    } else {
                        setError('Kullanıcı ID\'si bulunamadı. Lütfen giriş yapın.');
                        setLoading(false);
                    }
                } catch (err) {
                    console.error('Kullanıcı ID\'si yüklenirken hata:', err);
                    setError('Kullanıcı ID\'si yüklenirken hata oluştu.');
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadUserId();
    }, []);

    // 2. useEffect: userId değiştiğinde veya yüklendiğinde alarmları çek ve planla
    useEffect(() => {
        if (userId !== null && !isNaN(userId)) {
            console.log("Frontend'den API'ye gönderilecek userId:", userId);
            const fetchAndScheduleAlarms = async () => {
                setLoading(true);
                setError(null);
                try {
                    const requestUrl = `http://192.168.108.108:3000/api/alarmlariListele?user_id=${userId}`;
                    console.log("Oluşturulan API URL'si:", requestUrl);

                    const response = await fetch(requestUrl);

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
                    }

                    const data = await response.json();

                    const formattedAlarms = data.map(alarm => ({
                        id: alarm.alarm_id.toString(),
                        type: alarm.ilac_adi,
                        time: alarm.saat.substring(0, 5),
                        isEnabled: alarm.aktif_mi,
                        iconColor: '#6BD06D',
                        doz: alarm.doz,
                        tekrar_tipi: alarm.tekrar_tipi,
                        baslangic_tarihi: alarm.baslangic_tarihi,
                        gun: alarm.gun,
                        pazartesi: alarm.pazartesi,
                        sali: alarm.sali,
                        carsamba: alarm.carsamba,
                        persembe: alarm.persembe,
                        cuma: alarm.cuma,
                        cumartesi: alarm.cumartesi,
                        pazar: alarm.pazar,
                    }));

                    setAlarms(formattedAlarms);

                    // --- ALARM BİLDİRİMLERİNİ PLANLAMA (EXPO) ---
                    await Notifications.cancelAllScheduledNotificationsAsync();
                    console.log("Mevcut tüm Expo bildirimleri iptal edildi.");

                    formattedAlarms.forEach(alarm => {
                        if (alarm.isEnabled) {
                            const [hours, minutes] = alarm.time.split(':').map(Number);
                            const now = new Date();
                            
                            let alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

                            if (alarmDate.getTime() < now.getTime()) {
                                alarmDate.setDate(alarmDate.getDate() + 1);
                            }

                            let trigger = null;
                            // ilac_adi boşsa "İlaç" olarak fallback yap
                            let messageBody = `${alarm.type || 'İlaç'} ilacınızı alma zamanı! Doz: ${alarm.doz || 'Belirtilmemiş'}`;

                            switch (alarm.tekrar_tipi) {
                                case 'Günlük':
                                    trigger = {
                                        hour: hours,
                                        minute: minutes,
                                        repeats: true,
                                    };
                                    break;
                                case 'Haftalık':
                                    const daysOfWeek = [];
                                    if (alarm.pazartesi) daysOfWeek.push(1);
                                    if (alarm.sali) daysOfWeek.push(2);
                                    if (alarm.carsamba) daysOfWeek.push(3);
                                    if (alarm.persembe) daysOfWeek.push(4);
                                    if (alarm.cuma) daysOfWeek.push(5);
                                    if (alarm.cumartesi) daysOfWeek.push(6);
                                    if (alarm.pazar) daysOfWeek.push(7); // Expo için Pazar = 7

                                    if (daysOfWeek.length > 0) {
                                        daysOfWeek.forEach(day => {
                                            Notifications.scheduleNotificationAsync({
                                                content: {
                                                    title: "İlaç Hatırlatıcı",
                                                    body: messageBody,
                                                    sound: 'alarm_sound.mp3', // assets klasöründeki ses dosyası
                                                    data: { alarmId: alarm.id, alarmType: alarm.type },
                                                },
                                                trigger: {
                                                    weekday: day, // Expo'da haftanın günü (1-7)
                                                    hour: hours,
                                                    minute: minutes,
                                                    repeats: true,
                                                },
                                                identifier: `${alarm.id}-${day}`, // Haftalık için benzersiz ID
                                            });
                                            console.log(`Alarm planlandı (Haftalık): ID ${alarm.id}, Gün: ${day}, Saat: ${hours}:${minutes}`);
                                        });
                                        return;
                                    } else {
                                        console.log(`Alarm ${alarm.id} (Haftalık) için gün seçilmemiş, planlanmadı.`);
                                        return;
                                    }
                                case 'Tek Seferlik':
                                case 'Tekrar Yok': // "Tekrar Yok" durumunu da burada ele al
                                    const [year, month, day] = alarm.baslangic_tarihi.split('-').map(Number);
                                    alarmDate = new Date(year, month - 1, day, hours, minutes, 0);
                                    if (alarmDate.getTime() < now.getTime()) {
                                        console.log(`Alarm ${alarm.id} (${alarm.tekrar_tipi}) tarihi geçmiş, planlanmadı.`);
                                        return;
                                    }
                                    trigger = alarmDate;
                                    break;
                                default:
                                    console.warn(`Bilinmeyen tekrar tipi: ${alarm.tekrar_tipi} için alarm planlanmadı.`);
                                    return;
                            }

                            if (trigger) {
                                Notifications.scheduleNotificationAsync({
                                    content: {
                                        title: "İlaç Hatırlatıcı",
                                        body: messageBody,
                                        sound: 'alarm_sound.mp3', // assets klasöründeki ses dosyası
                                        data: { alarmId: alarm.id, alarmType: alarm.type },
                                    },
                                    trigger,
                                    identifier: alarm.id, // Benzersiz ID
                                });
                                console.log(`Alarm planlandı: ID ${alarm.id}, Saat: ${alarmDate.toLocaleString()}, Tekrar: ${alarm.tekrar_tipi}`);
                            }
                        }
                    });

                } catch (err) {
                    console.error("Alarm verileri çekilirken hata:", err);
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchAndScheduleAlarms();
        } else if (userId === null && !loading) {
            setError('Kullanıcı ID\'si mevcut değil. Lütfen giriş yapın.');
        }
    }, [userId]);

    const toggleSwitch = (id) => {
        setAlarms(prevAlarms => {
            const updatedAlarms = prevAlarms.map(alarm =>
                alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm
            );
            // TODO: Alarm durumunu backend'e de güncellemek için API çağrısı yapılmalı
            // Bu API çağrısı başarılı olursa, alarmları yeniden planlamak için fetchAndScheduleAlarms'ı çağırabilirsiniz.
            return updatedAlarms;
        });
    };

    const handleAddAlarm = () => {
        navigation.navigate('AlarmAddScreen', { userId });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Yükleniyor...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>Hata: {error}</Text>
                <TouchableOpacity onPress={fetchAndScheduleAlarms}>
                    <Text style={styles.retryText}>Tekrar Dene</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.retryText}>Giriş Yap</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <View style={styles.topbarLogo}>
                    <Ionicons name="medical" size={28} color="white" />
                </View>
                <Text style={styles.topbarTitle}>Medicine Reminder</Text>
                <TouchableOpacity style={styles.topbarSettings}>
                    <Ionicons name="settings" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {alarms.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Henüz alarm ayarlanmadı</Text>
                    <Text style={styles.emptySubText}>Alarm eklemek için + düğmesine dokunun</Text>
                </View>
            ) : (
                <FlatList
                    data={alarms}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AlarmCard alarm={item} toggleSwitch={toggleSwitch} />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomBarButton}>
                    <Ionicons name="home" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={handleAddAlarm}>
                    <Ionicons name="add" size={40} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarButton}>
                    <Ionicons name="document-text" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topbar: {
        height: 80,
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 30,
        elevation: 4,
    },
    topbarLogo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#388E3C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topbarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    topbarSettings: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
    },
    bottomBar: {
        height: 80,
        flexDirection: 'row',
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    bottomBarButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#388E3C',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 5,
    },
});
