import { View, StyleSheet, ScrollView, Button } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import CategoryList from '../components/CategoryList';
import GlobalApi from '../src/services/GlobalApi';
import PlaceList from '../components/PlaceList';
import { UserLocationContext } from '../src/context/UserLocationContext';
import { SIZES } from '../constants/sizes';

function Home({ navigation }) {
  const [placeList, setPlaceList] = useState([]);
  const { location, setLocation } = useContext(UserLocationContext);
  const mapRegion = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
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

  useEffect(() => {
    GetNearBySearchPlace('restaurant');
  }, [location]);

  // const renderItem = ({ item }) => <FoodItem data={item} />;


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
            <Marker title='You' coordinate={mapRegion} />
          </MapView>
        )}
      </View>
      <CategoryList
        setSelectedCategory={(value) => GetNearBySearchPlace(value)}
      />
      {placeList && <PlaceList placeList={placeList} />}
      <View style={styles.button}>
        <Button
          onPress={() => navigation.navigate('FoodPost')}
          title='Open Food Post'
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
