import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function PlaceList({ placeList }) {
  const navigation = useNavigation();

  const handlePress = (storeId) => {
    navigation.navigate('StoreDetails', { storeId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Found {placeList.length} Places</Text>
      <FlatList
        nestedScrollEnabled={true}
        scrollEnabled={false}
        data={placeList}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.store}
            onPress={() => handlePress(item.id)}
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  store: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    marginTop: 20,
    fontSize: 18,
  },
});
