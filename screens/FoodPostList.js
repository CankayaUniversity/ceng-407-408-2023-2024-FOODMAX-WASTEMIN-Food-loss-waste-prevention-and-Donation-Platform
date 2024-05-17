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

  const fetchData = async () => {
    try {
      let foodQuery = query(collection(FIREBASE_FIRESTORE, 'FoodPost'));

      if (searchQuery) {
        foodQuery = query(foodQuery, where('PostTitle', '>=', searchQuery));
      }

      const querySnapshot = await getDocs(foodQuery);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoodItems([...fetchedData]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [searchQuery])
  );

  const filterFoodItems = (selectedAllergies) => {
    const filteredItems = foodItems.filter((item) => {
      return selectedAllergies.some((allergy) =>
        item.PostAllergyWarning.includes(allergy)
      );
    });
    setFoodItems(filteredItems);
  };

  const renderItem = ({ item }) => <FoodItem data={item} />;

  return (
    <View>
      <FoodSearch setSearchQuery={setSearchQuery} />
      {/* BLOCKS THE PAGE PLEASE DONT MERGE IT UNLESS IT IS WORKING !! */}
      {/* <AllergyFilter
        selectedAllergies={selectedAllergies}
        setSelectedAllergies={setSelectedAllergies}
        filterFoodItems={filterFoodItems}
      /> */}
      <FlatList
        data={foodItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default FoodPostList;
