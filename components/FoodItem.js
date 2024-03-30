import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getDownloadURL, ref } from 'firebase/storage'; 
import { FIREBASE_STORAGE } from '../FirebaseConfig'; // Assuming FIREBASE_STORAGE contains your Firebase Storage instance

const FoodItem = ({ data }) => {
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    if (data.PostPhotos) {
      let imagePath = data.PostPhotos;
      if (Array.isArray(data.PostPhotos)) {
        // If data.PostPhotos is an array, use the first element
        imagePath = data.PostPhotos[0];
      }
      const imageRef = ref(FIREBASE_STORAGE, imagePath);
      getDownloadURL(imageRef)
        .then((url) => {
          setImageURL(url);
        })
        .catch((error) => {
          console.error('Error getting download URL:', error);
          setImageURL(null); // Reset imageURL to null if download fails
        });
    }
  }, [data.PostPhotos]);
  
  

  return (
    <View style={styles.container}>
      {imageURL && (
        <Image source={{ uri: imageURL }} style={styles.image} />
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
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 10,
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
  },
  price: {
    fontSize: 16,
    marginTop: 5,
  },
  quantity: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default FoodItem;
