import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from 'react-native';

export default function Recommendation2() {
  const [allergyWarning, setAllergyWarning] = useState('');
  const [foodProvider, setFoodProvider] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recommendations, setRecommendations] = useState(null);
//USE your ıp adress(localhost)
//port number : 5000
  const handleRecommend = async () => {
    try {
      const response = await fetch(`http://192.168.1.4:5000/recommendations?PostAllergyWarning=${allergyWarning}&PostFoodProvider=${foodProvider}&PostDescription=${description}&PostPrice=${price}&PostQuantity=${quantity}`);
      const responseText = await response.text(); 
      console.log(responseText); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = JSON.parse(responseText); 
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Network request failed:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Button title="RECOMMEND IT FOR YOU" onPress={handleRecommend} />
      {recommendations && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Recommended Meals:</Text>
          {recommendations.map((item, index) => (
            <View key={index} style={styles.featureContainer}>
              <Text>Document ID: {item.DocumentID}</Text>
              <Text>Title: {item.PostTitle}</Text>
              <Text>Allergy Warning: {item.PostAllergyWarning}</Text>
              <Text>Date: {item.PostDate}</Text>
              <Text>Description: {item.PostDescription}</Text>
              <Text>Expiry: {item.PostExpiry}</Text>
              <Text>Food Provider: {item.PostFoodProvider}</Text>
              <Text>Food Type: {item.PostFoodType}</Text>
              <Text>Photos: {item.PostPhotos}</Text>
              <Text>Price: {item.PostPrice}</Text>
              <Text>Quantity: {item.PostQuantity}</Text>
              <Text>Post ID: {item.PostId}</Text>
                <View style={styles.butt}>
                <Button title='Buy' onPress={() => console.log('Buy button pressed')} />
                </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  resultContainer: {
    marginTop: 20,
    width: '100%',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  featureContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  butt:{
    marginTop: 20,
    marginBottom: 40,
    marginLeft: 90,
    marginRight: 10,
    width: '40%',
  }
});
