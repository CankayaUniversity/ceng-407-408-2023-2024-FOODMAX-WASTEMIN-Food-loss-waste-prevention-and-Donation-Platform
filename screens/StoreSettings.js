import { View, Button, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '../FirebaseConfig';

const StoreSettings = () => {
  const navigation = useNavigation();
  const firestore = FIREBASE_FIRESTORE;
  const auth = FIREBASE_AUTH;
  const user = auth.currentUser;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      setLoading(true);
      const storeQuerySnapshot = await getDocs(
        query(
          collection(firestore, 'Store'),
          where('owner', '==', doc(firestore, `users/${user.uid}`))
        )
      );

      if (storeQuerySnapshot.empty) {
        console.log('No store found.');
        setStore(null);
      } else {
        const storeData = storeQuerySnapshot.docs[0].data();
        storeData.id = storeQuerySnapshot.docs[0].id;
        setStore(storeData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setStore(null);
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : store ? (
        <View>
          <Text>My Store</Text>
          <Text>Store name: {store.name}</Text>
          <Text>Store description: {store.description}</Text>
          <Text>Store category: {store.category}</Text>
          <Text>Store address: {store.address}</Text>
        </View>
      ) : (
        <Text>No store information available.</Text>
      )}
      <Button
        onPress={() => navigation.navigate('FoodPost')}
        title='Create a food item'
      />
    </View>
  );
};

export default StoreSettings;
