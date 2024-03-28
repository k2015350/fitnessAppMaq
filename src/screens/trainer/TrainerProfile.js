import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, Image, TextInput, Platform, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Picker } from '@react-native-picker/picker';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from '@firebase/auth';
import { firebaseApp } from '../../../firebase.js';
import { getDatabase, ref, onValue, get, set } from "firebase/database";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import { launchImageLibrary } from 'react-native-image-picker';
import tw from 'tailwind-react-native-classnames';

const TrainerProfile = (navigation) => {
  const auth = getAuth();
  const db = getDatabase(firebaseApp);
  const storage = getStorage(firebaseApp);

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [specialised, setSpecialised] = useState('');
  const [experience, setExperience] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch trainer profile data
    const fetchTrainerProfile = async () => {
      try {
        const userRef = ref(db, `trainerProfiles/${auth.currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setName(data.name || '');
            setGender(data.gender || '');
            setSpecialised(data.specialised || '');
            setExperience(data.experience || '');
          }
        });

        // Fetch profile picture
        const picRef = storageRef(storage, `profilePics/${auth.currentUser.uid}`);
        const url = await getDownloadURL(picRef).catch(() => null);
        setProfilePic(url);
      } catch (error) {
        console.error('Error fetching trainer profile:', error);
      }
    };

    fetchTrainerProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Landing');
      Alert.alert('Sign Out', 'You have been signed out successfully.');
      // Navigate to sign-in screen or landing screen
    } catch (error) {
      console.error('Signout Error:', error.message);
      Alert.alert('Signout Failed', error.message);
    }
  };

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
    };
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
      } else {
        const imageUri = Platform.OS === 'ios' ? response.uri.replace('file://', '') : response.uri;
        const picRef = storageRef(storage, `profilePics/${auth.currentUser.uid}`);
        await uploadString(picRef, imageUri, 'data_url');
        setProfilePic(imageUri);
      }
    });
  };

  const handleSaveProfile = async () => {
    try {
      const userRef = ref(db, `trainerProfiles/${auth.currentUser.uid}`);
      await set(userRef, {
        name: name,
        gender: gender,
        specialised: specialised,
        experience: experience
      });
      Alert.alert('Profile Saved Successfully');
    } catch (error) {
      console.error('Error saving trainer profile:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  return (
    <View style={[tw`flex-1 items-center justify-center bg-green-800 p-4`]}>
      <Text style={tw`text-white text-2xl mb-4`}>Trainer Profile</Text>
      {profilePic ? (
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
      ) : (
        <FontAwesomeIcon icon={faUserCircle} style={tw`mb-4`} size={120} />
      )}
      <TouchableOpacity onPress={handleImageUpload} style={tw`bg-gray-300 rounded-full p-2 mb-4`}>
        <Text style={tw`text-black font-semibold`}>Upload Profile Picture</Text>
      </TouchableOpacity>
      <TextInput
        style={tw`bg-gray-100 rounded-md px-4 py-2 w-full mb-4`}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      {/* Radio buttons for gender */}
      <View style={tw`flex-row mb-4`}>
        <TouchableOpacity
          style={[tw`bg-gray-100 rounded-md px-4 py-2 mr-2`, gender === 'male' && tw`bg-blue-500`]}
          onPress={() => setGender('male')}
        >
          <Text style={tw`text-black font-semibold`}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tw`bg-gray-100 rounded-md px-4 py-2`, gender === 'female' && tw`bg-blue-500`]}
          onPress={() => setGender('female')}
        >
          <Text style={tw`text-black font-semibold`}>Female</Text>
        </TouchableOpacity>
      </View>
      {/* Select options for specialised */}
      <View style={tw`bg-gray-100 rounded-md px-4 py-2 w-full mb-4`}>
        <Picker
          selectedValue={specialised}
          onValueChange={(itemValue, itemIndex) => setSpecalised(itemValue)}
        >
          <Picker.Item label="Select Specialised" value="" />
          <Picker.Item label="Cardio" value="Cardios" />
          <Picker.Item label="Weight Management" value="Weight Management" />
          <Picker.Item label="Yoga" value="Yoga" />
        </Picker>
      </View>
      <TextInput
        style={tw`bg-gray-100 rounded-md px-4 py-2 w-full mb-4`}
        value={experience}
        onChangeText={setExperience}
        placeholder="Experience"
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={handleSaveProfile} style={tw`bg-blue-500 px-4 py-2 rounded-md mb-4`}>
        <Text style={tw`text-white font-semibold text-center`}>Save Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={tw`bg-red-500 px-4 py-2 rounded-md`}>
        <Text style={tw`text-white font-semibold text-center`}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});

export default TrainerProfile;
