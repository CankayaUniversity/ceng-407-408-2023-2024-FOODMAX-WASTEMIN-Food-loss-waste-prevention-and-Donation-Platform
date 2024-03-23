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
import { useState , useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../FirebaseConfig';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

import * as ImagePicker from 'expo-image-picker';

function FoodPost({ navigation }) {

  const [FoodPostTitle, setFoodPostTitle] = useState('');
  const [FoodPostDescription, setFoodPostDescription] = useState('');
  const [FoodPostQuantity, setFoodPostQuantity] = useState('');
  const [FoodPostPrice, setFoodPostPrice] = useState('');
  const [FoodPostFoodType, setFoodPostFoodType] = useState('');
  const [FoodPostPhotos, setFoodPostPhotos] = useState([]);
  const [FoodPostAllergyWarning, setFoodPostAllergyWarning] = useState([]);
  const [FoodPostExipry, setFoodPostExipry] = useState(new Date());

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const auth = FIREBASE_AUTH;
  const firestore = FIREBASE_FIRESTORE;

  const foodTypes = ['Produce', 'Pastries', 'Meals','Packaged Food'];


  const createFoodPost = async () => {
    setLoading(true);
    try{
      const currentUser = auth.currentUser;
      const userDisplayName = currentUser.uid; 

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

      console.log("FoodPostphotos:", FoodPostPhotos);
      const FoodPostRef = await addDoc(collection(firestore,'FoodPost'), { 
        PostId: '',
        PostTitle : FoodPostTitle,
        PostDate: Timestamp.fromDate(new Date()),
        PostDescription : FoodPostDescription,
        PostQuantity : FoodPostQuantity,
        PostFoodType : FoodPostFoodType,
        PostAllergyWarning : FoodPostAllergyWarning,
        PostExipry : FoodPostExipry,
        PostPrice : FoodPostPrice,
        PostFoodProvider : userDisplayName,
        PostPhotos: FoodPostPhotos,
      });
      // Update the document to set PostId
      await setDoc(doc(firestore, 'FoodPost', FoodPostRef.id), {
        PostId: FoodPostRef.id,
      }, { merge: true }); // Use merge option to update existing document

      //console.log('Document written with ID: ', FoodPostRef.id); // doc id of food post && makes doc id same as foodpost id
      alert('Food Post created successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to create document. Please try again.');
    }finally {
      setLoading(false);
    }
  }

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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);
  
  const pickImage = async () => {
    if (!ImagePicker.launchImageLibraryAsync) {
      console.error("ImagePicker.launchImageLibraryAsync is not available");
      return;
    }
    if (FoodPostPhotos.length >= 5) {
      alert('You can only upload up to 5 photos.');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    //console.log("ImagePicker result:", result); // Log the result object
    //console.log("Image URI:", result.assets[0].uri);
  
    if (result.cancelled) {
      // User cancelled image selection
      return;
    }
  
    if (!result.assets[0].uri) {
      console.error("Image URI is undefined");
      return;
    }
    
    if (FoodPostPhotos.length + 1 <= 5) {
      // Add the selected photo to the array
      setFoodPostPhotos(prevPhotos => [...prevPhotos, result.assets[0].uri]);
    } else {
      alert('You can only upload up to 5 photos.');
    }
  };
  
  
  


  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.screen}>
      <View style={styles.topContainer}>
        <Text style={styles.screenText}>{t('Create Food Post')}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text>Title for Food Post</Text>
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
          onChangeText={(text) =>  {
            if (text.length <= 100) {
              setFoodPostDescription(text);
            } else {
              alert('Title cannot exceed 100 characters.');
            }
          }}
        ></TextInput>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
            {FoodPostPhotos.map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={{ width: 200, height: 200 }} />
            ))}

        <TextInput
          value={FoodPostQuantity}
          placeholder='Quantity'
          autoCapitalize='none'
          keyboardType='numeric'
          onChangeText={(text) => setFoodPostQuantity(text)} 
        ></TextInput>
        <TextInput
          value={FoodPostPrice}
          placeholder='Price' //0 for donations, or add a bool to set if its donation  or not
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
            }>
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
            color={FoodPostAllergyWarning.includes('Gluten-Free') ? 'green' : 'gray'}
            style={[styles.allergyButton, { backgroundColor: FoodPostAllergyWarning.includes('Gluten-Free') ? 'lightgreen' : 'lightgray' }]}
          />
          <Button
            onPress={() => toggleAllergyWarning('Dairy-Free')}
            title='Dairy-Free'
            color={FoodPostAllergyWarning.includes('Dairy-Free') ? 'green' : 'gray'}
            style={[styles.allergyButton, { backgroundColor: FoodPostAllergyWarning.includes('Dairy-Free') ? 'lightgreen' : 'lightgray' }]}
          />
          <Button
            onPress={() => toggleAllergyWarning('Vegan')}
            title='Vegan'
            color={FoodPostAllergyWarning.includes('Vegan') ? 'green' : 'gray'}
            style={[styles.allergyButton, { backgroundColor: FoodPostAllergyWarning.includes('Vegan') ? 'lightgreen' : 'lightgray' }]}
          />
          <Button
            onPress={() => toggleAllergyWarning('Vegetarian')}
            title='Vegetarian'
            color={FoodPostAllergyWarning.includes('Vegetarian') ? 'green' : 'gray'}
            style={[styles.allergyButton, { backgroundColor: FoodPostAllergyWarning.includes('Vegetarian') ? 'lightgreen' : 'lightgray' }]}
          />
        </View>
        <Button onPress={showDatepicker} title="Select Expiry Date" /> 
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={FoodPostExipry}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
       
        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <>
            <Button title='Create Post' onPress={() => createFoodPost()}></Button>
            <Button
              title='Back'
              onPress={() => navigation.navigate('Home')} //doesnt work???
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
  allergyButton: {  //doesnt show up!
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
