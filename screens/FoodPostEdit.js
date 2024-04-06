import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Text, ActivityIndicator, Switch, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/colors';
import {
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
  FIREBASE_STORAGE,
} from '../FirebaseConfig';


function FoodPostEdit({ route, navigation }) {
  const { t } = useTranslation();
  const [foodPost, setFoodPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const { postId } = route.params; // Assuming postId is passed as a route parameter

  useEffect(() => {
    // Fetch the existing data of the food post to be edited
    const fetchFoodPost = async () => {
      try {
        const docRef = doc(FIREBASE_FIRESTORE, 'FoodPost', postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          // Parse PostExipry field to Date object if it exists
          if (postData.PostExipry) {
            postData.PostExipry = postData.PostExipry.toDate(); // Assuming it's a Firestore Timestamp
          }
          setFoodPost(postData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
  
    fetchFoodPost();
  }, [postId]);

  const handleEdit = async () => {
    // Update the corresponding document in Firebase with the edited data
    try {
      setLoading(true);
      const docRef = doc(FIREBASE_FIRESTORE, 'FoodPost', postId);
      await updateDoc(docRef, foodPost);
      console.log('Document successfully updated!');
      navigation.navigate('HomeScreen'); // Navigate back to home screen after editing
    } catch (error) {
      console.error('Error updating document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field === 'PostExipry') {
      // If the field is PostExipry, ensure value is a Date object
      value = new Date(value);
    }
    setFoodPost(prevState => ({
      ...prevState,
      [field]: value
    }));
  };
  

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access media library was denied');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      multiple: false,
    });

    if (!result.cancelled) {
      const selectedImage = result.assets[0];
      const fileName = selectedImage.uri.substring(selectedImage.uri.lastIndexOf('/') + 1);
      const storageRef = ref(FIREBASE_STORAGE, 'images/' + fileName);
      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();

      uploadBytes(storageRef, blob)
        .then((snapshot) => {
          console.log('File uploaded successfully');
          const storagePath = storageRef.fullPath;
          handleChange('PostPhotos', [storagePath]);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.screen}>
        <View style={styles.topContainer}>
          <Text style={styles.screenText}>{t('Edit Food Post')}</Text>
        </View>
        <View style={styles.bottomContainer}>
          <TextInput
          autoCapitalize='none'
          style={styles.input}
          value={foodPost?.PostTitle || ''}
          placeholder="Title"
          onChangeText={(text) => handleChange('PostTitle', text)}

          ></TextInput>
          <TextInput
             style={styles.input}
             value={foodPost?.PostDescription || ''}
             placeholder="Description"
             onChangeText={(text) => handleChange('PostDescription', text)}
   
          ></TextInput>
          <Button title="Select Image" onPress={selectImage} />


        <TextInput
          style={styles.input}
          value={foodPost?.PostQuantity || ''}
          placeholder="Quantity"
          onChangeText={(text) => handleChange('PostQuantity', text)}
        />
        <TextInput
          style={styles.input}
          value={foodPost?.PostPrice || ''}
          placeholder="Price"
          onChangeText={(text) => handleChange('PostPrice', text)}
        />

          <Text>Food Type</Text>
          
          {loading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <>
              <Button title="Save" onPress={handleEdit} />
              <Button
                title='Back'
                onPress={() => navigation.navigate('HomeScreen')}
              ></Button>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default FoodPostEdit;
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  allergyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  allergyButton: {
    //doesnt show up!
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 30,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.cream,
  },
  screenText: {
    fontSize: 24,
    color: Colors.navy,
    fontWeight: 'bold',
  },
  screenSubText: {
    fontSize: 14,
    color: Colors.gray,
  },
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 5,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 48,
    paddingHorizontal: 24,
    elevation: 4,
  },
});
