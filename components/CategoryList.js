import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native';
import CategoryItem from './CategoryItem';

export default function CategoryList({ setSelectedCategory }) {
  const categoryList = [
    {
      id: 1,
      name: 'Restaurant',
      value: 'restaurant',
      icon: require('../assets/cafe.png'),
    },
    {
      id: 2,
      name: 'Cafe',
      value: 'cafe',
      icon: require('../assets/cafe.png'),
    },
    {
      id: 3,
      name: 'Supermarket',
      value: 'supermarket',
      icon: require('../assets/cafe.png'),
    },
  ];
  return (
    <View style={styles.container}>
      <Text>Select Top Category</Text>
      <FlatList
        data={categoryList}
        key={categoryList.value}
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
