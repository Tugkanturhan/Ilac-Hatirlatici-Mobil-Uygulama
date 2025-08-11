//singUpScreen.js
import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {  
  const navigation = useNavigation();

  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [Ad, setAd] = useState('');
  const [Soyad, setSoyad] = useState('');
  const [Email, setEmail] = useState('');
  const [Sifre, setSifre] = useState('');

  const KaydolButonaTiklandi = async () => {
    console.log('Kaydol butonuna tıklandı');  

    try {
      const cevap = await fetch('http://192.168.108.108:3000/api/signup', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kullanici_adi: kullaniciAdi,
          ad: Ad,
          soyad: Soyad,
          email: Email,
          sifre: Sifre,
        }),
      });

      const data = await cevap.json();

      if (cevap.ok) {
        console.log('Kayıt başarılı:', data);
        Alert.alert('Başarılı', data.message);
        navigation.navigate('Login'); // Login ekranına yönlendir
      } else {
        console.error('Kayıt başarısız:', data);
        Alert.alert('Hata', data.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      }

    } catch (error) {
      console.error('Kayıt işlemi sırasında hata oluştu:', error);
      Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textinputpalce}>
        <TextInput placeholder="Kullanıcı Adı" style={styles.input} value={kullaniciAdi} onChangeText={setKullaniciAdi} />
        <TextInput placeholder="Ad" style={styles.input} value={Ad} onChangeText={setAd} />
        <TextInput placeholder="Soyad" style={styles.input} value={Soyad} onChangeText={setSoyad} />
        <TextInput placeholder="E-posta" style={styles.input} value={Email} onChangeText={setEmail} />
        <TextInput placeholder="Şifre" secureTextEntry style={styles.input} value={Sifre} onChangeText={setSifre} />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={KaydolButonaTiklandi}>
          <Text style={styles.buttonText}>Kaydol</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Zaten Hesabın Var mı?</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

// styles
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
    height: 45, // Butonların yüksekliğini eşitlemek için
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  button: {
    flex: 1,
    backgroundColor: 'green',
    paddingVertical: 12, // Buton yüksekliğini TextInput'larla uyumlu yapmak için
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
