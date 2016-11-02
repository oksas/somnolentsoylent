import React, { Component, PropTypes } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Navigator,
  Dimensions
} from 'react-native';

import Spinner from './Spinner.js';

import MapView from 'react-native-maps';
import NewEventModal from './NewEventModal.js';
import OurDrawer from './OurDrawer.js';
import _navigate from './navigateConfig.js';
import NewEventFab from './NewEventFab.js';

export default class Map extends Component {
  static propTypes {
    user: PropTypes.object.isRequired,
    mongoLocation: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      markers: null,
      newEventModalVisible: false,
      eventModalVisible: false
    };

    this.setNewEventPinCoords = this.setNewEventPinCoords.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.openNewEventModal = this.openNewEventModal.bind(this);
    this.openEventModal = this.openEventModal.bind(this);
  }

  setNewEventPinCoords() {
    this.setState({
      x: {
        latitude: this.props.mongoLocation[1] + 0.0005,
        longitude: this.props.mongoLocation[0] + 0.0005
      }
    });
  }

  fetchEvents() {
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
      return data.json();
    })
    .then(data => {
      console.log('inside fetchEvents', data);
      this.setState({
        markers: data,
        loading: false
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  componentWillMount() {
    this.setNewEventPinCoords();
    this.fetchEvents();
  }

  openNewEventModal() {
    this.setState({
      newEventModalVisible: true
    });
  }

  openEventModal() {

  }

  getEventModal() {
    if (this.state.eventModalVisible) {
      return (
        <EventModal
          close={this.closeEvent.bind(this)}
          user={this.props.user}
          visibility={this.state.eventModal}
          event={this.state.eventId} />
      );
    }

    return null;
  }

  render () {
    if (this.state.loading) {
      return (
        <OurDrawer user={this.props.user}
          topBarFilterVisible={true}
          topBarName={'Map'}
          _navigate={_navigate.bind(this)}
        >
          <View style={styles.spinner}>
            <Spinner />
          </View>
        </OurDrawer>
      );
    }
    else {
      return (
        <OurDrawer
          user={this.props.user}
          topBarFilterVisible={true}
          topBarName={'Map'}
          _navigate={_navigate.bind(this)}
        >
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
            <MapView.Marker draggable
              coordinate={this.state.x}
              pinColor='yellow'
              title='The location of your next event!'
              onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
            />
            {
              this.state.markers.map(marker => {
                var tempLoc = {
                  latitude: marker.location[1],
                  longitude: marker.location[0]
                }
                return (
                  <MapView.Marker
                    key={marker._id}
                    coordinate={tempLoc}
                    onCalloutPress={}
                    title={marker.name}
                    pinColor='blue'
                  />
                );
              })
            }
            </MapView>
            <NewEventFab onPress={this.openNewEventModal/>
            <NewEventModal
              resetPin={this.setNewEventPinCoords}
              fetchNewEvents={this.fetchEvents}
              userId={this.props.user._id}
              eventCoords={this.state.x}
              modalVisibility={this.state.newEventModalVisible}
            />
          </View>
        </OurDrawer>
      );
    }
  }
}

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height - 60,
  },
  spinner: {
    padding: 30,
    marginTop: 200,
    alignItems: 'center'
  }
});
