import { View, StyleSheet, ScrollView, Button } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../FirebaseConfig';
import CategoryList from '../components/CategoryList';
import PlaceList from '../components/PlaceList';
import { UserLocationContext } from '../src/context/UserLocationContext';
import { SIZES } from '../constants/sizes';
import StoreList from '../components/StoreList';

function Home({ navigation }) {
  const [placeList, setPlaceList] = useState([]);
  const [foodPosts, setFoodPosts] = useState([]);
  const { location, setLocation } = useContext(UserLocationContext);

  const mapRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0421,
  } : null;

  const GetNearBySearchPlace = async (value) => {
    if (location) {
      try {
        
        const q = query(
          collection(FIREBASE_FIRESTORE, 'Store'),
          where('category', '==', value)
        );
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setPlaceList(fetchedData);
      } catch (error) {
        console.error('Error fetching nearby places:', error);
      }
    }
  };

  const fetchFoodPosts = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, 'FoodPost')
      );
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      return fetchedData;
    } catch (error) {
      console.error('Error fetching food posts:', error);
      return []; 
    }
  };

  useEffect(() => {
    if (location) {
      console.log('Location available:', location);
      GetNearBySearchPlace('restaurant'); 
      fetchFoodPosts().then((data) => {
        setFoodPosts(data); 
      });
    } else {
      console.log('Location not available yet');
    }
  }, [location]);

  return (
    <ScrollView style={styles.container}>
      <View>
        {location && mapRegion && (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            region={mapRegion}
          >
            {foodPosts.map(
              (post, index) =>
                post.PostSelectedSpot &&
                !isNaN(post.PostSelectedSpot.latitude) &&
                !isNaN(post.PostSelectedSpot.longitude) && (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: parseFloat(post.PostSelectedSpot.latitude),
                      longitude: parseFloat(post.PostSelectedSpot.longitude),
                    }}
                    title={post.PostTitle}
                    pinColor='red'
                  />
                )
            )}
            {placeList.map((place, index) => (
              place.location &&
              !isNaN(place.location.latitude) &&
              !isNaN(place.location.longitude) && (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: parseFloat(place.location.latitude),
                    longitude: parseFloat(place.location.longitude),
                  }}
                  title={place.name}
                  pinColor='red'
                />
              )
            ))}
          </MapView>
        )}
      </View>
      <CategoryList
        setSelectedCategory={(value) => GetNearBySearchPlace(value)} // Update selectedCategory state
      />
      <PlaceList placeList={placeList} />
      {/* <StoreList /> */}
      <View style={styles.button}>
        <Button
          onPress={() => navigation.navigate('FoodPostList')}
          title='Open Food Post List'
        />
        <Button
          onPress={() => navigation.navigate('Recommendation')}
          title='Recommended For You'
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
