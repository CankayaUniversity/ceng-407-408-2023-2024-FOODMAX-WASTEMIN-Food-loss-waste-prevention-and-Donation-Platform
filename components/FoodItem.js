import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { getDownloadURL, ref } from 'firebase/storage'; 
import { FIREBASE_STORAGE,FIREBASE_AUTH } from '../FirebaseConfig'; // Assuming FIREBASE_STORAGE contains your Firebase Storage instance

const auth = FIREBASE_AUTH;

const FoodItem = ({ data , navigation}) => {
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
  
  const currentUser = auth.currentUser;

  const isCurrentUserMatched = () => {
    return currentUser && data.PostFoodProvider === currentUser.uid;
  };

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
        {isCurrentUserMatched() && (
          <Button
            onPress={() => navigation.navigate('FoodPostEdit', { postId: data.id })}
            title='Edit Food Post'
          />
        )}
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
