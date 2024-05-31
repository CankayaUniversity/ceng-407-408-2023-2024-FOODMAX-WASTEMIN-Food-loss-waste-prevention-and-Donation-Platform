import { View, Text, StyleSheet, Image, Alert, ScrollView, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc, arrayUnion, increment, addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '../FirebaseConfig';
import { serverTimestamp } from 'firebase/firestore';
import Colors from '../constants/colors';

const Buy = () => {
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const route = useRoute();
  const { postId, storeName, storeAddress } = route.params;

  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    console.log('Route params:', route.params);
    console.log('Store Name:', storeName);
    console.log('Store Address:', storeAddress);

    const fetchProductDetails = async () => {
      try {
        const productRef = doc(FIREBASE_FIRESTORE, 'FoodPost', postId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data();
          setProduct(productData);

          if (productData.PostPhotos && productData.PostPhotos.length > 0) {
            const storage = getStorage();
            const imageRef = ref(storage, productData.PostPhotos[0]);
            const downloadURL = await getDownloadURL(imageRef);
            setImageUrl(downloadURL);
          }
        } else {
          Alert.alert('Error', 'Product not found');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        Alert.alert('Error', 'Failed to fetch product details. Please try again later.');
      }
    };

    fetchProductDetails();
  }, [postId]);

  const handleBuyNow = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to purchase products');
      return;
    }

    try {
      const productRef = doc(FIREBASE_FIRESTORE, 'FoodPost', postId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const productData = productSnap.data();
        let postQuantity = productData.PostQuantity;

        console.log('PostQuantity before conversion:', postQuantity);
        console.log('Type of PostQuantity before conversion:', typeof postQuantity);

        if (typeof postQuantity === 'string') {
          postQuantity = parseInt(postQuantity, 10);
        }

        console.log('PostQuantity after conversion:', postQuantity);

        if (typeof postQuantity === 'number') {
          if (postQuantity > 0) {
            const userRef = doc(FIREBASE_FIRESTORE, 'users', currentUser.uid);
            await updateDoc(userRef, {
              purchasedProducts: arrayUnion(postId),
              rewardPoint: increment(5),
            });

            const newQuantity = postQuantity - 1;
            await updateDoc(productRef, {
              PostQuantity: newQuantity,
            });

            const ordersCollectionRef = collection(FIREBASE_FIRESTORE, 'Orders');
            await addDoc(ordersCollectionRef, {
              userId: currentUser.uid,
              postId: postId,  // Use postId directly instead of productData.id
              time: serverTimestamp(),
            });

            Alert.alert('Success', 'Product purchased successfully');
          } else {
            console.log('Product is out of stock');
            Alert.alert('Error', 'Product is out of stock');
          }
        } else {
          console.log('PostQuantity is not a valid number:', postQuantity);
          Alert.alert('Error', 'Product quantity is not properly set');
        }
      } else {
        Alert.alert('Error', 'Product document does not exist');
      }
    } catch (error) {
      console.error('Error purchasing product:', error);
      Alert.alert('Error', 'Failed to purchase product. Please try again later.');
    }
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{product.PostTitle}</Text>
          <Text style={styles.priceText}>${product.PostPrice}</Text>
          <Text style={styles.descriptionText}>{product.PostDescription}</Text>
          <Text style={styles.additionalText}>Food Type: {product.PostFoodType}</Text>
          <Text style={styles.additionalText}>Provider: {product.PostFoodProvider}</Text>
          <Text style={styles.additionalText}>Store Name: {storeName}</Text>
          <Text style={styles.additionalText}>Store Address: {storeAddress}</Text>
          <Button title="Buy Now" onPress={handleBuyNow} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Buy;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
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
  additionalText: {
    fontSize: 14,
    color: Colors.black,
    textAlign: 'left',
    marginTop: 4,
  },
});
