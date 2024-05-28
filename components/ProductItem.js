import { View, Text, StyleSheet, Image, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_STORAGE, FIREBASE_AUTH } from '../FirebaseConfig';

const auth = FIREBASE_AUTH;

const ProductItem = ({ product }) => {
  const [imageURL, setImageURL] = useState(product.imageUrl);
  const navigation = useNavigation();

  useEffect(() => {
    if (product && product.imageUrl) {
      setImageURL(product.imageUrl);
    } else {
      console.log('No valid imageUrl found in product:', product);
    }
  }, [product]);

  const currentUser = auth.currentUser;

  const isCurrentUserMatched = () => {
    console.log('uid: ' + currentUser.uid);
    console.log('product post provider: ' + product.PostFoodProvider);
    return currentUser && product.PostFoodProvider === currentUser.uid;
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
      <Image source={{ uri: imageURL }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{product.PostTitle}</Text>
        <Text style={styles.priceText}>${product.PostPrice}</Text>
        <Text style={styles.descriptionText}>{product.PostDescription}</Text>
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

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    marginVertical: 4,
    borderRadius: 10,
    backgroundColor: Colors.white,
    gap: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
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
