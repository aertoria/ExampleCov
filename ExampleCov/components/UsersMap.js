import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapView from 'react-native-maps';

// UsersMap populates all markers from nearby, if any.
// UserMap centralize and focus on the userLocation, if any.
const usersMap = props => {
  let userLocationMarker = null;
  if(props.userLocation){
    userLocationMarker =
        <MapView.Marker coordinate={props.userLocation}>
          <Image source={require('../asset/mm_me.png')} style={{height: 35, width:35 }} />
        </MapView.Marker>;
  }

  const userMarkersPaper = props.userPlacesPaper
      .map(userPlace => (
          <MapView.Marker coordinate={userPlace} key={userPlace.id}>
            <Image source={require('../asset/mm_tp.jpg')} style={{height: 20, width:20 }} />
          </MapView.Marker>
          ));
  const userMarkersMask = props.userPlacesMask
      .map(userPlace => (
          <MapView.Marker coordinate={userPlace} key={userPlace.id}>
            <Image source={require('../asset/mm_mask2.png')} style={{height: 26, width:26 }} />
          </MapView.Marker>
      ));
  return(
      <View style = {styles.mapContainer}>
        <MapView
            initialRegion={{
              latitude: 37.68825,
              longitude: -122.2024,
              latitudeDelta: 0.7,
              longitudeDelta: 0.71,
            }}
            region = {props.userLocation}
            style = {styles.map}>
            {userLocationMarker}
            {userMarkersMask}
            {userMarkersPaper}
        </MapView>
      </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '78%',
    marginTop: 0,
  },
  map:{
    width: '100%',
    height: '100%'
  }
});

export default usersMap;