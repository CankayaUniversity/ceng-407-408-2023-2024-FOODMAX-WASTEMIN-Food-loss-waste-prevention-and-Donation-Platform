import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '../FirebaseConfig';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Rating } from 'react-native-ratings';
import Colors from '../constants/colors';

const RatingScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [rating, setRating] = useState(0);
  const currentUser = FIREBASE_AUTH.currentUser;

  const submitRating = async () => {
    try {
      const productDocRef = doc(FIREBASE_FIRESTORE, 'FoodPost', productId);
      const userDocRef = doc(FIREBASE_FIRESTORE, 'users', currentUser.uid);

      // Append the new rating to the product's ratings array
      await updateDoc(productDocRef, {
        ratings: arrayUnion(rating),
      });

      // Append the productId to the user's ratedProducts array
      await updateDoc(userDocRef, {
        ratedProducts: arrayUnion(productId),
      });

      Alert.alert('Success', 'Thank you for rating!');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate this Product</Text>
      <Rating
        showRating
        onFinishRating={setRating}
        style={styles.rating}
      />
      <Button title="Submit Rating" onPress={submitRating} />
    </View>
  );
};

export default RatingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.navy,
    marginBottom: 20,
  },
  rating: {
    paddingVertical: 10,
  },
});
