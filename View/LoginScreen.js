// LoginScreen.js
import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, Text, Alert } from 'react-native'; // Alert'i ekledim
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage'ı import et!

export default function LoginScreen() {
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [Sifre, setSifre] = useState('');
  const navigation = useNavigation();

  const GirisYapButonaTiklandi = async () => {
    console.log('Giriş Yap butonuna tıklandı');

    try {
        const cevap = await fetch('http://192.168.108.108:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({         
            kullanici_adi: kullaniciAdi, 
            sifre: Sifre,
          }),
        });

        const data = await cevap.json(); // API'den gelen yanıtı parse ediyoruz

        if (cevap.ok) {
          console.log('Giriş başarılı:', data);
          if (data.success && data.user_id) {
            await AsyncStorage.setItem('userId', data.user_id.toString());
            console.log("Giris Yapanın ID si: ", data.user_id);
            Alert.alert('Başarılı', data.message);
            navigation.navigate('MainMenu'); // Ana ekrana yönlendirme
          } else {
            Alert.alert('Hata', data.message || 'Giriş başarısız. Kullanıcı ID alınamadı.');
          }
        } else {
          console.error('Giriş başarısız:', data);
          Alert.alert('Giriş başarısız', data.message || 'Lütfen kullanıcı adı ve şifrenizi kontrol edin.');
        }
      } catch (error) {
        console.error('Giriş işlemi sırasında hata oluştu:', error);
        Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin veya internet bağlantınızı kontrol edin.');
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textinputpalce}>
        <TextInput
          placeholder="Kullanıcı Adı"
          style={styles.input}
          value={kullaniciAdi}
          onChangeText={setKullaniciAdi}
        />
        <TextInput
          placeholder="Şifre"
          secureTextEntry
          style={styles.input}
          value={Sifre}
          onChangeText={setSifre}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={GirisYapButonaTiklandi}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SingUp')}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textinputpalce: {
    width: '100%',
    paddingHorizontal: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'green',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
