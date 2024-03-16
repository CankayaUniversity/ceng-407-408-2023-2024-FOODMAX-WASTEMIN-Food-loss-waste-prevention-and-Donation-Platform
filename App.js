import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import Home from './screens/Home';
import Details from './screens/Details';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import RegisterScreen from './screens/RegisterScreen';
import './src/i18n/i18n.config';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='Home' component={Home} />
      <InsideStack.Screen name='Details' component={Details} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const { t, i18n } = useTranslation();

  // TODO: Use it later
  // const changeLanguage = () => {
  //   i18n.changeLanguage('tr');
  // };

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen
            name='Inside'
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name='Login'
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Register'
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
