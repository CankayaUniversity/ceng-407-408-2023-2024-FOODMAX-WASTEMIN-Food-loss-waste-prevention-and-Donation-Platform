import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { SIZES } from '../constants/sizes';
import Colors from '../constants/colors';

const CategoryItem = ({ category }) => {
  return (
    <View style={styles.container}>
      <Image source={category.icon} style={styles.icon} />
      <Text style={styles.iconLabel}>{category.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (SIZES.width - 64) / 3,
    height: 100,
    padding: 4,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  icon: {
    width: 70,
    height: 70,
  },
  iconLabel: {
    fontSize: 12,
  },
});

export default CategoryItem;
