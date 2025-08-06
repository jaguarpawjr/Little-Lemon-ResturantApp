import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';


function OnboardingHeader({ message }) {
  return (
    <View style={styles.header}>
      <Image source={require('../assets/little lemon.jpeg')} style={styles.logo} />
      <Text style={styles.headerText}>{message}</Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (firstName.trim() === '' || lastName.trim() === '') {
      setError('Please fill in both first and last name');
      return;
    }

    try {
      const user = { firstName, lastName };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Home');
    } catch (error) {
      setError('An error occurred while saving your information');
    }
  };

  return  (
      <ScrollView contentContainerStyle={{ justifyContent: 'center',
        alignItems: 'center',}}>
        <OnboardingHeader message="Welcome to Little Lemon" />
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    );
    
  
}
const styles=StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
      header: {
        alignItems: 'center',
        marginBottom: 20,
      },
      logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
      },
      error: {
        color: 'red',
        marginBottom: 10,
      },
})