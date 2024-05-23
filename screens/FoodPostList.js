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
      console.log("Fetching data...");
      let foodQuery = collection(FIREBASE_FIRESTORE, 'FoodPost');

      if (searchQuery) {
        foodQuery = query(foodQuery, where('PostTitle', '>=', searchQuery));
      }

      const querySnapshot = await getDocs(foodQuery);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      console.log("Number of fetched items:", fetchedData.length);
      console.log("Fetched Data:", fetchedData);

      let filteredItems = fetchedData;

      // Apply allergy filter if selected allergies are present
      if (selectedAllergies.length > 0) {
        filteredItems = fetchedData.filter(item =>
          selectedAllergies.some(allergy => item.PostAllergyWarning.includes(allergy))
        );
      }
      console.log("Filtered Items:", filteredItems);
      setFoodItems(filteredItems.length > 0 ? filteredItems : fetchedData);
    } catch (error) {
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

  const renderItem = ({ item }) => <FoodItem data={item} />;

  return (
    <View>
      <FoodSearch setSearchQuery={setSearchQuery} />
      { <AllergyFilter
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        selectedAllergies={selectedAllergies}
        handleAllergyWarningPress={handleAllergyWarningPress}
      /> }
      <FlatList
        data={foodItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default FoodPostList;
