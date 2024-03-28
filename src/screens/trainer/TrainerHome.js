import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDumbbell, faUserCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from '@firebase/auth';
import { firebaseApp } from '../../../firebase.js';
import { getDatabase, ref, onValue } from "firebase/database";
import tw from 'tailwind-react-native-classnames';

const TrainerHome = ({ navigation }) => {
  const auth = getAuth();
  const [username, setUsername] = useState('');

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
      Alert.alert('Sign Out', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Sign-out Error:', error.message);
      Alert.alert('Sign Out Error', 'Failed to sign out. Please try again later.');
    }
  };

  return (
    <View style={[tw`flex-1 items-center justify-center bg-green-800 p-4`]}>
      <View style={tw`items-center`}>
        <FontAwesomeIcon icon={faDumbbell} style={tw`mb-2`} size={30} />
        <Text style={tw`text-white text-xl mb-4`}>{username}</Text>
        <FontAwesomeIcon icon={faUserCircle} style={tw`mb-8`}  size={100} />
      </View>
      <View style={tw`mb-8`}>
        <TouchableOpacity style={[tw`bg-blue-500 px-4 py-3 rounded-lg mb-4`]} onPress={() => navigation.navigate('AddNewSessions')}>
          <Text style={tw`text-white text-lg font-semibold text-center`}>Add New Sessions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[tw`bg-blue-500 px-4 py-3 rounded-lg`]} onPress={() => navigation.navigate('ViewMyClients')}>
          <Text style={tw`text-white text-lg font-semibold text-center`}>View My Clients</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={tw`absolute top-4 right-4 bg-blue-500 p-2 rounded-full`} onPress={() => navigation.navigate('TrainerProfile')}>
        <FontAwesomeIcon icon={faUser} style={tw`text-white`} size={24} />
      </TouchableOpacity>
      <TouchableOpacity style={tw`absolute bottom-4 bg-red-500 px-4 py-3 rounded-lg`} onPress={handleSignOut}>
        <Text style={tw`text-white text-lg font-semibold text-center`}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrainerHome;
