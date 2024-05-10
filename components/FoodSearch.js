import React, { useState } from 'react';
import { TextInput, Button, View, FlatList, Text } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { FIREBASE_FIRESTORE } from '../FirebaseConfig'; // Import your Firebase configuration

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchFoodPosts = async () => {
    try {
      const foodQuery = query(
        collection(FIREBASE_FIRESTORE, 'FoodPost'),
        where('PostTitle', '>=', searchQuery),
        where('PostTitle', '<=', searchQuery + '\uf8ff')
      );
  
      const querySnapshot = await getDocs(foodQuery);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setSearchResults(fetchedData);
    } catch (error) {
      console.error('Error searching food posts:', error);
    }
  };  

  return (
    <View>
      <TextInput
        placeholder="Search by title..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Button title="Search" onPress={searchFoodPosts} />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <View>
            <Text>{item.PostTitle}</Text>
            <Text>{item.PostDescription}</Text>
            <Text>{item.PostPrice}</Text>
            <Text>{item.PostQuantity}</Text>

          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default FoodSearch;
