import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView, StyleSheet, Image } from 'react-native';

export default function Recommendation2() {
  const [allergyWarning, setAllergyWarning] = useState('');
  const [foodProvider, setFoodProvider] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  // USE your IP address 
  // Port number: 5000
  const handleRecommend = async () => {
    try {
      const response = await fetch(`http://192.168.1.4:5000/recommendations?PostAllergyWarning=${allergyWarning}&PostFoodProvider=${foodProvider}&PostDescription=${description}&PostPrice=${price}&PostQuantity=${quantity}`);
      const responseText = await response.text(); 
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
      <Button title="RECOMMEND IT FOR YOU" onPress={handleRecommend} color="#1c8aff"/>
      {recommendations && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Recommended Meals</Text>
          {recommendations.map((item, index) => {
            const baseURL = 'https://firebasestorage.googleapis.com/v0/b/nourish-me-8e6b6.appspot.com/o/';
            return (
              <View key={index} style={styles.featureContainer}>
                <Text style={styles.featureTitle}>{item.PostTitle}</Text>
                <Text style={styles.featureText}><Text style={styles.boldText}>Allergy Warning:</Text> {item.PostAllergyWarning}</Text>
                <Text style={styles.featureText}><Text style={styles.boldText}>Date:</Text> {item.PostDate}</Text>
                <Text style={styles.featureText}><Text style={styles.boldText}>Description:</Text> {item.PostDescription}</Text>
                <Text style={styles.featureText}><Text style={styles.boldText}>Expiry:</Text> {item.PostExpiry}</Text>
                <Text style={styles.featureText}><Text style={styles.boldText}>Food Type:</Text> {item.PostFoodType}</Text>
                {item.PostPhotos && Array.isArray(item.PostPhotos) && item.PostPhotos.length > 0 ? (
                  <View style={styles.photosContainer}>
                    {item.PostPhotos.map((photo, index) => {
                      const imagePath = photo.replace(/\//g, '%2F'); 
                      const fullURL = `${baseURL}${imagePath}?alt=media`;
                      return (
                        <Image 
                          key={index} 
                          source={{ uri: fullURL }} 
                          style={styles.photo}
                          onError={(e) => console.error('Image loading error:', e.nativeEvent.error)}
                        />
                      );
                    })}
                  </View>
                ) : (
                  <Text style={styles.noPhotosText}>No photos available</Text>
                )}
                <Text style={styles.featureText}><Text style={styles.boldText}>Price:</Text> {item.PostPrice} $</Text>
                <Text style={styles.featureText}><Text style={styles.boldText}>Quantity:</Text> {item.PostQuantity}</Text>
                <View style={styles.buyButtonContainer}>
                  <Button title='Buy' onPress={() => console.log('Buy button pressed')} color="#1c8aff"/>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 20,
    width: '100%',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  featureContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1c8aff',
  },
  featureText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  noPhotosText: {
    fontSize: 16,
    color: '#999',
  },
  buyButtonContainer: {
    marginTop: 20,
    marginBottom: 40,
    marginLeft: 90,
    marginRight: 10,
    width: '40%',
  },
});