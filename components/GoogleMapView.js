import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { UserLocationContext } from '../src/context/UserLocationContext';

export default function GoogleMapView({ selectedSpot, onSelectSpot }) {
  const { location } = useContext(UserLocationContext);
  const [mapRegion, setMapRegion] = useState();

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  const handleMapPress = (event) => {
    onSelectSpot(event.nativeEvent.coordinate);
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.mapView}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={mapRegion}
          onPress={handleMapPress}
        >
          {selectedSpot && (
            <Marker
              title='Selected Spot'
              coordinate={selectedSpot}
              pinColor='blue'
            />
          )}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
});
