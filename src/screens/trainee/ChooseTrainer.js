import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { getDatabase, ref, onValue, push, set } from "firebase/database";

const ChooseTrainer = ({ userId }) => {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = () => {
      const db = getDatabase();
      const trainersRef = ref(db, `trainerProfiles/${userId}`);
      onValue(trainersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const trainersList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTrainers(trainersList);
        } else {
          setTrainers([]);
        }
      });
    };

    fetchTrainers();
  }, [userId]);

  const handleSelectTrainer = async (trainerId) => {
    try {
      // Save selected trainer in assignedTrainer for the current user
      const db = getDatabase();
      const assignedTrainerRef = push(ref(db, `assignedTrainer/${userId}`));
      await set(assignedTrainerRef, trainerId);
      alert('Trainer selected successfully!');
    } catch (error) {
      console.error('Error selecting trainer:', error);
      alert('Failed to select trainer. Please try again.');
    }
  };

  const renderTrainerItem = ({ item }) => (
    <TouchableOpacity style={styles.trainerItem} onPress={() => handleSelectTrainer(item.id)}>
      <Text style={styles.trainerName}>{item.name}</Text>
      <Text style={styles.trainerDetails}>Specialist: {item.specialised}</Text>
      <Text style={styles.trainerDetails}>Experience: {item.experience}</Text>
      <Text style={styles.trainerDetails}>Gender: {item.gender}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trainers}
        renderItem={renderTrainerItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  trainerItem: {
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  trainerDetails: {
    fontSize: 16,
  },
});

export default ChooseTrainer;
