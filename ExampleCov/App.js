/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar, TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import FetchLocation from './components/FetchLocation';
import Geolocation from '@react-native-community/geolocation';
import UsersMap from './components/UsersMap';
import { Button } from 'react-native-elements';
import openURLInBrowser
  from 'react-native/Libraries/Core/Devtools/openURLInBrowser';

export default class App extends React.Component{
  state = {
    userLocation: null,
    userPlacesPaper: [],
    userPlacesMask: []
  }

  getCurrentLocationAndCentralized = () => {
    Geolocation.getCurrentPosition(
        position => {
          alert("Focus on current Location:"
              + " lat: " + position.coords.latitude
              + " long: "+ position.coords.longitude
              + " time: " + position.timestamp);
          this.setState({
            userLocation:{
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1
            }
          });
         });
  }

  reportPaperAvailableAtCurrentLocation = () => {
    Geolocation.getCurrentPosition(
        position => {
          alert("Report Toilet paper current Location:"
              + " lat: " + position.coords.latitude
              + " long: "+ position.coords.longitude
              + " time: " + position.timestamp);
          // This is rpc/http call now
          fetch('https://example-cov.firebaseio.com/places.json',{
            method: 'POST',
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: position.timestamp,
            })
          }).then(res => {
            console.log(res);
          })
              .catch(err => console.log(err));
        }, err => {alert("error!"+err)});
  }

  reportMaskAvailableAtCurrentLocation = () => {
    Geolocation.getCurrentPosition(
        position => {
          alert("Report Mask at current Location:"
              + " lat: " + position.coords.latitude
              + " long: "+ position.coords.longitude
              + " time: " + position.timestamp);
          // This is rpc/http call now
          fetch('https://example-cov.firebaseio.com/placesMask.json',{
            method: 'POST',
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: position.timestamp,
            })
          }).then(res => {
                console.log(res);
              })
              .catch(err => console.log(err));
        }, err => {alert("error!"+err)});
  }

  fetchAllMarkers = () => {
    fetch("https://example-cov.firebaseio.com/places.json")
        .then(res => res.json())
        .then(parsedRes => {
          const placeArray = [];
          for(const key in parsedRes){
            placeArray.push({
              latitude: parsedRes[key].latitude,
              longitude: parsedRes[key].longitude,
              id: key
            });
          }
          this.setState({
            userPlacesPaper:placeArray
          });
        })
        .catch(err => console.log(err));

    fetch("https://example-cov.firebaseio.com/placesMask.json")
        .then(res => res.json())
        .then(parsedRes => {
          const placeArray = [];
          for(const key in parsedRes){
            placeArray.push({
              latitude: parsedRes[key].latitude,
              longitude: parsedRes[key].longitude,
              id: key
            });
          }
          this.setState({
            userPlacesMask:placeArray
          });
        })
        .catch(err => console.log(err));
  };

  render() {
    return(
        <>
          <UsersMap
              userLocation = {this.state.userLocation}
              userPlacesPaper = {this.state.userPlacesPaper}
              userPlacesMask = {this.state.userPlacesMask}
          />
          <ScrollView>
              <View style = {styles.sectionContainer}>
                <View style = {styles.buttonSection}>
                  <Button style = {styles.button} title = "Scan" onPress = {this.fetchAllMarkers} />
                  <Button style = {styles.button} title = "Focus" onPress = {this.getCurrentLocationAndCentralized} />
                </View>

                <Text style={styles.sectionTitle}>Shopping Toilet Paper/Medical Masks?</Text>
                <Text style={styles.sectionDescription}>
                  Amid of special times, the app help you locate the shops
                  has Toilet paper / Medical masks in stock. One icon corresponds to an recent availability reported.
                  Both recency and amount of reports at a location effects how we map these recommendations
                </Text>
              </View>
              <View style = {styles.sectionContainer}>
                <Text style={styles.sectionDescription}>
                <Text style={styles.highlight}>
                  Did you spot anything available at where you are? Report it
                </Text>
                </Text>

                <View style = {styles.buttonSection}>
                  <Button style = {styles.reportButton} title = "Report Paper!" onPress = {this.reportPaperAvailableAtCurrentLocation} />
                  <Button style = {styles.reportButton} title = "Report Masks!" onPress = {this.reportMaskAvailableAtCurrentLocation} />
                </View>
              </View>

            {/*HELPER*/}
            <View style={styles.container}>
              <React.Fragment>
                <View style={styles.separator} />
                <TouchableOpacity
                    accessibilityRole={'button'}
                    style={styles.linkContainer}>
                  <Text style={styles.link}>Recency</Text>
                  <Text style={styles.description}>Each report, when arrived server, has a epoch timestamp. We use Exponential decay function
                  to silence the older reports</Text>
                </TouchableOpacity>
              </React.Fragment>
              <React.Fragment>
                <View style={styles.separator} />
                <TouchableOpacity
                    accessibilityRole={'button'}
                    style={styles.linkContainer}>
                  <Text style={styles.link}>Data collected: Location</Text>
                  <Text style={styles.description}>The lat and long generated by your phone</Text>
                </TouchableOpacity>
              </React.Fragment>
              <React.Fragment>
                <View style={styles.separator} />
                <TouchableOpacity
                    accessibilityRole={'button'}
                    style={styles.linkContainer}>
                  <Text style={styles.link}>An out-of-stock event detection</Text>
                  <Text style={styles.description}>When server detects simultaneous absence of availability report
                  at a location, we can learn there is out-of-stock event and stop recommending to other user</Text>
                </TouchableOpacity>
              </React.Fragment>
            </View>
            </ScrollView>


        </>
    );
  }
}



const styles = StyleSheet.create({
      scrollView: {
        backgroundColor: Colors.lighter,
      },
      engine: {
        position: 'absolute',
        right: 0,
      },
      body: {
        backgroundColor: Colors.white,
      },
      sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
      },
      sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
      },
      highlight: {
        fontWeight: '700',
      },
      footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
      },
      button: {
        textAlign: 'center',
        height:50,
        width: 140,
      },
      reportButton: {
        textAlign: 'center',
        height:50,
        width: 160,
      },
      buttonSection: {
        flexDirection: "row",
        justifyContent:'space-between',
        width: '100%',
        alignItems: 'center'
      },
      container: {
        marginTop: 32,
        paddingHorizontal: 24,
      },
      linkContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
      },
      link: {
        flex: 2,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.primary,
      },
      description: {
        flex: 3,
        paddingVertical: 16,
        fontWeight: '400',
        fontSize: 18,
        color: Colors.dark,
      },
      separator: {
        backgroundColor: Colors.light,
        height: 1,
      },
    }
);


