import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/colors';
import { Picker } from '@react-native-picker/picker';

import { FIREBASE_FIRESTORE, FIREBASE_STORAGE, FIREBASE_AUTH } from '../FirebaseConfig';

const ProfileSettings = ({ navigation }) => {
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const auth = FIREBASE_AUTH;
      const currentUser = auth.currentUser;
      const uidFromAuthTable = currentUser.uid;

      const usersCollectionRef = collection(FIREBASE_FIRESTORE, 'users');
      const q = query(usersCollectionRef, where('uid', '==', uidFromAuthTable));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setfullName(userData.fullName);
        setEmail(userData.email);
        // You can fetch other user data similarly
      });
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const auth = FIREBASE_AUTH;
      const currentUser = auth.currentUser;
      const uidFromAuthTable = currentUser.uid;

      const usersCollectionRef = collection(FIREBASE_FIRESTORE, 'users');
      const q = query(usersCollectionRef, where('uid', '==', uidFromAuthTable));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        try {
          await updateDoc(doc.ref, { // Corrected this line
            fullName: fullName,
            // Add other fields you want to update
          });
          alert('Profile updated successfully!');
        } catch (error) {
          console.error('Error updating profile: ', error);
          alert('Failed to update profile');
        }
      });
    } catch (error) {
      console.error('Error updating profile: ', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile Settings</Text>
      <TextInput
        style={styles.input}
        placeholder="fullName"
        value={fullName}
        onChangeText={(text) => setfullName(text)}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      /> */}
      <Button
        title={loading ? 'Updating...' : 'Update Profile'}
        onPress={updateProfile}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cream,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default ProfileSettings;
