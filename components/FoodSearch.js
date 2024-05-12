import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, FlatList, Text, StyleSheet, Image, Alert } from 'react-native';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage'; // Import storage methods
import { FIREBASE_FIRESTORE, FIREBASE_AUTH, db, FIREBASE_STORAGE } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const auth = FIREBASE_AUTH;

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    searchFoodPosts();
  }, []); // Automatically search on initial render

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
  
      if (fetchedData.length > 0) {
        const firstPost = fetchedData[0]; // Get the first post from the search results
        const imageURL = await getImageURL(firstPost.PostPhotos); // Fetch the image URL for the first post
  
        const postWithImage = { ...firstPost, imageURL }; // Add imageURL to the post object
  
        setSearchResults([postWithImage]); // Set search results with the post containing the image
      } else {
        setSearchResults([]); // No search results found
      }
    } catch (error) {
      console.error('Error searching food posts:', error);
    }
  };
  
  const getImageURL = async (imagePath) => {
    try {
      console.log('Image Path:', imagePath);
  
      // Check if imagePath is an array and select the first element
      const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;
  
      if (!path) {
        console.log('Image path is not defined');
        return null;
      }
  
      const imageRef = ref(FIREBASE_STORAGE, path);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };
  
  const currentUser = auth.currentUser;

  const isCurrentUserMatched = (postFoodProvider) => {
    return currentUser && postFoodProvider === currentUser.uid;
  };

  const handleBuy = async (postId) => {
    try {
      const orderRef = doc(db, 'Orders');
      await setDoc(orderRef, {
        userId: currentUser.uid,
        postId: postId,
      });

      Alert.alert('Success', 'Order placed successfully.');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again later.');
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
          <View style={styles.container}>
            {item.imageURL && <Image source={{ uri: item.imageURL }} style={styles.image} />}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.PostTitle}</Text>
              <Text style={styles.description}>{item.PostDescription}</Text>
              <Text style={styles.price}>Price: ${item.PostPrice}</Text>
              <Text style={styles.quantity}>Quantity: {item.PostQuantity}</Text>
              {isCurrentUserMatched(item.PostFoodProvider) ? (
                <Button
                  onPress={() =>
                    navigation.navigate('FoodPostEdit', { postId: item.id })
                  }
                  title='Edit Food Post'
                />
              ) : (
                <Button
                  onPress={() => handleBuy(item.id)}
                  title='Buy'
                />
              )}
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
