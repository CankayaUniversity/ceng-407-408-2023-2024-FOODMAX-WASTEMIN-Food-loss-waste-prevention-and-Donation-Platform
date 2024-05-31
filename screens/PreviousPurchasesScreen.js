import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import ProductItem2 from '../components/ProductItem2'; // Updated the import statement
import Colors from '../constants/colors';

const PreviousPurchasesScreen = () => {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'No current user found.');
      return;
    }
  
    const fetchPurchasedItems = async () => {
      try {
        const userDocRef = doc(FIREBASE_FIRESTORE, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPurchasedItems(data.purchasedProducts || []);
        } else {
          Alert.alert('Error', 'No user data found.');
        }
      } catch (error) {
        console.error('Error fetching purchased items:', error);
        Alert.alert('Error', 'Failed to fetch purchased items. Please try again later.');
      }
    };
  
    fetchPurchasedItems();
  }, [currentUser]);
  

  const renderProductItem = ({ item }) => {
    if (!item) {
      console.log('Item is undefined');
      return null;
    }
  
    console.log('Item id is undefined:', item);  
    return <ProductItem2 product={item} />;
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previous Purchases</Text>
      <FlatList
        data={purchasedItems}
        renderItem={renderProductItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No previous purchases found.</Text>}
      />
    </View>
  );
};

export default PreviousPurchasesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.navy,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginTop: 20,
  },
});
