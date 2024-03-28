import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getAuth } from '@firebase/auth';
import { firebaseApp } from '../../../firebase.js';
import { getDatabase, ref, onValue } from "firebase/database";
import tw from 'tailwind-react-native-classnames';

const ViewSession = () => {
  const auth = getAuth();
  const db = getDatabase(firebaseApp);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = () => {
      try {
        const userSessionsRef = ref(db, 'completedSessions');
        onValue(userSessionsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const userSessions = Object.values(data).filter(session => session.userId === auth.currentUser.uid);
            setSessions(userSessions);
          }
        });
      } catch (error) {
        console.error('Error fetching user sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sessions History</Text>
      <ScrollView style={styles.scrollContainer}>
        {sessions.map((session, index) => (
          <View key={index} style={styles.sessionCard}>
            <Text style={styles.sessionText}>Session ID: {session.sessionId}</Text>
            <Text style={styles.sessionText}>User ID: {session.userId}</Text>
            <Text style={styles.sessionText}>Date & Time: {session.dateTime}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  sessionCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sessionText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ViewSession;
