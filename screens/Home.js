import { View, Button } from 'react-native';
import PropTypes from 'prop-types';

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        onPress={() => navigation.navigate('FoodPost')}
        title='Open Food Post'
      />
      <Button
        onPress={() => navigation.navigate('Details')}
        title='Open Details'
      />
    </View>
  );
}

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Home;
