import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../constants/colors';

const ProductItem = ({ product }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{product.PostTitle}</Text>
      <Text style={styles.descriptionText}>{product.PostDescription}</Text>
      <Text style={styles.priceText}>${product.PostPrice}</Text>
    </View>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 10,
    backgroundColor: Colors.white,
    gap: 4,
  },
  titleText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: Colors.navy,
  },
  descriptionText: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  priceText: {
    fontWeight: 'bold',
    color: Colors.green,
  },
});
