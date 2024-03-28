import React from "react";
import { TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons/faDumbbell";

const Landing = ({ navigation }) => {
  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const handleRegisterPress = () => {
    navigation.navigate("Register");
  };

  return (
    <View className="flex-1 items-center justify-center bg-green-800 p-4">
      {/* Gym Logo */}
      <FontAwesomeIcon
        icon={faDumbbell}
        size={72}
        color="#042d01"
        className="mb-8"
      />
      <Text className="text-white text-2xl font-bold text-center mr-3 ml-3 mt-4 mb-8">
        Fitness Flex
      </Text>

      {/* Login Button */}
      <TouchableOpacity
        className="bg-white p-4 rounded mb-4 w-48 text-center"
        onPress={handleLoginPress}
      >
        <Text className="text-lg">Login</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity
        className="bg-white p-4 rounded w-48 text-center"
        onPress={handleRegisterPress}
      >
        <Text className="text-lg">Register</Text>
      </TouchableOpacity>

      <StatusBar className="auto" />
    </View>
  );
};

export default Landing;
