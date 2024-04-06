import { View, Button, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../FirebaseConfig';
import FoodItem from '../components/FoodItem';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

function Home({ navigation }) {
  const [foodItems, setFoodItems] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(FIREBASE_FIRESTORE, 'FoodPost')
      );
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        providerId: doc.data().PostFoodProvider,
        ...doc.data(),
      }));
      setFoodItems([...fetchedData]); // Update the state with the newly fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data when screen focuses (navigated back from another screen)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const renderItem = ({ item }) => <FoodItem data={item} navigation={navigation} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={foodItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Button
        onPress={() => navigation.navigate('FoodPost')}
        title='Open Food Post'
      />
      <Button
        onPress={() => navigation.navigate('Details')}
        title='Open Details'
      />
    </View>
  );
}

export default Home;
