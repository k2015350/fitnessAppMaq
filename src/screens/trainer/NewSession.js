import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getAuth } from '@firebase/auth';
import { getDatabase, ref, push } from '@firebase/database';

const NewSession = () => {
  const [sessionName, setSessionName] = useState('');
  const [exercise1Name, setExercise1Name] = useState('');
  const [exercise1Reps, setExercise1Reps] = useState('');
  const [exercise1Sets, setExercise1Sets] = useState('');
  const [exercise1Description, setExercise1Description] = useState('');
  const [exercise2Name, setExercise2Name] = useState('');
  const [exercise2Reps, setExercise2Reps] = useState('');
  const [exercise2Sets, setExercise2Sets] = useState('');
  const [exercise2Description, setExercise2Description] = useState('');
  const [sessionDate, setSessionDate] = useState('');

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser.uid;
      const database = getDatabase();
      const sessionRef = ref(database, 'sessions');
      const newSession = {
        userId,
        sessionName,
        sessionDate,
        exercises: [
          { name: exercise1Name, reps: exercise1Reps, sets: exercise1Sets, description: exercise1Description },
          { name: exercise2Name, reps: exercise2Reps, sets: exercise2Sets, description: exercise2Description }
        ]
      };
      await push(sessionRef, newSession);
      Alert.alert('Success', 'Session saved successfully.', [
        { text: 'OK', onPress: handleReset }
      ]);
    } catch (error) {
      console.error('Save Error:', error.message);
      Alert.alert('Error', 'Failed to save session. Please try again later.');
    }
  };

  const handleReset = () => {
    setSessionName('');
    setExercise1Name('');
    setExercise1Reps('');
    setExercise1Sets('');
    setExercise1Description('');
    setExercise2Name('');
    setExercise2Reps('');
    setExercise2Sets('');
    setExercise2Description('');
    setSessionDate('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#4CAF50' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop:60, justifyContent: 'center', padding: 20 }}>
        <TextInput
          placeholder="Session Name"
          value={sessionName}
          onChangeText={setSessionName}
          style={{ backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 5 }}
        />
        <TextInput
          placeholder="Session Date (YYYY-MM-DD)"
          value={sessionDate}
          onChangeText={setSessionDate}
          style={{ backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 5 }}
        />
        <TextInput
          placeholder="Exercise Name 1"
          value={exercise1Name}
          onChangeText={setExercise1Name}
          style={{ backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 5 }}
        />
         <TextInput
          placeholder="Reps"
          value={exercise1Reps}
          onChangeText={setExercise1Reps}
          style={{ backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 5 }}
        />
        <TextInput
          placeholder="Sets"
          value={exercise1Sets}
          onChangeText={setExercise1Sets}
          style={{ backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 5 }}
        />
        <TextInput
          placeholder="Description"
          value={exercise1Description}
          onChangeText={setExercise1Description}
          style={{ backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 5 }}
        />
        <TextInput
          placeholder="Exercise Name 2"
          value={exercise2Name}
          onChangeText={setExercise2Name}
          style={{ backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 5 }}
        />
        <TextInput
          placeholder="Reps"
          value={exercise2Reps}
          onChangeText={setExercise2Reps}
          style={{ backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 5 }}
        />
        <TextInput
          placeholder="Sets"
          value={exercise2Sets}
          onChangeText={setExercise2Sets}
          style={{ backgroundColor: 'white', marginBottom: 10, padding: 10, borderRadius: 5 }}
        />
        <TextInput
          placeholder="Description"
          value={exercise2Description}
          onChangeText={setExercise2Description}
          style={{ backgroundColor: 'white', marginBottom: 20, padding: 10, borderRadius: 5 }}
        />
        <TouchableOpacity onPress={handleSave} style={{ backgroundColor: 'blue', padding: 15, borderRadius: 10, marginBottom: 10 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReset} style={{ backgroundColor: 'red', padding: 15, borderRadius: 10 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Reset</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default NewSession;