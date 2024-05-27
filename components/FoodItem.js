import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { getDownloadURL, ref } from 'firebase/storage';
import { FIREBASE_STORAGE, FIREBASE_AUTH } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const auth = FIREBASE_AUTH;

const FoodItem = ({ data }) => {
  const navigation = useNavigation();
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
          setImageURL(null);
        });
    }
  }, [data.PostPhotos]);

  const currentUser = auth.currentUser;

  const isCurrentUserMatched = () => {
    return currentUser && data.PostFoodProvider === currentUser.uid;
  };

  const handleBuy = async () => {
    try {
      // Create a new order document
      const orderRef = doc(db, 'Orders');
      await setDoc(orderRef, {
        userId: currentUser.uid,
        postId: data.id,
        // Add any other relevant data to the order
      });

      // You can also update the inventory or do other actions here

      Alert.alert('Success', 'Order placed successfully.');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {imageURL && <Image source={{ uri: imageURL }} style={styles.image} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{data.PostTitle}</Text>
        <Text style={styles.description}>{data.PostDescription}</Text>
        <Text style={styles.price}>Price: ${data.PostPrice}</Text>
        <Text style={styles.quantity}>Quantity: {data.PostQuantity}</Text>
        {data.PostFoodType && <Text style={styles.foodType}>Type: {data.PostFoodType}</Text>}
        {isCurrentUserMatched() ? (
          <Button
            onPress={() =>
              navigation.navigate('FoodPostEdit', { postId: data.id })
            }
            title='Edit Food Post'
          />
        ) : (
          <Button
            onPress={() => {
              handleBuy;
            }}
            title='Buy'
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
