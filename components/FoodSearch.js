import React, { useState } from 'react';
import { TextInput, Button, View, FlatList, Text, StyleSheet, Image } from 'react-native';
import { collection, query, where, getDocs, doc } from 'firebase/firestore'; // Import Firestore methods
import { FIREBASE_FIRESTORE, FIREBASE_AUTH, db } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const auth = FIREBASE_AUTH;

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

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
                  onPress={() => {
                    handleBuy(item.id)
                  }}
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
