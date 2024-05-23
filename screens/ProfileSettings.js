import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Image,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../constants/colors';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; 
import { FIREBASE_FIRESTORE, FIREBASE_STORAGE, FIREBASE_AUTH } from '../FirebaseConfig';

const DEFAULT_PROFILE_PIC_URL = 'https://firebasestorage.googleapis.com/v0/b/nourish-me-8e6b6.appspot.com/o/images%2Fprofilepics%2F06b6cc6f-c50f-44dd-a6ee-75ab6506c1f4.jpeg?alt=media&token=aee502fc-ead3-429f-a16c-310872b9d1ee';

const ProfileSettings = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    glutenFree: false,
    dairyFree: false,
    vegan: false,
    vegetarian: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = FIREBASE_AUTH;
        const currentUser = auth.currentUser;
        const uid = currentUser.uid;
        const docRef = doc(FIREBASE_FIRESTORE, 'users', uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();
        if (userData) {
          setFullName(userData.fullName || '');
          setProfilePic(userData.profilePic);
          setPreferences(userData.preferences || {});
        } else {
          console.error('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };
    fetchUserData();
  }, []);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const auth = FIREBASE_AUTH;
      const currentUser = auth.currentUser;
      const uid = currentUser.uid;
      const docRef = doc(FIREBASE_FIRESTORE, 'users', uid);
      await updateDoc(docRef, {
        fullName: fullName,
        profilePic: profilePic,
        preferences: preferences,
      });
    } catch (error) {
      console.error('Error updating profile: ', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = (preference) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [preference]: !prevPreferences[preference],
    }));
  };

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1], // Ensure aspect ratio is 1:1
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const fileName = selectedImage.uri.substring(
          selectedImage.uri.lastIndexOf('/') + 1
        );
        const storageRef = ref(FIREBASE_STORAGE, 'images/profilepics/' + fileName);
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();

        if (profilePic && profilePic !== DEFAULT_PROFILE_PIC_URL) {
          const prevFileName = profilePic.substring(profilePic.lastIndexOf('%2F') + 3, profilePic.lastIndexOf('?'));
          const prevStorageRef = ref(FIREBASE_STORAGE, 'images/profilepics/' + prevFileName);

          deleteObject(prevStorageRef)
            .then(() => {
              console.log('Previous profile picture deleted successfully');
            })
            .catch((error) => {
              console.error('Error deleting previous profile picture:', error);
            });
        }

        uploadBytes(storageRef, blob)
          .then(async (snapshot) => {
            console.log('File uploaded successfully');
            // Get download URL
            const downloadURL = await getDownloadURL(storageRef);
            setProfilePic(downloadURL);
            console.log('downloadURL' + downloadURL);
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
          });
      }
    } catch (error) {
      console.error('Error selecting image: ', error);
    }
  };

  const deleteUser = async () => {
    try {
      const auth = FIREBASE_AUTH;
      const currentUser = auth.currentUser;
      const uid = currentUser.uid;

      if (profilePic && profilePic !== DEFAULT_PROFILE_PIC_URL) {
        const fileName = profilePic.substring(profilePic.lastIndexOf('%2F') + 3, profilePic.lastIndexOf('?'));
        const storageRef = ref(FIREBASE_STORAGE, 'images/profilepics/' + fileName);

        await deleteObject(storageRef);
        console.log('Profile picture deleted successfully');
      }

      await deleteDoc(doc(FIREBASE_FIRESTORE, 'users', uid));
      await currentUser.delete();

      
    } catch (error) {
      console.error('Error deleting user: ', error);
      alert('Failed to delete user');
    }
  };

  const confirmDeleteUser = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteUser },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile Settings</Text>
      {profilePic && <Image source={{ uri: profilePic }} style={styles.image} />}
      <View style={styles.buttonContainer}>
        <Button title='Choose Profile Picture' onPress={selectImage} />
      </View>
      <Text style={styles.simpletext}>Update Username:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
      </View>
      <Text style={styles.simpletext}>Set Preferences:</Text>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceText}>Gluten-Free</Text>
        <Switch
          value={preferences.glutenFree}
          onValueChange={() => togglePreference('glutenFree')}
        />
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceText}>Dairy-Free</Text>
        <Switch
          value={preferences.dairyFree}
          onValueChange={() => togglePreference('dairyFree')}
        />
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceText}>Vegan</Text>
        <Switch
          value={preferences.vegan}
          onValueChange={() => togglePreference('vegan')}
        />
      </View>
      <View style={styles.preferenceContainer}>
        <Text style={styles.preferenceText}>Vegetarian</Text>
        <Switch
          value={preferences.vegetarian}
          onValueChange={() => togglePreference('vegetarian')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Updating...' : 'Update Profile'}
          onPress={updateProfile}
          disabled={loading}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Delete Account"
          onPress={confirmDeleteUser}
          color="red"
        />
      </View>
    </View>
  );
  
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cream,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  simpletext: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'left',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 10,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  preferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  preferenceText: {
    fontSize: 16,
  },
});



export default ProfileSettings;
