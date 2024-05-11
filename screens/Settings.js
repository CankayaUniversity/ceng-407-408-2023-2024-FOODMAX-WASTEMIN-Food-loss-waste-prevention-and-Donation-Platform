import { View, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import CustomSettingsButton from '../components/CustomSettingsButton';
import Colors from '../constants/colors';

function Settings() {
  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.container}>
        <CustomSettingsButton
          onPress={() => navigation.navigate('MyStoresScreen')}
          title='My Stores'
          style={styles.buttonWidthBorder}
          iconBefore='store'
        />
      </View>
      <View style={styles.container}>
        <CustomSettingsButton
          onPress={() => navigation.navigate('ProfileScreen')}
          title='Profile Settings'
          style={styles.buttonWidthBorder}
          iconBefore='account-edit'
        />
        <CustomSettingsButton
          onPress={() => navigation.navigate('StoreScreen')}
          title='Store Login'
          iconBefore='store-plus'
        />
      </View>
      <View style={styles.container}>
        <CustomSettingsButton
          onPress={() => FIREBASE_AUTH.signOut()}
          title='Logout'
          iconBefore='logout'
          iconColor='red'
          textStyle={styles.customColorButton}
        />
      </View>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  buttonWidthBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  customColorButton: {
    color: 'red',
  },
});
