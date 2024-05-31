import { View, Text, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../constants/colors';
import {  doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FIREBASE_FIRESTORE } from '../FirebaseConfig';

const ProductItem2 = ({ product }) => {
  const [imageURL, setImageURL] = useState('empty');
  const [productData, setProductData] = useState(null);
  const storage = getStorage();

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

    if (product) {
      fetchProductData();
    }
  }, [product, storage]);



  if (!productData ) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={{ uri: imageURL }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{productData.PostTitle}</Text>
          <Text style={styles.priceText}>${productData.PostPrice}</Text>
          <Text style={styles.descriptionText}>{productData.PostDescription}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductItem2;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 8,
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
});
