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
import ProductItem from '../components/ProductItem';
import React, { useCallback, useState, useEffect } from 'react';
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
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import Colors from '../constants/colors';

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
      const productsData = await Promise.all(productDocuments.map(async (doc) => {
        const data = doc.data();
        const imageUrl = await getDownloadURL(ref(FIREBASE_STORAGE, data.PostPhotos[0]));
        return {
          id: doc.id,
          PostTitle: data.PostTitle,
          PostPrice: data.PostPrice,
          imageUrl,
        };
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const deleteStore = async () => {
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

      // Delete food posts associated with the store
      const foodPostsQuerySnapshot = await getDocs(
        query(
          collection(firestore, 'FoodPosts'),
          where('storeId', '==', store.id)
        )
      );

      const deleteFoodPostPromises = foodPostsQuerySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteFoodPostPromises);

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

  const renderHeader = () => (
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
      <Text style={styles.titleText}>Available products</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : store ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductItem product={item} />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
        />
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
    marginBottom: 1,
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
    marginBottom: 10,
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
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  productPrice: {
    fontSize: 14,
    color: Colors.navy,
  },
});
