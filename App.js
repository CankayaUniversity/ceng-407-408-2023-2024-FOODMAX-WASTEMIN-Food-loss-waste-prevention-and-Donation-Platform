import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/Home';
import DetailsScreen from './screens/Details';
import RegisterScreen from './screens/RegisterScreen';
import SettingsScreen from './screens/Settings';
import DiscoverScreen from './screens/DiscoverScreen';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Colors from './constants/colors';
import { Platform, View, Text, StyleSheet } from 'react-native';
import './src/i18n/i18n.config';
import FoodPost from './screens/FoodPost';
import axios from 'axios';
import { UserLocationContext } from './src/context/UserLocationContext';
import * as Location from 'expo-location';
import AppIntroSlides from './components/AppIntroSlides';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Login'>
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
    </Stack.Navigator>
  );
}

function InsideStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen
        name='FoodPost'
        component={FoodPost}
        options={{ title: 'Foods' }}
      />
      <Stack.Screen name='Details' component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const { t, i18n } = useTranslation();
  const [data, setData] = useState('');
  const [showIntro, setShowIntro] = useState(true);
  const [location, setLocation] = useState(null);

  const buttonLabel = (label) => {
    return (
      <View>
        <Text style={styles.button}>{label}</Text>
      </View>
    );
  };

  useEffect(() => {
    fetchData();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');

      setData(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data);

  // TODO: Use it later
  // const changeLanguage = () => {
  //   i18n.changeLanguage('tr');
  // };

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setShowIntro(!user);
    });
  }, []);

  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      <NavigationContainer>
        {showIntro && (
          <AppIntroSlides
            onFinish={() => {
              setShowIntro(false);
            }}
          />
        )}
        {user ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                } else if (route.name === 'Discover') {
                  iconName = focused ? 'search' : 'search-outline';
                }

                // You can return any component here that you want as the icon
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: Colors.green,
              tabBarInactiveTintColor: Colors.gray,
              tabBarLabelStyle: {
                fontSize: 10,
                paddingBottom: Platform.OS === 'ios' ? 0 : 10,
              },
              tabBarStyle: {
                padding: 10,
                height: Platform.OS === 'ios' ? 80 : 60,
              },
            })}
          >
            <Tab.Screen name='Home' component={InsideStack} />
            <Tab.Screen
              name='Discover'
              component={DiscoverScreen}
              options={{ headerShown: true }}
            />
            <Tab.Screen
              name='Settings'
              component={SettingsScreen}
              options={{ headerShown: true }}
            />
          </Tab.Navigator>
        ) : (
          !showIntro && <AuthStack />
        )}
      </NavigationContainer>
    </UserLocationContext.Provider>
  );
}
