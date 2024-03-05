import React from 'react';
import { View, Button } from 'react-native';
import PropTypes from 'prop-types';
import { FIREBASE_AUTH } from '../FirebaseConfig';

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Details')}
        title='Open Details'
      />
      <Button onPress={() => FIREBASE_AUTH.signOut()} title='Logout' />
    </View>
  );
}

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
