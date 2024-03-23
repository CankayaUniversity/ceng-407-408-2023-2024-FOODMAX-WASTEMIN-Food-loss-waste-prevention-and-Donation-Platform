import { View, Button } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';

function Settings() {
  return (
    <View>
      <Button onPress={() => FIREBASE_AUTH.signOut()} title='Logout' />
    </View>
  );
}

export default Settings;
