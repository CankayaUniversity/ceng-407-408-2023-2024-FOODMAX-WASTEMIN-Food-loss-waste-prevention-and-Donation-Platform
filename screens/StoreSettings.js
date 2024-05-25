import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE, FIREBASE_AUTH, FIREBASE_STORAGE } from '../FirebaseConfig';
import { ref, deleteObject } from 'firebase/storage';
import Colors from '../constants/colors';
import ProductItem from '../components/ProductItem';

const StoreSettings = () => {
  const navigation = useNavigation();
  const firestore = FIREBASE_FIRESTORE;
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchStore();
    }, [])
  );

  const fetchStore = async () => {
    setLoading(true);
    try {
      const storeQuerySnapshot = await getDocs(
        query(
          collection(firestore, 'Store'),
          where('owner', '==', doc(firestore, `users/${user.uid}`))
        )
      );

      if (storeQuerySnapshot.empty) {
        console.log('No store found.');
        setStore(null);
        setProducts([]);
      } else {
        const storeData = storeQuerySnapshot.docs[0].data();
        storeData.id = storeQuerySnapshot.docs[0].id;
        setStore(storeData);
        fetchProducts(storeData.products);
      }
    } catch (error) {
      console.error('Error fetching store:', error);
      setStore(null);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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

  const deleteStore = async () => { // must also delete all foodposts of the store.
    try {
      const uid = user.uid;
      const storeDocRef = doc(firestore, 'Store', store.id);

      // Delete store logo 
      if (store.logo) {
        const fileName = store.logo.substring(store.logo.lastIndexOf('%2F') + 3, store.logo.lastIndexOf('?'));
        const storageRef = ref(FIREBASE_STORAGE, 'logos/' + fileName);

        try {
          await deleteObject(storageRef);
          console.log('Store logo deleted successfully');
        } catch (error) {
          if (error.code === 'storage/object-not-found') {
            console.warn('Store logo not found in storage, skipping deletion');
          } else {
            throw error; 
          }
        }
      }

      await deleteDoc(storeDocRef);
      console.log('Store deleted successfully');

      
      setStore(null);
      setProducts([]);
    } catch (error) {
      console.error('Error deleting store:', error);
      Alert.alert('Error', 'Failed to delete store');
    }
  };

  const confirmDeleteStore = () => {
    Alert.alert(
      'Delete Store',
      'Are you sure you want to delete your store? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteStore },
      ]
    );
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : store ? (
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={{
              uri: store.logo,
            }}
          />
          <View style={styles.containertext}>
            <Text style={styles.destext}>
              Store name: <Text style={styles.text}>{store.name}</Text>
            </Text>
            <Text style={styles.destext}>
              Store description: <Text style={styles.text}>{store.description}</Text>
            </Text>
            <Text style={styles.destext}>
              Store category: <Text style={styles.text}>{store.category}</Text>
            </Text>
            <Text style={styles.destext}>
              Store address: <Text style={styles.text}>{store.address}</Text>
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => navigation.navigate('StoreSettingsEdit', { storeId: store.id })}
              title="Update Store Settings"
            />
          </View>

          <Text style={styles.titleText}>Available products</Text>
          {products && (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ProductItem product={item} />}
            />
          )}
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => navigation.navigate('FoodPost', { storeId: store.id })}
              title="Create a new food item"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Delete Store"
              onPress={confirmDeleteStore}
              color="red"
            />
          </View>
        </View>
      ) : (
        <Text>No store information available.</Text>
      )}
    </View>
  );
};

export default StoreSettings;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 8,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 10,
  },
  containertext: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    gap: 8,
  },
  titleText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: Colors.navy,
  },
  destext: {
    fontWeight: 'bold',
    color: Colors.navy,
  },
  text: {
    fontWeight: 'normal',
    color: Colors.black,
  },
  logo: {
    width: 100,
    height: 100,
  },
});
