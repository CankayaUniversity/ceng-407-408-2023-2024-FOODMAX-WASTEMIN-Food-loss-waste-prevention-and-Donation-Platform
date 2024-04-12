import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/colors';

const API_KEY = `${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;

export default function PlaceItem({ place }) {
  return (
    <View style={styles.container}>
      {place?.photos ? (
        <Image
          style={styles.image}
          source={{
            uri:
              'https://maps.googleapis.com/maps/api/place/photo' +
              '?maxwidth=400' +
              '&photo_reference=' +
              place?.photos[0]?.photo_reference +
              '&key=' +
              API_KEY,
          }}
        />
      ) : (
        <Image
          source={require('../assets/placeholder.jpg')}
          style={styles.image}
        />
      )}
      <View style={styles.rightContainer}>
        <Text>{place.name}</Text>
        <Text numberOfLines={2}>{place.vicinity}</Text>
        <View style={styles.rating}>
          <AntDesign name='star' size={20} color={Colors.yellow} />
          <Text>{place.rating}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  rightContainer: {
    flex: 1,
  },
  image: {
    width: 120,
    height: 120,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
