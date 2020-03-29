import React from 'react';
import {Button} from 'react-native';

const fetchLocation = props => {
  return (
      <Button title = "FocusMyLocation" onPress = {props.onGetLocationMethod} />
  );
}

export default fetchLocation;