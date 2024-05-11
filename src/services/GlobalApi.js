import axios from 'axios';

const BASE_URL = 'https://maps.googleapis.com/maps/api';
const API_KEY = `${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;

const nearByPlace = (lat, lng, type) => {
  return axios.get(
    BASE_URL +
      '/place/nearbysearch/json?' +
      '&location=' +
      lat +
      ',' +
      lng +
      '&radius=1500&type=' +
      type +
      '&key=' +
      API_KEY
  );
};

const geoCode = (lat, lng) => {
  return axios.get(
    BASE_URL +
      '/geocode/json?' +
      'latlng=' +
      lat +
      ',' +
      lng +
      '&key=' +
      API_KEY
  );
};

export default {
  nearByPlace,
  geoCode,
};
