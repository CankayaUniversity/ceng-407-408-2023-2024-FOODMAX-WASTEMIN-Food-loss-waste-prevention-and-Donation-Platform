import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../FirebaseConfig';
import FoodItem from '../components/FoodItem';
import FoodSearch from '../components/FoodSearch';
import AllergyFilter from '../components/AllergyFilter';

function FoodPostList() {
  const [foodItems, setFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const fetchData = async () => {
    try {
      let foodQuery = query(collection(FIREBASE_FIRESTORE, 'FoodPost'));

      if (searchQuery) {
        foodQuery = query(foodQuery, where('PostTitle', '>=', searchQuery));
      }

      const querySnapshot = await getDocs(foodQuery);
      let fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Selected Allergies:', selectedAllergies);
      console.log('Fetched Data:', fetchedData);

      // Apply allergy filter if selected allergies are present
      if (selectedAllergies.length > 0) {
        fetchedData = fetchedData.filter(item => {
          console.log('Item PostAllergyWarning:', item.PostAllergyWarning); 

          if (Array.isArray(item.PostAllergyWarning)) {
            const matchesAllergies = selectedAllergies.some(allergy => {
            const match = item.PostAllergyWarning.some(warning => warning.toLowerCase() === allergy.toLowerCase());
            console.log(`Checking if ${item.PostAllergyWarning.map(w => w.toLowerCase())} includes ${allergy.toLowerCase()}: ${match}`); 
            return match;
          });
          console.log('Matches Allergies:', matchesAllergies);
          return matchesAllergies;
      }
      return false;
    });
  }

  console.log('Filtered Data:', fetchedData); 

    setFoodItems(fetchedData);
  }catch (error) {
    console.error('Error fetching data:', error);
  }
};

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedAllergies]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [searchQuery, selectedAllergies])
  );

  const handleAllergyWarningPress = (allergy) => {
    setSelectedAllergies(prevAllergies =>
      prevAllergies.includes(allergy)
        ? prevAllergies.filter(item => item !== allergy)
        : [...prevAllergies, allergy]
    );
  };

  const handleApplyFilter = (allergies) => {
    setSelectedAllergies(allergies);
    setIsFilterVisible(false);
  };

  const renderItem = ({ item }) => <FoodItem data={item} />;

  return (
    <View>
      <FoodSearch setSearchQuery={setSearchQuery} setSelectedAllergies={setSelectedAllergies}/>
      <FlatList
        data={foodItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No Food Items Found</Text>} // Add a message for empty list
      />
    </View>
  );
}

export default FoodPostList;
