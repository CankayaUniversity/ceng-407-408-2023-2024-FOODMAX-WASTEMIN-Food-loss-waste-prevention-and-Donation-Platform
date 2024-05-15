import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Recommendation() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://firestore.googleapis.com/v1beta1/projects/nourish-me-8e6b6/databases/(default)/documents/recommendations');
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

  return (
<View style={styles.container}>
  <Text style={styles.title}>Recommendations</Text>
  {recommendations.map((recommendation, index) => (
    <View style={styles.recommendationContainer} key={index}>
      <Text style={styles.test}>Title</Text>
      <Text>{recommendation.fields.title.stringValue}</Text>
      <Text style={styles.test}>Price </Text>
      <Text>{recommendation.fields.price.doubleValue} $ </Text>
      <Text style={styles.test}>Quantity </Text>
      <Text>{recommendation.fields.quantity.integerValue}</Text>
      <Text style={styles.test}>Provider </Text>
      <Text>{recommendation.fields.provider.stringValue}</Text>
      <Text style={styles.test}>Description </Text>
      <Text >{recommendation.fields.description.stringValue}</Text>
      
      {/* Görüntülemek istediğiniz diğer veri alanlarını buraya ekleyin */}
    </View>
  ))}
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendationContainer: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    
  },
 test:{
    fontWeight: 'bold',
 },
  


});
