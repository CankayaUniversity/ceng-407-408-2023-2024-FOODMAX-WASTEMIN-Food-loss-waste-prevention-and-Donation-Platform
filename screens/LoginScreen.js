import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/colors';
import { useState } from 'react';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const { t } = useTranslation();

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // TODO: add keyboard avoiding view
    <View style={styles.screen}>
      <View style={styles.topContainer}>
        <Text style={styles.screenText}>{t('welcome')}</Text>
        <View style={styles.subTextContainer}>
          <Text style={styles.screenSubText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.screenText}>Sign In</Text>
        <Text>Your Email</Text>
        <TextInput
          value={email}
          placeholder='Email'
          autoCapitalize='none'
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <Text>Your Password</Text>
        <TextInput
          secureTextEntry={true}
          value={password}
          placeholder='Password'
          autoCapitalize='none'
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <>
            <Button title='Login' onPress={() => signIn()}></Button>
          </>
        )}
      </View>
    </View>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default LoginScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.cream,
  },
  screenText: {
    fontSize: 24,
    color: Colors.navy,
    fontWeight: 'bold',
  },
  subTextContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  screenSubText: {
    fontSize: 14,
    color: Colors.gray,
  },
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 5,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 48,
    paddingHorizontal: 24,
    elevation: 4,
  },
});
