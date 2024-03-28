import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from '@firebase/app';
import { getDatabase,ref, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getAuth, signInWithEmailAndPassword, getReactNativePersistence} from '@firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyCWG8U7tHWJ8S8TLwtK16lj9L2MbkazxZU",
    authDomain: "fitness-app-36ccf.firebaseapp.com",
    databaseURL: "https://fitness-app-36ccf-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fitness-app-36ccf",
    storageBucket: "fitness-app-36ccf.appspot.com",
    messagingSenderId: "256798493305",
    appId: "1:256798493305:web:059585e24cbe47114b62a8",
    measurementId: "G-5GRSPDZWC0"
  };
const app = initializeApp(firebaseConfig);  

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    }
  }, []);

  const handleSignUpPress = () => {
    navigation.navigate('Register'); 
  };

  const handleLogin = async () => {
    try {
      const auth = getAuth(app);
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login', 'You have successfully logged in.');
  
      // Retrieve the user's role from the Realtime Database
      const db = getDatabase(app);
      const userRef = ref(db, `users/${auth.currentUser.uid}/role`);
      const snapshot = await get(userRef);
      const role = snapshot.val();
  
      // Navigate to the appropriate screen based on the user's role
      if (role === 'trainer') {
        navigation.navigate('TrainerHome');
      } else if (role === 'trainee') {
        navigation.navigate('TraineeHome');
      } else {
        // Handle other roles or scenarios
        console.error('Unknown role:', role);
        Alert.alert('Unknown role', 'Please contact support.');
      }
    } catch (error) {
      console.error('Login Error:', error.message);
      Alert.alert('Login Failed', error.message);
    }
  };
  
  

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  return (
    <View className='flex-1 items-center justify-center bg-green-800 p-4'>
      {/* Gym Logo */}
      <FontAwesomeIcon icon={faDumbbell} size={72} color='#fff' className='mb-8' />
      <Text className='text-white text-2xl font-bold text-center mt-2 mb-1'>
        Gym Fitness App
      </Text>
      {/* Login Heading */}
      <Text className='text-white text-2xl font-bold text-center mb-6'>
        Login
      </Text>

      {/* Email Input */}
      <TextInput
        className='input mb-4 w-full p-3 bg-white rounded'
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      {/* Password Input */}
      <TextInput
        className='input mb-4 w-full p-3 bg-white rounded'
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {/* Login Button */}
      <TouchableOpacity
        className='button bg-white p-4 rounded w-full mb-4'
        onPress={handleLogin}
      >
        <Text className='text-lg text-center'>Login</Text>
      </TouchableOpacity>

      {/* SignUp Link */}
      <Text className='text-white text-sm text-center'>
        Don't have an account?{' '}
        <Text
          className='text-white underline'
          onPress={handleSignUpPress}
        >
          SignUp here
        </Text>
      </Text>

      <StatusBar className="auto" />
    </View>
  );
};

export default Login;
