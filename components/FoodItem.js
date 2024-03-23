import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const FoodItem = ({ data }) => {
  const imageSource = data.PostPhotos.length > 0 ? data.PostPhotos[0] : null;

  return (
    <View style={styles.container}>
      {imageSource && (
        <Image source={{ uri: imageSource }} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{data.PostTitle}</Text>
        <Text style={styles.description}>{data.PostDescription}</Text>
        <Text style={styles.price}>Price: ${data.PostPrice}</Text>
        <Text style={styles.quantity}>Quantity: {data.PostQuantity}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    marginTop: 8,
  },
  quantity: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default FoodItem;
