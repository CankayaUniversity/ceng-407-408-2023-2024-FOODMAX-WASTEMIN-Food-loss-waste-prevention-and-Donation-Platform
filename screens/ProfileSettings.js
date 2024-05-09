import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
} from 'react-native';
import React from 'react';

const ProfileSettings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.userSettings}>User Settings</Text>
      </View>

      <View style={styles.textInputContainer}>
        <Text style={styles.field}>Name Surname</Text>
        <View style={styles.boxcontainer}>
          <TextInput style={styles.box} placeholder='Name Surname' />
          <Button
            onPress={() => console.log('Name Surname')}
            title='Edit'
            color='#841584'
          />
        </View>

        <Text style={styles.field}>Email</Text>
        <View style={styles.boxcontainer}>
          <TextInput style={styles.box} placeholder='Email' />
          <Button
            onPress={() => console.log('Email')}
            title='Edit'
            color='#841584'
          />
        </View>

        <Text style={styles.field}>Password</Text>
        <View style={styles.boxcontainer}>
          <TextInput
            style={styles.box}
            placeholder='Password'
            secureTextEntry={true}
          />
          <Button
            onPress={() => console.log('Password')}
            title='Edit'
            color='#841584'
          />
        </View>

        <Text style={styles.field}>Allergies</Text>
        <View style={styles.boxcontainer}>
          <TextInput style={styles.box} placeholder='Allergies' />
          <Button
            onPress={() => console.log('Allergies')}
            title='Edit'
            color='#841584'
          />
        </View>

        <Text style={styles.field}>Address</Text>
        <View style={styles.boxcontainer}>
          <TextInput style={styles.box} placeholder='Address' />
          <Button
            onPress={() => console.log('Address')}
            title='Edit'
            color='#841584'
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userSettings: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  field: {
    fontWeight: 'bold',
  },
  title: {
    marginLeft: 20,
    marginBottom: 10,
    flex: 1,
    justifyContent: 'flex-end',
  },
  textInputContainer: {
    flex: 7,
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  box: {
    width: '100%',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  boxcontainer: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});
