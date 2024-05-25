import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, FlatList, Text, StyleSheet, Image } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import AllergyFilter from './AllergyFilter'; 
import { FIREBASE_FIRESTORE } from '../FirebaseConfig'; 

const FoodSearch = ({ setSearchQuery, setSelectedAllergies }) => {
  const [searchInput, setSearchInput] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false); 
  const [localSelectedAllergies, setLocalSelectedAllergies] = useState([]);

  useEffect(() => {
    setSearchQuery(searchInput);
  }, [searchInput, setSearchQuery]); 

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible); 
  };

  const handleApplyFilter = (allergies) => {
    setLocalSelectedAllergies(allergies);
    setSelectedAllergies(allergies);
    toggleFilterModal(); // Close the modal after applying the filter
  };

  const handleAllergyWarningPress = (allergy) => {
    if (localSelectedAllergies.includes(allergy)) {
      setLocalSelectedAllergies(localSelectedAllergies.filter((item) => item !== allergy));
    } else {
      setLocalSelectedAllergies([...localSelectedAllergies, allergy]);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Search by title..."
        value={searchInput}
        onChangeText={(text) => setSearchInput(text)}
      />
      <Button title="Search" onPress={() => setSearchQuery(searchInput)} />
      <Button title="Filter" onPress={toggleFilterModal} />
      {filterModalVisible && (
        <AllergyFilter
          visible={filterModalVisible}
          onClose={toggleFilterModal}
          onApplyFilter={handleApplyFilter}
          selectedAllergies={localSelectedAllergies}
          handleAllergyWarningPress={handleAllergyWarningPress}
        />
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
  price: {
    fontSize: 16,
    marginTop: 5,
  },
  quantity: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default FoodSearch;
