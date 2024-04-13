import { View, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../FirebaseConfig';
import FoodItem from '../components/FoodItem';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

function FoodPostList() {
  const [foodItems, setFoodItems] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, 'FoodPost')
      );
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoodItems([...fetchedData]); // Update the state with the newly fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const renderItem = ({ item }) => <FoodItem data={item} />;

  return (
    <View>
      <FlatList
        data={foodItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default FoodPostList;
