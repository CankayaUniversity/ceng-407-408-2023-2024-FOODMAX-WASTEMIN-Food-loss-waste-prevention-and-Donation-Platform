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
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '../FirebaseConfig';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { UserLocationContext } from '../src/context/UserLocationContext';
import GlobalApi from '../src/services/GlobalApi';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

const StoreLogin = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { location, setLocation } = useContext(UserLocationContext);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [foodItems, setFoodItems] = useState([]);

  const firestore = FIREBASE_FIRESTORE;
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
    fetchFoods();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    if (coordinate) {
      setSelectedLocation(coordinate);
      getAddress(coordinate);
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

  const fetchFoods = async () => {
    const foodPostsRef = collection(FIREBASE_FIRESTORE, 'FoodPost');
    const q = query(foodPostsRef, where('PostFoodProvider', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setFoodItems(fetchedData);
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
        Alert.alert('Error', 'You have already registered a store.');
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
        products: foodItems,
      });

      Alert.alert('Success', 'Store collection document added successfully!');

      // Clear input fields
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
        <TextInput placeholder='Logo URL' value={logo} onChangeText={setLogo} />
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
        <Button title='Add Store' onPress={addStoreCollection} />
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
