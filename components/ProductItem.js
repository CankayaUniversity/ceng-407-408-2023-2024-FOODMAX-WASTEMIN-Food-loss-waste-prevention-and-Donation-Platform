import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '../FirebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the FontAwesome icon set

const ProductItem = ({ product }) => {
  const [imageURL, setImageURL] = useState(product.imageUrl);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRatings = async () => {
      if (product && product.imageUrl) {
        setImageURL(product.imageUrl);
      } else {
        console.log('No valid imageUrl found in product:', product);
      }

      if (product && product.id) {
        try {
          const productDocRef = doc(FIREBASE_FIRESTORE, 'FoodPost', product.id);
          const productDoc = await getDoc(productDocRef);
          
          if (productDoc.exists()) {
            const productData = productDoc.data();
            const ratings = productData.ratings || [];
            console.log('Product ratings:', ratings);

            if (Array.isArray(ratings) && ratings.length > 0) {
              const totalRatings = ratings.length;
              const sumRatings = ratings.reduce((sum, rate) => {
                const numericRate = parseFloat(rate);
                return sum + (isNaN(numericRate) ? 0 : numericRate);
              }, 0);
              setAvgRating((sumRatings / totalRatings).toFixed(1));
              setRatingCount(totalRatings);
            } else {
              setAvgRating(0);
              setRatingCount(0);
            }
          } else {
            console.log('No product document found');
          }
        } catch (error) {
          console.error('Error fetching product ratings:', error);
        }
      }
    };

    fetchRatings();
  }, [product]);

  const currentUser = FIREBASE_AUTH.currentUser;

  const isCurrentUserMatched = () => {
    if (!currentUser) {
      console.log('No current user found');
      return false;
    }
    if (!product.PostFoodProvider) {
      console.log('No PostFoodProvider found in product:', product);
      return false;
    }
    console.log('uid: ' + currentUser.uid);
    console.log('quantity: ' + product.PostQuantity);
    console.log('availability: ' + product.PostAvailability);
    console.log('product post provider: ' + product.PostFoodProvider);
    return currentUser && product.PostFoodProvider === currentUser.uid;
  };

  const handleBuy = async () => {
    try {
      navigation.navigate('Buy', { postId: product.id });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again later.');
    }
  };

  if (product.PostQuantity <= 0 || product.PostAvailability === 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageURL }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{product.PostTitle}</Text>
        <Text style={styles.priceText}>${product.PostPrice}</Text>
        <Text style={styles.descriptionText}>{product.PostDescription}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color={Colors.yellow} />
          <Text style={styles.ratingText}>
            {avgRating} ({ratingCount})
          </Text>
        </View>
        {isCurrentUserMatched() ? (
          <Button
            onPress={() =>
              navigation.navigate('FoodPostEdit', { postId: product.id })
            }
            title='Edit Food Post'
          />
        ) : (
          <Button
            onPress={handleBuy}
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: Colors.orange,
    marginLeft: 4,
  },
});
