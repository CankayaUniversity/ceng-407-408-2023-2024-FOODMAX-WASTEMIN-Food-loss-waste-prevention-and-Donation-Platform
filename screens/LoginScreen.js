import { View, Text, StyleSheet, TextInput } from 'react-native';
import Colors from '../constants/colors';

function LoginScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.topContainer}>
        <Text style={styles.screenText}>Welcome Back!</Text>
        <Text style={styles.screenSubText}>
          Don't have an account? <Text>Register</Text>
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.screenText}>Sign In</Text>
        <Text>Your Email</Text>
        <TextInput placeholder='test@test.com'></TextInput>
      </View>
    </View>
  );
}

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
