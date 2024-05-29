import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/colors';
import { Picker } from '@react-native-picker/picker';

import { FIREBASE_FIRESTORE, FIREBASE_STORAGE } from '../FirebaseConfig';

function FoodPostEdit({ route, navigation }) {
  const { t } = useTranslation();
  const [foodPost, setFoodPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const { postId } = route.params;
  const foodTypes = ['Produce', 'Pastries', 'Meals', 'Packaged Food'];
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [foodPostAllergyWarning, setFoodPostAllergyWarning] = useState([]);

  useEffect(() => {
    const fetchFoodPost = async () => {
      try {
        const docRef = doc(FIREBASE_FIRESTORE, 'FoodPost', postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setFoodPost(postData);
          setSelectedFoodType(postData.PostFoodType || '');
          setFoodPostAllergyWarning(postData.PostAllergyWarning || []);
          if (postData.PostExipry) {
            postData.PostExipry = postData.PostExipry.toDate(); // Assuming it's a Firestore Timestamp
          }
          setFoodPost(postData);
          setExpiryDate(postData.PostExipry || new Date());
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
    try {
      setLoading(true);
      const docRef = doc(FIREBASE_FIRESTORE, 'FoodPost', postId);
      await updateDoc(docRef, foodPost);
      console.log('Document successfully updated!');
      navigation.navigate('MyStoreScreen');
    } catch (error) {
      console.error('Error updating document:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAllergyWarning = (allergy) => {
    const updatedAllergyWarnings = foodPostAllergyWarning.includes(allergy)
      ? foodPostAllergyWarning.filter((item) => item !== allergy)
      : [...foodPostAllergyWarning, allergy];
    setFoodPostAllergyWarning(updatedAllergyWarnings);
    handleChange('PostAllergyWarning', updatedAllergyWarnings);
  };

  const handleChange = (field, value) => {
    console.log('Updating field:', field, 'with value:', value);
    setFoodPost((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    if (field === 'PostFoodType') {
      setSelectedFoodType(value); // Update selectedFoodType state
    }
  };

  const selectExpiryDate = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
      handleChange('PostExipry', selectedDate);
    }
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
      const fileName = selectedImage.uri.substring(
        selectedImage.uri.lastIndexOf('/') + 1
      );
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

  const handleSetAvailability = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              setLoading(true);
              const docRef = doc(FIREBASE_FIRESTORE, 'FoodPost', postId);
              await updateDoc(docRef, { PostAvailability: 1 });
              setFoodPost((prevState) => ({
                ...prevState,
                PostAvailability: 1,
              }));
              Alert.alert('Success', 'Post deleted.');
              navigation.navigate('MyStoreScreen');
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again later.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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
            placeholder='Title'
            onChangeText={(text) => handleChange('PostTitle', text)}
          />
          <TextInput
            style={styles.input}
            value={foodPost?.PostDescription || ''}
            placeholder='Description'
            onChangeText={(text) => handleChange('PostDescription', text)}
          />
          <Button title='Select Image' onPress={selectImage} />

          <TextInput
            style={styles.input}
            value={foodPost?.PostQuantity || ''}
            placeholder='Quantity'
            onChangeText={(text) => handleChange('PostQuantity', text)}
          />
          <TextInput
            style={styles.input}
            value={foodPost?.PostPrice || ''}
            placeholder='Price'
            onChangeText={(text) => handleChange('PostPrice', text)}
          />
          <Text>Food Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedFoodType}
              style={{ height: 50, width: '100%' }}
              onValueChange={
                (itemValue, itemIndex) =>
                  handleChange('PostFoodType', itemValue) 
              }
            >
              <Picker.Item label='Select Food Type' value='' />
              {foodTypes.map((type, index) => (
                <Picker.Item key={index} label={type} value={type} />
              ))}
            </Picker>
          </View>

          <Text>Allergy Warnings</Text>
          <View style={styles.allergyButtonContainer}>
            <Button
              onPress={() => toggleAllergyWarning('Gluten-Free')}
              title='Gluten-Free'
              color={
                foodPostAllergyWarning.includes('Gluten-Free')
                  ? 'green'
                  : 'gray'
              }
              style={[
                styles.allergyButton,
                {
                  backgroundColor: foodPostAllergyWarning.includes(
                    'Gluten-Free'
                  )
                    ? 'lightgreen'
                    : 'lightgray',
                },
              ]}
            />
            <Button
              onPress={() => toggleAllergyWarning('Dairy-Free')}
              title='Dairy-Free'
              color={
                foodPostAllergyWarning.includes('Dairy-Free') ? 'green' : 'gray'
              }
              style={[
                styles.allergyButton,
                {
                  backgroundColor: foodPostAllergyWarning.includes('Dairy-Free')
                    ? 'lightgreen'
                    : 'lightgray',
                },
              ]}
            />
            <Button
              onPress={() => toggleAllergyWarning('Vegan')}
              title='Vegan'
              color={
                foodPostAllergyWarning.includes('Vegan') ? 'green' : 'gray'
              }
              style={[
                styles.allergyButton,
                {
                  backgroundColor: foodPostAllergyWarning.includes('Vegan')
                    ? 'lightgreen'
                    : 'lightgray',
                },
              ]}
            />
            <Button
              onPress={() => toggleAllergyWarning('Vegetarian')}
              title='Vegetarian'
              color={
                foodPostAllergyWarning.includes('Vegetarian') ? 'green' : 'gray'
              }
              style={[
                styles.allergyButton,
                {
                  backgroundColor: foodPostAllergyWarning.includes('Vegetarian')
                    ? 'lightgreen'
                    : 'lightgray',
                },
              ]}
            />
          </View>

          <Button title='Select Expiry Date' onPress={selectExpiryDate} />

          {loading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <>
              <Button title='Save' onPress={handleEdit} />
              <Button
                title='Back'
                onPress={() => navigation.navigate('MyStoreScreen')}
              />
              <Button
                title='Delete Food Post'  // doesnt actually delete since we want to keep foodposts as previous purchases under users
                onPress={handleSetAvailability} // only sets availability to 1 (so posts wont show up)
                color="red"
              />
            </>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode='date'
              display='default'
              onChange={handleDateChange}
            />
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
  input: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
