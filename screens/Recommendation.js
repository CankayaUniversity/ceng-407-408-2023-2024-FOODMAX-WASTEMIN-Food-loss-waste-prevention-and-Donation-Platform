import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import axios from 'axios';

export default function Recommendation() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://firestore.googleapis.com/v1beta1/projects/nourish-me-8e6b6/databases/(default)/documents/recommendations'
        );
        const data = await response.json();
        console.log('Data:', data);
        // Gelen veriyi state'e kaydet
        setRecommendations(data.documents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Veri çekme işlemini başlat
    fetchData();

    // Cleanup işlemi buraya eklenebilir
    return () => {
      // Gerekirse, bileşen kaldırıldığında temizlik yapılabilir
    };
  }, []);

  // get recommendations from flask server
  useEffect(() => {
    axios
      .get('http://localhost:5000/recommendations')
      .then((response) => {
        const titles = response.data.recommendations.map(
          (item) => item.PostTitle
        );
        console.log(titles);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendations</Text>
      {recommendations.map((recommendation, index) => (
        <View style={styles.recommendationContainer} key={index}>
          <View style={styles.row}>
            <Image
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/nourish-me-8e6b6.appspot.com/o/images%2F5ffa3b32-9dbe-43b9-a786-e6ef6b4248d5.png?alt=media&token=172100c5-4c2a-4b1d-8906-6ea642b1ffbe',
              }}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.test}>Title:</Text>
              <Text>{recommendation.fields.title.stringValue}</Text>
              <Text style={styles.test}>Price:</Text>
              <Text>{recommendation.fields.price.doubleValue} $ </Text>
              <Text style={styles.test}>Quantity:</Text>
              <Text>{recommendation.fields.quantity.integerValue}</Text>
              <Text style={styles.test}>Provider:</Text>
              <Text>{recommendation.fields.provider.stringValue}</Text>
              <Text style={styles.test}>Description:</Text>
              <Text>{recommendation.fields.description.stringValue}</Text>
            </View>
          </View>
        </View>
      ))}
      <View style={styles.button}>
        <Button title='Buy' onPress={() => console.log('Buy button pressed')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationContainer: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 140,
    marginRight: 10,
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
  },
  test: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    marginBottom: 40,
    width: '40%',
  },
});
