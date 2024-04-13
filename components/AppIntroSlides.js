import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Colors from '../constants/colors';
import { SIZES } from '../constants/sizes';
import Svg, { Path } from 'react-native-svg';

const AppIntroSlides = ({ onFinish }) => {
  const slides = [
    {
      id: 1,
      title: 'Welcome to NourishMe ✨',
      description:
        'Help us combat food waste and hunger. 🌍 Join our mission to connect surplus food with those in need.',
      image: require('../assets/intro1.jpg'),
    },
    {
      id: 2,
      title: 'Reduce. Share. Nourish.',
      description:
        "Discover local donations, volunteer, or contribute your surplus. Let's make a positive impact together!",
      image: require('../assets/intro2.jpg'),
    },
    {
      id: 3,
      title: "Let's get started 🚀",
      description:
        'Ready to take action? Explore local donation opportunities, volunteer, or share your surplus. Together, we can create meaningful change!',
      image: require('../assets/intro3.jpg'),
    },
  ];

  const buttonLabel = (label) => (
    <View>
      <Text style={styles.button}>{label}</Text>
    </View>
  );

  return (
    <AppIntroSlider
      data={slides}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} />
            <Svg height={100} viewBox='0 0 1440 320' style={styles.wave}>
              <Path
                fill='#fff'
                fill-opacity='1'
                d='M0,160L60,133.3C120,107,240,53,360,32C480,11,600,21,720,74.7C840,128,960,224,1080,240C1200,256,1320,192,1380,160L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'
              ></Path>
            </Svg>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      )}
      activeDotStyle={{ backgroundColor: Colors.green }}
      renderNextButton={() => buttonLabel('Next')}
      renderPrevButton={() => buttonLabel('Back')}
      renderSkipButton={() => buttonLabel('Skip')}
      renderDoneButton={() => buttonLabel('Done')}
      showSkipButton
      showPrevButton
      onDone={onFinish}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 3,
  },
  image: {
    flex: 1,
    width: SIZES.width,
    position: 'relative',
  },
  wave: {
    width: SIZES.width,
    position: 'absolute',
    bottom: -7,
  },
  textContainer: {
    flex: 2,
    padding: 36,
    alignItems: 'center',
  },
  title: {
    width: '90%',
    color: Colors.green,
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  description: {
    color: Colors.navy,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  button: {
    padding: 10,
    fontSize: 16,
    color: Colors.navy,
    fontFamily: 'Poppins-Regular',
  },
});

export default AppIntroSlides;
