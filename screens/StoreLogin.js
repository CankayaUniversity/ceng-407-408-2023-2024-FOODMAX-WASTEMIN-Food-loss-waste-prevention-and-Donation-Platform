import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import {
  addDoc,
  collection,
  Timestamp,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import {
  FIREBASE_FIRESTORE,
  FIREBASE_AUTH,
  FIREBASE_STORAGE,
} from '../FirebaseConfig';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { UserLocationContext } from '../src/context/UserLocationContext';
import GlobalApi from '../src/services/GlobalApi';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const StoreLogin = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { location, setLocation } = useContext(UserLocationContext);
  const [loc, setLoc] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const firestore = FIREBASE_FIRESTORE;
  const storage = FIREBASE_STORAGE;
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;

  const navigation = useNavigation();

  const mapRegion = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    // fetchData();
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    if (coordinate) {
      setSelectedLocation(coordinate);
      getAddress(coordinate);
      setLoc(coordinate);
    } else {
      console.error('Invalid coordinate:', coordinate);
    }
  };

  const getAddress = (value) => {
    setLoading(true);
    if (value) {
      GlobalApi.geoCode(value.latitude, value.longitude)
        .then((resp) => {
          setAddress(resp.data.results[0].formatted_address);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching geocode:', error);
        });
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        const storageRef = ref(storage, `logos/${filename}`);

        const response = await fetch(imageUri);
        const blob = await response.blob();

        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);

        setLogo(downloadUrl);
      }
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, 'Store')
      );
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      fetchedData.forEach(async (f) =>
        console.log((await getDoc(f.owner)).data())
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addStoreCollection = async () => {
    try {
      const storeQuerySnapshot = await getDocs(
        query(
          collection(firestore, 'Store'),
          where('owner', '==', doc(FIREBASE_FIRESTORE, `/users/${user.uid}`))
        )
      );
      if (!storeQuerySnapshot.empty) {
        Alert.alert(
          'Error',
          'You have already registered a store. Please create another account to register a new store.'
        );
        navigation.navigate('SettingsScreen');
        return;
      }

      const docRef = await addDoc(collection(firestore, 'Store'), {
        category: category,
        createdAt: Timestamp.fromDate(new Date()),
        description: description,
        logo: logo,
        name: name,
        address: address,
        owner: doc(FIREBASE_FIRESTORE, `/users/${user.uid}`),
        products: [],
        location: {
          latitude: loc.latitude,
          longitude: loc.longitude,
        },
      });

      Alert.alert('Success', 'Store collection document added successfully!');
      setLogo('');
      setName('');
      setAddress('');
      setCategory('');
      setDescription('');
      navigation.navigate('SettingsScreen');
    } catch (error) {
      console.error('Error adding store collection document: ', error);
      Alert.alert(
        'Error',
        'Failed to add store collection document. Please try again later.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Select your store location</Text>
        <MapView
          style={styles.map}
          onPress={handleMapPress}
          initialRegion={mapRegion}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
        >
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>
        {selectedLocation && (
          <View style={styles.addressBox}>
            {loading ? (
              <ActivityIndicator size='large' color='#0000ff' />
            ) : (
              <Text>Address: {address}</Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.bottomContainer}>
        <Button title='Pick an image from camera roll' onPress={selectImage} />
        <TextInput placeholder='Name' value={name} onChangeText={setName} />
        <TextInput
          placeholder='Category'
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          placeholder='Description'
          value={description}
          onChangeText={setDescription}
        />
        <Button
          title='Add Store'
          onPress={addStoreCollection}
          disabled={!address}
        />
      </View>
    </View>
  );
};

export default StoreLogin;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
  },
  map: {
    height: 250,
    marginTop: 10,
    borderRadius: 10,
  },
  addressBox: {
    position: 'absolute',
    padding: 12,
    marginHorizontal: 10,
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  bottomContainer: {
    gap: 10,
  },
});
