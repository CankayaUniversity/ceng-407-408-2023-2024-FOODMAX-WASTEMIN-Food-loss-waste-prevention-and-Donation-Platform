import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, FlatList, Text, StyleSheet, Image } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import AllergyFilter from './AllergyFilter'; 
import { FIREBASE_FIRESTORE } from '../FirebaseConfig'; 

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false); 
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  useEffect(() => {
    searchFoodPosts();
  }, []); 

  const searchFoodPosts = async () => {
    try {
      let foodQuery = query(
        collection(FIREBASE_FIRESTORE, 'FoodPost'),
        where('PostTitle', '>=', searchQuery),
        where('PostTitle', '<=', searchQuery + '\uf8ff')
      );
  
      if (selectedAllergies.length > 0) {
        foodQuery = query(foodQuery, where('allergyWarnings', 'array-contains-any', selectedAllergies));
      }
  
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

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible); 
  };
  
  const handleApplyFilter = () => {
    //searchFoodPosts();
    console.log("Current value of filterModalVisible:", filterModalVisible);
    toggleFilterModal();
  };

  const handleAllergyWarningPress = (allergy) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((item) => item !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
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
      <Button title="Filter" onPress={toggleFilterModal} />
      {filterModalVisible && (
        <AllergyFilter
          visible={filterModalVisible}
          onClose={toggleFilterModal}
          onApplyFilter={handleApplyFilter}
          selectedAllergies={selectedAllergies}
          handleAllergyWarningPress={handleAllergyWarningPress}
        />
      )}
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Image source={{ uri: item.imageURL }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.PostTitle}</Text>
              <Text style={styles.description}>{item.PostDescription}</Text>
              <Text style={styles.price}>Price: ${item.PostPrice}</Text>
              <Text style={styles.quantity}>Quantity: {item.PostQuantity}</Text>
              <Button
                onPress={() => navigation.navigate('FoodPostEdit', { postId: item.id })}
                title="Edit Food Post"
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
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
