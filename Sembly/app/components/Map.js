import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Navigator,
  Dimensions
} from 'react-native';

import MapView from 'react-native-maps';
import NewEventModal from './NewEventModal.js';
import OurDrawer from './OurDrawer.js';
import _navigate from './navigateConfig.js';
import NewEventFab from './NewEventFab.js';

export default class Map extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      markers: null,
      modalVisible: false
    };
  }
  componentWillMount () {
    fetch('http://localhost:3000/api/events/bundle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: this.props.user._id,
        location: this.props.mongoLocation
      })
    })
    .then(data => {
      return data.json()
    })
    .then(data => {
      this.setState({markers: data, loading: false})
    })
    .catch((err) => {
      console.error(err);
    })
  }
  toggleModalVisibility () {
    this.setState({modalVisible: !this.state.modalVisible})
  }
  render () {
    if(this.state.loading){
      return (
        <OurDrawer topBarFilterVisible={true} topBarName={'Map'} _navigate={ _navigate.bind(this)}>
          <View>
            <Text style={styles.loading}>Loading...</Text>
          </View>
        </OurDrawer>
      )
    }
    else {
      return (
        <OurDrawer topBarFilterVisible={true} topBarName={'Map'} _navigate={ _navigate.bind(this)}>
          <View>
            <MapView
              showsUserLocation={true}
              style={styles.map}
              initialRegion={{
                latitude: this.props.mongoLocation[1],
                longitude: this.props.mongoLocation[0],
                latitudeDelta: .04,
                longitudeDelta: .02
            }}>
            {this.state.markers.map(marker => {
              var tempLoc = {
                latitude: marker.location[1],
                longitude: marker.location[0]
              }
              return (
                <MapView.Marker
                  key={marker._id}
                  coordinate={tempLoc}
                  title={marker.name}
                  pinColor='blue'
                />
              )
            })}
            </MapView>
            <NewEventFab onPress={this.toggleModalVisibility.bind(this)}/>
            <NewEventModal visibility={this.state.modalVisible}/>
          </View>
        </OurDrawer>
      )
    }
  }
}

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height - 60,
    zIndex: 0
  },
  loading: {
    fontSize: 75,
    fontWeight: 'bold',
  }
});
