import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../constants/colors';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const ProductItem2 = ({ product }) => {
  const [imageURL, setImageURL] = useState('empty');
  const [productData, setProductData] = useState(null);
  const [isRated, setIsRated] = useState(false);
  const [isCommented, setIsCommented] = useState(false);
  const storage = getStorage();
  const navigation = useNavigation();
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productDocRef = doc(FIREBASE_FIRESTORE, 'FoodPost', product);
        const productDoc = await getDoc(productDocRef);
        if (productDoc.exists()) {
          const data = productDoc.data();
          setProductData(data);
          if (data.PostPhotos && data.PostPhotos.length > 0) {
            const imageRef = ref(storage, data.PostPhotos[0]);
            const downloadURL = await getDownloadURL(imageRef);
            setImageURL(downloadURL);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        Alert.alert('Error', 'Failed to fetch product data. Please try again later.');
      }
    };

    const checkIfRatedOrCommented = async () => {
      try {
        const userDocRef = doc(FIREBASE_FIRESTORE, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsRated(userData.ratedProducts && userData.ratedProducts.includes(product));
          setIsCommented(userData.commentedProducts && userData.commentedProducts.includes(product));
        }
      } catch (error) {
        console.error('Error checking if product is rated or commented:', error);
      }
    };

    if (product) {
      fetchProductData();
      checkIfRatedOrCommented();
    }
  }, [product, storage, currentUser]);

  const handleRatePress = () => {
    if (isRated) {
      Alert.alert('Error', 'You have already rated this product.');
    } else {
      navigation.navigate('RatingScreen', { productId: product });
    }
  };

  const handleCommentPress = () => {
    if (isCommented) {
      Alert.alert('Error', 'You have already commented on this product.');
    } else {
      navigation.navigate('CommentScreen', { productId: product });
    }
  };

  if (!productData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageURL }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{productData.PostTitle}</Text>
        <Text style={styles.priceText}>${productData.PostPrice}</Text>
        <Text style={styles.descriptionText}>{productData.PostDescription}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleRatePress}
          >
            <Text style={styles.buttonText}>Rate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button]}
            onPress={handleCommentPress}
          >
            <Text style={styles.buttonText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductItem2;

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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.navy,
    borderRadius: 5,
    alignItems: 'center',
  },
  commentButton: {
    backgroundColor: Colors.orange,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
