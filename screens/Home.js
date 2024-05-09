import { View, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore'; 
import { FIREBASE_FIRESTORE } from '../FirebaseConfig';
import CategoryList from '../components/CategoryList';
import GlobalApi from '../src/services/GlobalApi';
import PlaceList from '../components/PlaceList';
import { UserLocationContext } from '../src/context/UserLocationContext';
import { SIZES } from '../constants/sizes';

function Home({ navigation }) {
  const [placeList, setPlaceList] = useState([]);
  const [foodPosts, setFoodPosts] = useState([]); // New state for food posts
  const { location, setLocation } = useContext(UserLocationContext);
  const mapRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0421,
      }
    : {
        // Default location if location is not available
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0421,
      };

  const GetNearBySearchPlace = (value) => {
    if (location) {
      GlobalApi.nearByPlace(
        location.coords.latitude,
        location.coords.longitude,
        value
      )
        .then((resp) => {
          setPlaceList(resp.data.results);
        })
        .catch((error) => {
          console.error('Error fetching nearby places:', error);
        });
    }
  };

  const fetchFoodPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_FIRESTORE, 'FoodPost'));
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return fetchedData;
    } catch (error) {
      console.error('Error fetching food posts:', error);
      return []; // Return an empty array if an error occurs
    }
  };

  useEffect(() => {
    GetNearBySearchPlace('restaurant');
    fetchFoodPosts().then((data) => {
      console.log('Fetched food posts:', data); // Log fetched data
      setFoodPosts(data); // Update foodPosts state
    });
  }, [location]);

  useEffect(() => {
    console.log('Food posts:', foodPosts); // Log foodPosts state
  }, [foodPosts]);

  return (
    <ScrollView style={styles.container}>
      <View>
      {location && (
        <MapView
  style={styles.map}
  provider={PROVIDER_GOOGLE}
  showsUserLocation={true}
  region={mapRegion}
>
  {foodPosts.map((post, index) => (
    post.PostSelectedSpot && (
      <Marker
        key={index}
        coordinate={{
          latitude: parseFloat(post.PostSelectedSpot.latitude),
          longitude: parseFloat(post.PostSelectedSpot.longitude),
        }}
        title={post.PostTitle}
        pinColor="red"
      />
    )
  ))}
  <Marker title='You' coordinate={mapRegion} />
</MapView>

)}

      </View>
      <CategoryList
        setSelectedCategory={(value) => GetNearBySearchPlace(value)}
      />
      {placeList && <PlaceList placeList={placeList} />}
      {/* put these temporarily here */}
      <View style={styles.button}>
        <Button
          onPress={() => navigation.navigate('FoodPost')}
          title='Create Food Post'
        />
        <Button
          onPress={() => navigation.navigate('FoodPostList')}
          title='Open Food Post List'
        />
      </View>
    </ScrollView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  map: {
    height: 200,
    width: SIZES.width - 40,
  },
  button: {
    marginBottom: 40,
  },
});
