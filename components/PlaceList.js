import { View, Text, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import PlaceItem from './PlaceItem';

export default function PlaceList({ placeList }) {
  return (
    <View style={styles.container}>
      <Text>Found {placeList.length} Places</Text>
      <FlatList
        nestedScrollEnabled={true}
        scrollEnabled={false}
        data={placeList}
        renderItem={({ item }) => <PlaceItem place={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});
