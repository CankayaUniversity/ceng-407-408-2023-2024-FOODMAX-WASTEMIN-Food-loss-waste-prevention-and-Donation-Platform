import { View, Button } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

function Settings() {
  const navigation = useNavigation();

  return (
    <View>
      <Button
        onPress={() => navigation.navigate('ProfileScreen')}
        title='Profile Settings'
      />
      <Button
        onPress={() => navigation.navigate('StoreScreen')}
        title='Store Login'
      />
      <Button onPress={() => FIREBASE_AUTH.signOut()} title='Logout' />
    </View>
  );
}

export default Settings;
