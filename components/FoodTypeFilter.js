import React from 'react';
import { Modal, View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';

const FoodTypeFilter = ({ visible, onClose, onApplyFilter, selectedFoodType, handleFoodTypePress }) => {
  const applyFilter = () => {
    onApplyFilter(selectedFoodType);
  };

  const foodTypes = ['Produce', 'Meals', 'Pastries'];

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Food Type</Text>
          {foodTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.foodTypeOption,
                selectedFoodType === type && styles.selectedFoodType
              ]}
              onPress={() => handleFoodTypePress(type)}
            >
              <Text>{type}</Text> 
            </TouchableOpacity>
          ))}
          <Button title="Apply Filter" onPress={applyFilter} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  selectedFoodType: {
    backgroundColor: 'lightgray',
  },
});

export default FoodTypeFilter;
