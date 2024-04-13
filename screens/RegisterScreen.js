import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Colors from '../constants/colors';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../FirebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const auth = FIREBASE_AUTH;
  const firestore = FIREBASE_FIRESTORE;

  const signUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      await addDoc(collection(firestore, 'users'), {
        uid: uid,
        createdAt: Timestamp.fromDate(new Date()),
        fullName: username,
        email: email,
        password: password,
        role: 'regular',
      });

      alert('Successfully registered 🎊!');
      console.log(userCredential);
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topContainer}>
        <Text style={styles.screenText}>Let's Start</Text>
        <Text style={styles.screenSubText}>Create an account</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.screenText}>{t('signup')}</Text>
        <View>
          <Text style={styles.textInputLabel}>Your Name</Text>
          <TextInput
            style={styles.textInput}
            value={username}
            placeholder='Full name'
            autoCapitalize='none'
            onChangeText={(text) => setUsername(text)}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.textInputLabel}>Your Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            placeholder='Email'
            autoCapitalize='none'
            onChangeText={(text) => setEmail(text)}
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
          ></TextInput>
        </View>
        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={() => signUp()}>
              <Text style={styles.buttonText}>Create account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.buttonText, styles.buttonOutlineText]}>
                Back
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

export default RegisterScreen;

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
  buttonOutline: {
    backgroundColor: Colors.white,
    borderColor: Colors.green,
    borderWidth: 1,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Poppins-Medium',
  },
  buttonOutlineText: {
    color: Colors.green,
  },
});
