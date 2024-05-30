import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_FIRESTORE, FIREBASE_STORAGE } from '../FirebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import ProductItem from '../components/ProductItem';
import { useNavigation } from '@react-navigation/native';

export default function StoreDetails({ route }) {
  const { storeId } = route.params;
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStore = async () => {
      const docRef = doc(FIREBASE_FIRESTORE, 'Store', storeId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const storeData = docSnap.data();
          setStore(storeData);
          console.log('Store data:', storeData);  // Log store data
          fetchProducts(storeData.products);
        } else {
          console.log('No such document!');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching store:', error);
        setLoading(false);
      }
    };

    fetchStore();
  }, [storeId]);

  const fetchProducts = async (productRefs) => {
    try {
      const productFetchPromises = productRefs.map((productRef) =>
        getDoc(productRef)
      );
      const productDocuments = await Promise.all(productFetchPromises);
      const productsData = await Promise.all(productDocuments.map(async (doc) => {
        const data = doc.data();
        const imageUrl = await getDownloadURL(ref(FIREBASE_STORAGE, data.PostPhotos[0]));
        return {
          id: doc.id,
          ...data,
          imageUrl,
        };
      }));
      console.log('Fetched products data:', productsData);  // Log product data
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (productId) => {
    if (store) {
      console.log('Navigating with:', {
        postId: productId,
        storeName: store.name,
        storeAddress: store.address,
      });
      navigation.navigate('Buy', {
        postId: productId,
        storeName: store.name,
        storeAddress: store.address,
      });
    } else {
      console.log('Store data not available for navigation');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!store) {
    return (
      <View>
        <Text>No store data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.storeName}>Store Name: {store.name}</Text>
      <Text style={styles.storeAddress}>Store Address: {store.address}</Text>
      {products && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductItem product={item} onPress={() => handleProductPress(item.id)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  storeAddress: {
    fontSize: 16,
    marginVertical: 8,
  },
});
