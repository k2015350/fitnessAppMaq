import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
import { getDatabase, ref, set } from '@firebase/database';
import {database } from '../../firebase.js';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSignInPress = () => {
    navigation.navigate('Login');
  };

  const handleSignUpPress = async () => {
    try {
      // Create user in Firebase Authentication
      const auth = getAuth(); // Get the Auth instance
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
  
      // Store user data in Realtime Database
      const db = getDatabase();
      await set(ref(db, 'users/' + currentUser.uid), {
        userId: currentUser.uid,
        name: name,
        email: email,
        role: selectedRole
      });

      console.log('Data updated.');

      // Navigate to the login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  return (
    <View className='flex-1 items-center justify-center bg-green-800 p-4'>
      <Text className='text-white text-3xl font-bold text-center mb-6'>
        SignUp
      </Text>

      {/* Name Input */}
      <TextInput
        className='input mb-4 w-full p-3 bg-white rounded'
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

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

      {/* Register as Label */}
      <View className='flex-row items-center justify-between w-full mt-1 mb-4'>
        <Text className='text-white text-lg'>
          Register as:
        </Text>

{/* Role Buttons */}
<View className='flex-row mr-6 mt-1 mb-2'>
  <TouchableOpacity
    className={`button rounded-full p-2 mr-5 ${selectedRole === 'trainer' ? 'bg-green-600' : 'bg-white'}`}
    onPress={() => handleRoleSelection('trainer')}
  >
    <Text className={`text-lg ${selectedRole === 'trainer' ? 'text-white' : 'text-green-600'}`}>
      Trainer
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    className={`button rounded-full p-2 ${selectedRole === 'trainee' ? 'bg-green-600' : 'bg-white'}`}
    onPress={() => handleRoleSelection('trainee')}
  >
    <Text className={`text-lg ${selectedRole === 'trainee' ? 'text-white' : 'text-green-600'}`}>
      Trainee
    </Text>
  </TouchableOpacity>
</View>


      </View>

      {/* SignUp Button */}
      <TouchableOpacity
        className='button bg-white p-4 rounded w-full mb-4'
        onPress={handleSignUpPress}
      >
        <Text className='text-lg text-center'>SignUp</Text>
      </TouchableOpacity>

      {/* SignIn Link */}
      <Text className='text-white text-sm text-center'>
        Already have an account?{' '}
        <Text
          className='text-white underline'
          onPress={handleSignInPress}
        >
          Sign In here
        </Text>
      </Text>

      <StatusBar className="auto" />
    </View>
  );
};

export default SignUp;
