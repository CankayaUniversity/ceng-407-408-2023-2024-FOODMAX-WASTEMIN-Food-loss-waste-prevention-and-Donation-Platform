import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_FIRESTORE } from '../FirebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import ProductItem from '../components/ProductItem';

export default function StoreDetails({ route }) {
  const { storeId } = route.params;
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      const docRef = doc(FIREBASE_FIRESTORE, 'Store', storeId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStore(docSnap.data());
          fetchProducts(docSnap.data().products);
          setLoading(false);
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
      const productsData = productDocuments.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
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
    <View>
      <Text>Store Name: {store.name}</Text>
      <Text>Store Address: {store.address}</Text>
      {products && (
        <View>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ProductItem product={item} />}
          />
        </View>
      )}
    </View>
  );
}
