import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Colors from '../constants/colors';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FIREBASE_AUTH,
  FIREBASE_FIRESTORE,
  FIREBASE_STORAGE,
} from '../FirebaseConfig';
import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import GoogleMapView from '../components/GoogleMapView';


import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes } from 'firebase/storage';

function FoodPost({ navigation }) {
  const [FoodPostAvailability, setFoodPostAvailability] = useState('');
  const [FoodPostTitle, setFoodPostTitle] = useState('');
  const [FoodPostDescription, setFoodPostDescription] = useState('');
  const [FoodPostQuantity, setFoodPostQuantity] = useState('');
  const [FoodPostPrice, setFoodPostPrice] = useState('');
  const [FoodPostFoodType, setFoodPostFoodType] = useState('');
  const [FoodPostPhotos, setFoodPostPhotos] = useState([]);
  const [FoodPostAllergyWarning, setFoodPostAllergyWarning] = useState([]);
  const [FoodPostExipry, setFoodPostExipry] = useState(new Date());
  const [selectedSpot, setSelectedSpot] = useState(null);

  
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const auth = FIREBASE_AUTH;
  const firestore = FIREBASE_FIRESTORE;

  const foodTypes = ['Produce', 'Pastries', 'Meals', 'Packaged Food'];

  const handleSelectSpot = (spot) => {
    setSelectedSpot(spot);
  };


  const createFoodPost = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      const userDisplayName = currentUser.uid;

      console.log('Selected spot:', selectedSpot);
      const isValidInteger = /^[1-9][0-9]*$/.test(FoodPostQuantity);
      if (!isValidInteger) {
        alert('Quantity must be a valid integer');
        return;
      }
      const isValidPositiveInteger = /^(0|[1-9][0-9]*)$/.test(FoodPostPrice);
      if (!isValidPositiveInteger) {
        alert('Price must be a valid positive integer');
        return;
      }
      if (FoodPostPhotos.length === 0) {
        alert('Please select at least one picture.');
        return;
      }

      const FoodPostRef = await addDoc(collection(firestore, 'FoodPost'), {
        PostId: '',
        PostAvailability: FoodPostAvailability,
        PostTitle: FoodPostTitle,
        PostDate: Timestamp.fromDate(new Date()),
        PostDescription: FoodPostDescription,
        PostQuantity: FoodPostQuantity,
        PostFoodType: FoodPostFoodType,
        PostAllergyWarning: FoodPostAllergyWarning,
        PostExipry: FoodPostExipry,
        PostPrice: FoodPostPrice,
        PostFoodProvider: userDisplayName,
        PostPhotos: FoodPostPhotos,
        PostSelectedSpot: selectedSpot,
      });

      // Update the document to set PostId
      await setDoc(
        doc(firestore, 'FoodPost', FoodPostRef.id),
        {
          PostId: FoodPostRef.id,
          PostAvailability: 0,
          PostSelectedSpot: selectedSpot,
        },
        { merge: true }
      ); // Use merge option to update existing document

      alert('Food Post created successfully!');
      navigation.navigate('FoodPostList');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to create document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || FoodPostExipry;
    setFoodPostExipry(currentDate);
    setShow(false);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const toggleAllergyWarning = (warning) => {
    const updatedWarnings = FoodPostAllergyWarning.includes(warning)
      ? FoodPostAllergyWarning.filter((item) => item !== warning)
      : [...FoodPostAllergyWarning, warning];
    setFoodPostAllergyWarning(updatedWarnings);
  };

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const selectImage = async () => {
    if (!ImagePicker.launchImageLibraryAsync) {
      console.error('ImagePicker.launchImageLibraryAsync is not available');
      return;
    }

    //console.log('Now in selected images');
    // Request permissions to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access media library was denied');
      return;
    }

    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      multiple: false,
    });

    if (!result.cancelled) {
      const selectedImages = result.assets;
      const newPhotos = [...FoodPostPhotos];

      selectedImages.forEach(async (image) => {
        if (FoodPostPhotos.length + 1 > 5) {
          alert('You can only select up to 5 images.');
          return;
        }

        const fileName = image.uri.substring(image.uri.lastIndexOf('/') + 1);
        const storageRef = ref(FIREBASE_STORAGE, 'images/' + fileName);

        const response = await fetch(image.uri);
        const blob = await response.blob();

        uploadBytes(storageRef, blob)
          .then((snapshot) => {
            console.log('File uploaded successfully');
            const storagePath = storageRef.fullPath;
            newPhotos.push(storagePath);
            setFoodPostPhotos(newPhotos);
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
            // Handle errors
          });
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.screen}>
        <View style={styles.topContainer}>
          <Text style={styles.screenText}>{t('Create Food Post')}</Text>
        </View>
        <View style={styles.bottomContainer}>
          <TextInput
            value={FoodPostTitle}
            placeholder='Title'
            autoCapitalize='none'
            onChangeText={(text) => {
              if (text.length <= 50) {
                setFoodPostTitle(text);
              } else {
                alert('Title cannot exceed 50 characters.');
              }
            }}
          ></TextInput>
          <TextInput
            value={FoodPostDescription}
            placeholder='Description'
            autoCapitalize='none'
            onChangeText={(text) => {
              if (text.length <= 100) {
                setFoodPostDescription(text);
              } else {
                alert('Title cannot exceed 100 characters.');
              }
            }}
          ></TextInput>
          <Button
            title='Pick an image from camera roll'
            onPress={selectImage}
          />

           <Text>Maps</Text>
           <GoogleMapView onSelectSpot={handleSelectSpot} />

          <TextInput
            value={FoodPostQuantity}
            placeholder='Quantity'
            autoCapitalize='none'
            keyboardType='numeric'
            onChangeText={(text) => setFoodPostQuantity(text)}
          ></TextInput>
          <TextInput
            value={FoodPostPrice}
            placeholder='Price' // 0 for donations, or add a bool to set if its donation or not
            autoCapitalize='none'
            keyboardType='numeric'
            onChangeText={(text) => setFoodPostPrice(text)} // must be positive integer && cannot be empty
          ></TextInput>
          <Text>Food Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={FoodPostFoodType}
              style={{ height: 50, width: '100%' }}
              onValueChange={(itemValue, itemIndex) =>
                setFoodPostFoodType(itemValue)
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
                FoodPostAllergyWarning.includes('Gluten-Free')
                  ? 'green'
                  : 'gray'
              }
              style={[
                styles.allergyButton,
                {
                  backgroundColor: FoodPostAllergyWarning.includes(
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
                FoodPostAllergyWarning.includes('Dairy-Free') ? 'green' : 'gray'
              }
              style={[
                styles.allergyButton,
                {
                  backgroundColor: FoodPostAllergyWarning.includes('Dairy-Free')
                    ? 'lightgreen'
                    : 'lightgray',
                },
              ]}
            />
            <Button
              onPress={() => toggleAllergyWarning('Vegan')}
              title='Vegan'
              color={
                FoodPostAllergyWarning.includes('Vegan') ? 'green' : 'gray'
              }
              style={[
                styles.allergyButton,
                {
                  backgroundColor: FoodPostAllergyWarning.includes('Vegan')
                    ? 'lightgreen'
                    : 'lightgray',
                },
              ]}
            />
            <Button
              onPress={() => toggleAllergyWarning('Vegetarian')}
              title='Vegetarian'
              color={
                FoodPostAllergyWarning.includes('Vegetarian') ? 'green' : 'gray'
              }
              style={[
                styles.allergyButton,
                {
                  backgroundColor: FoodPostAllergyWarning.includes('Vegetarian')
                    ? 'lightgreen'
                    : 'lightgray',
                },
              ]}
            />
          </View>
          <Button onPress={showDatepicker} title='Select Expiry Date' />
          {show && (
            <DateTimePicker
              testID='dateTimePicker'
              value={FoodPostExipry}
              mode='date'
              is24Hour={true}
              display='default'
              onChange={onChange}
            />
          )}

          {loading ? (
            <ActivityIndicator size='large' color='#0000ff' />
          ) : (
            <>
              <Button
                title='Create Post'
                onPress={() => createFoodPost()}
              ></Button>
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

export default FoodPost;
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
