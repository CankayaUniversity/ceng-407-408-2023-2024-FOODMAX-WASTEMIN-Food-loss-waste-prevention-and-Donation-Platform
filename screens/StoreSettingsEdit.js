import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  TextInput,
  Button,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE, FIREBASE_STORAGE } from '../FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker , PROVIDER_GOOGLE} from 'react-native-maps';
import GlobalApi from '../src/services/GlobalApi';
import Colors from '../constants/colors';
import { UserLocationContext } from '../src/context/UserLocationContext';

const StoreSettingsEdit = ({ route, navigation }) => {
  const { storeId } = route.params;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { location, setLocation } = useContext(UserLocationContext);
  const [loc, setLoc] = useState('');

  const mapRegion = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeDoc = await getDoc(doc(FIREBASE_FIRESTORE, 'Store', storeId));
        if (storeDoc.exists()) {
          const storeData = storeDoc.data();
          setStore(storeData);
          setName(storeData.name);
          setDescription(storeData.description);
          setCategory(storeData.category);
          setAddress(storeData.address);
          setLogo(storeData.logo);
          if (storeData.location && storeData.location.latitude !== undefined && storeData.location.longitude !== undefined) {
            
          }
        } else {
          console.log('No such store!');
        }
      } catch (error) {
        console.error('Error fetching store:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const storeUpdateData = {
        name,
        description,
        category,
        address,
        logo,
        location,
      };

      await updateDoc(doc(FIREBASE_FIRESTORE, 'Store', storeId), storeUpdateData);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating store:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;

      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(FIREBASE_STORAGE, `store_logos/${storeId}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setLogo(downloadURL);
    }
  };

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

  useEffect(() => {
    if (selectedLocation) {
      getAddress(selectedLocation);
    }
  }, [selectedLocation]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.navy} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.screen}>
        <Text style={styles.heading}>Edit Store Settings</Text>
        <View style={styles.bottomContainer}>
          <TextInput
            style={styles.input}
            placeholder="Store Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Store Description"
            value={description}
            onChangeText={setDescription}
          />
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Restaurant" value="Restaurant" />
            <Picker.Item label="Cafe" value="Cafe" />
            <Picker.Item label="Supermarket" value="Supermarket" />
          </Picker>
          
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.imagePicker}>Pick a logo</Text>
            {logo && <Image source={{ uri: logo }} style={styles.logo} />}
          </TouchableOpacity>
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
          <Button title="Update Store" onPress={handleUpdate} />
        </View>
      </View>
    </ScrollView>
  );
};

export default StoreSettingsEdit;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
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
  imagePicker: {
    color: Colors.navy,
    textAlign: 'center',
    marginVertical: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
  },
  map: {
    height: 250,
    marginTop: 10,
    borderRadius: 10,
  },
});
