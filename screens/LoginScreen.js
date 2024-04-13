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
        <View>
          <Text style={styles.textInputLabel}>Your Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            placeholder='Email'
            autoCapitalize='none'
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor={Colors.darkGray}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.textInputLabel}>Your Password</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            value={password}
            placeholder='Password'
            autoCapitalize='none'
            onChangeText={(text) => setPassword(text)}
            placeholderTextColor={Colors.darkGray}
          ></TextInput>
        </View>
        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={() => signIn()}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
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
    gap: 10,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 48,
    paddingHorizontal: 24,
    elevation: 4,
  },
  textInput: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    color: Colors.navy,
    fontFamily: 'Poppins-Regular',
    textAlignVertical: 'center',
    alignItems: 'center',
  },
  textInputLabel: {
    fontFamily: 'Poppins-Medium',
    color: Colors.navy,
    fontSize: 14,
    marginBottom: 6,
  },
  button: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.green,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Poppins-Medium',
  },
});
