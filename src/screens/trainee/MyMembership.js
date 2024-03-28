import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from '@firebase/auth';
import { getDatabase, ref, set, push, onValue, query , orderByChild, equalTo} from 'firebase/database';
import tw from 'tailwind-react-native-classnames';

const MyMembership = () => {
  const auth = getAuth();
  const [membershipData, setMembershipData] = useState(null);
  const [membershipExists, setMembershipExists] = useState(false);
  const [amountPaid, setAmountPaid] = useState('');
  const [planMonth, setPlanMonth] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    const fetchMembershipData = () => {
      console.log('Fetching membership data...');
      const db = getDatabase();
      const membersRef = ref(db, 'members');
      // Query the database to find the membership data for the current user's ID
      const userMembershipRef = query(membersRef, orderByChild('userId'), equalTo(auth.currentUser.uid));
  
      onValue(userMembershipRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Membership data:', data);
        if (data) {
          // Since there may be multiple memberships for the same user ID, we loop through the results
          // and set the data for the first membership found
          const membershipKeys = Object.keys(data);
          const firstMembershipKey = membershipKeys[0]; // Assuming there's only one membership per user
          setMembershipData(data[firstMembershipKey]);
          setMembershipExists(true);
        } else {
          setMembershipExists(false);
        }
      });
    };
  
    fetchMembershipData();
  }, []);
  
  
  

  const handleMembershipSubmit = async () => {
    try {
      const db = getDatabase();
      const newMembershipRef = push(ref(db, 'members'));
      const currentDate = new Date().toISOString().split('T')[0];
      const expiryDate = calculateExpiryDate(currentDate, planMonth);
      const membershipDetails = {
        userId: auth.currentUser.uid,
        dateOfPurchase: currentDate,
        amountPaid,
        expiryDate,
      };
      await set(newMembershipRef, membershipDetails);
      Alert.alert('Membership Successfully Added');
    } catch (error) {
      console.error('Error adding membership:', error);
      Alert.alert('Error', 'Failed to add membership.');
    }
  };

  const calculateExpiryDate = (startDate, months) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + parseInt(months));
    return date.toISOString().split('T')[0];
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-green-800 p-4`}>
      {membershipExists ? (
        <View style={tw`p-4 bg-gray-200 rounded-lg`}>
          <Text>Date of Purchase: {membershipData.dateOfPurchase}</Text>
          <Text>Amount Paid: {membershipData.amountPaid}</Text>
          <Text>Expiry Date: {membershipData.expiryDate}</Text>
        </View>
      ) : (
        <View style={tw`p-4 bg-gray-200 rounded-lg`}>
          <Text style={tw`mb-2`}>Enter Membership Details:</Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
          <TextInput
            style={tw`border border-gray-400 rounded p-2 mb-2 w-full`}
            placeholder="Amount Paid"
            value={amountPaid}
            onChangeText={setAmountPaid}
            keyboardType="numeric"
          />
          <TextInput
            style={tw`border border-gray-400 rounded p-2 mb-2 w-full`}
            placeholder="Plan Month"
            value={planMonth}
            onChangeText={setPlanMonth}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={handleMembershipSubmit} style={tw`bg-blue-500 px-4 py-2 rounded-md`}>
            <Text style={tw`text-white font-semibold text-center`}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MyMembership;
