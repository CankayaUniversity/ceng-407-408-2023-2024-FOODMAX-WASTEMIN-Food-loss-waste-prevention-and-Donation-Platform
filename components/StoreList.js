import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchStores = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, 'Store')
      );
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStores(fetchedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handlePress = (storeId) => {
    navigation.navigate('StoreDetails', { storeId });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <ScrollView>
      <Text style={styles.title}>Top Stores</Text>
      {stores.map((store) => (
        <TouchableOpacity
          key={store.id}
          style={styles.store}
          onPress={() => handlePress(store.id)}
        >
          <Text style={{ fontSize: 18 }}>{store.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  store: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    marginTop: 20,
  },
});
