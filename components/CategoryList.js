import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native';
import CategoryItem from './CategoryItem';

export default function CategoryList({ setSelectedCategory }) {
  const categoryList = [
    {
      id: 1,
      name: 'Restaurant',
      value: 'Restaurant',
      icon: require('../assets/res.png'), 
    },
    {
      id: 2,
      name: 'Cafe',
      value: 'Cafe',
      icon: require('../assets/caf.png'),
    },
    {
      id: 3,
      name: 'Supermarket',
      value: 'Supermarket',
      icon: require('../assets/sup.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text>Select Top Category</Text>
      <FlatList
        data={categoryList}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedCategory(item.value)}>
            <CategoryItem category={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 10,
  },
});
