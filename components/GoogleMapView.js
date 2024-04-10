import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { UserLocationContext } from '../src/context/UserLocationContext';

export default function GoogleMapView() {
  const { location, setLocation } = useContext(UserLocationContext);
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
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.mapView}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={mapRegion}
        />
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
