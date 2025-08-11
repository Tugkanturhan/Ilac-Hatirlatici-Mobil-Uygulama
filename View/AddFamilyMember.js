//aile üysei ekleme AddFamilyMember.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';



export default function AddFamilyMemberScreen() {

    const navigate = useNavigation();

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const navigation = useNavigation();

  const handleAddMember = () => {
    // Burada aile üyesi ekleme işlemi yapılabilir
    console.log(`Aile Üyesi Eklendi: ${name}, İlişki: ${relation}`);
    navigation.navigate('MainMenu'); // Ana menüye geri dön
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aile Üyesi Ekle</Text>
      <TextInput
        style={styles.input}
        placeholder="Ad"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="İlişki"
        value={relation}
        onChangeText={setRelation}
      />
      <Button title="Ekle" onPress={handleAddMember} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});