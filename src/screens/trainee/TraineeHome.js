import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDumbbell, faUserCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from '@firebase/auth';
import { firebaseApp } from '../../../firebase.js';
import { getDatabase, ref, onValue, get, push, set } from "firebase/database";
import tw from 'tailwind-react-native-classnames';

const TraineeHome = ({ navigation }) => {
  const auth = getAuth();
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = getDatabase(firebaseApp);
        const userRef = ref(db, `users/${auth.currentUser.uid}/name`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUsername(data);
          }
        });
    
        // Fetch sessions with today's date
        const today = new Date().toISOString().split('T')[0]; // Get today's date
const sessionsRef = ref(db, 'sessions');
const snapshot = await get(sessionsRef);
const sessionsData = snapshot.val();
if (sessionsData) {
  const todaySessions = Object.entries(sessionsData).map(([sessionId, session]) => ({ sessionId, ...session })).filter(session => session.sessionDate === today);
  setSessions(todaySessions);
}

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Landing');
    } catch (error) {
      console.error('Signout Error:', error.message);
      Alert.alert('Signout Failed', error.message);
    }
  };
  
  const markSessionComplete = async (sessionId) => {
    try {
      if (!sessionId) {
        throw new Error('SessionId is undefined');
      }
      const db = getDatabase(firebaseApp);
      const completedSessionsRef = ref(db, 'completedSessions');
      const newCompletedSessionRef = push(completedSessionsRef);
      const currentDate = new Date().toISOString();
      const sessionData = {
        sessionId: sessionId,
        userId: auth.currentUser.uid,
        dateTime: currentDate
      };
      await set(newCompletedSessionRef, sessionData);
      Alert.alert('Session Marked as Complete');
    } catch (error) {
      console.error('Error marking session as complete:', error);
      Alert.alert('Error', 'Failed to mark session as complete.');
    }
  };
  
  

  return (
    <View style={[tw`flex-1 items-center justify-center bg-green-800 mt-9 p-4`]}>
      <FontAwesomeIcon icon={faDumbbell} style={tw`mb-4`} size={60} />
      <Text style={tw`text-white text-lg mb-2`}>Welcome, {username}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={tw`absolute top-4 right-4`}>
        <FontAwesomeIcon icon={faUserCircle} style={tw``} size={40} />
      </TouchableOpacity>
      <Text style={tw`text-white text-lg mb-2`}>Today's Workout Session</Text>
      <Text style={tw`text-white text-sm mb-4`}>Date: {new Date().toLocaleDateString()}</Text>
      <View style={tw`flex-1 w-full`}>

      
      <ScrollView contentContainerStyle={tw`items-center flex-grow w-full`}>
  {sessions.map((session, index) => (
    <View key={index} style={tw`bg-white rounded-lg p-4 mb-4 w-full max-w-md`}>
      <Text style={tw`hidden`}>{session.sessionId}</Text> 
      <Text style={tw`text-lg font-semibold mb-2`}>{session.sessionName}</Text>
      {session.exercises.map((exercise, idx) => (
        <View key={idx} style={tw`mb-2 w-full`}>
          <Text style={tw`text-base font-semibold mb-1`}>{exercise.name}</Text>
          <Text style={tw`text-sm mb-1`}>Sets: {exercise.sets}, Reps: {exercise.reps}</Text>
          <Text style={tw`text-sm mb-2`}>{exercise.description}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={() => markSessionComplete(session.sessionId)} style={tw`bg-blue-500 px-4 py-2 rounded-md mt-2`}>
        <Text style={tw`text-white font-semibold text-center`}>Mark as Complete</Text>
      </TouchableOpacity>
    </View>
  ))}
</ScrollView>

      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={tw`flex-1 justify-center items-center bg-gray-900 bg-opacity-70`}>
          <View style={tw`bg-white rounded-lg p-4 w-80`}>
            <TouchableOpacity onPress={() => navigation.navigate('MyMembership')} style={tw`py-2 border-b border-gray-200`}>
              <Text style={tw`text-lg font-semibold text-center`}>My Membership</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ViewSessions')} style={tw`py-2 border-b border-gray-200`}>
              <Text style={tw`text-lg font-semibold text-center`}>View Sessions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ChooseTrainer')} style={tw`py-2 border-b border-gray-200`}>
              <Text style={tw`text-lg font-semibold text-center`}>Assign Trainer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={tw`py-2`}>
              <Text style={tw`text-lg font-semibold text-center text-red-500`}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
  
  
  
};

export default TraineeHome;
