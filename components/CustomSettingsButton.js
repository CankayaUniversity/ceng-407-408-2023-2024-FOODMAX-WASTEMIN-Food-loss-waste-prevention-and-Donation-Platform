import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../constants/colors';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const CustomSettingsButton = ({
  onPress,
  iconBefore,
  title,
  style,
  textStyle,
  iconColor = Colors.navy,
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {iconBefore && (
        <MaterialCommunityIcons
          name={iconBefore}
          size={24}
          style={[styles.iconBefore]}
          color={iconColor}
        />
      )}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      <MaterialIcons
        name='chevron-right'
        size={24}
        style={[styles.iconAfter, style]}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

export default CustomSettingsButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: Colors.navy,
    fontSize: 16,
    textAlign: 'left',
  },
  iconAfter: {
    marginLeft: 'auto',
  },
  iconBefore: {
    marginRight: 8,
  },
});
