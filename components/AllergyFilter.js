import React from 'react';
import { Modal, View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';

const AllergyFilter = ({ visible, onClose, onApplyFilter, selectedAllergies, handleAllergyWarningPress }) => {
  const applyFilter = () => {
    onApplyFilter(selectedAllergies);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Allergy Warnings</Text>
          <TouchableOpacity
            style={[styles.allergyOption, selectedAllergies.includes('gluten-free') && styles.selectedAllergy]}
            onPress={() => handleAllergyWarningPress('gluten-free')}
          >
            <Text>Gluten-Free</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.allergyOption, selectedAllergies.includes('dairy-free') && styles.selectedAllergy]}
            onPress={() => handleAllergyWarningPress('dairy-free')}
          >
            <Text>Dairy-Free</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.allergyOption, selectedAllergies.includes('vegan') && styles.selectedAllergy]}
            onPress={() => handleAllergyWarningPress('vegan')}
          >
            <Text>Vegan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.allergyOption, selectedAllergies.includes('vegetarian') && styles.selectedAllergy]}
            onPress={() => handleAllergyWarningPress('vegetarian')}
          >
            <Text>Vegetarian</Text>
          </TouchableOpacity>
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
  allergyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedAllergy: {
    backgroundColor: 'lightgray',
  },
});

export default AllergyFilter;
