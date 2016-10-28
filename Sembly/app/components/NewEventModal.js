import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class NewEventModal extends Component {
  constructor (props) {
    super(props);
    this.state = {visible:this.props.visible}
  }
  handleFabClick () {

  }
  render () {
    // let context = this;
    return (
      <Modal ref={'newEventModal'} style={styles.modal} isOpen={this.state.visible} r>
        <View style={styles.container}>
          <Text>Create a New Event!</Text>
          <TouchableOpacity onPress={() => this.refs.newEventModal.close()}>
            <Icon style={styles.closeButton} name='close'/>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}


const styles = StyleSheet.create({
  modal: {
    marginTop: 40
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  closeButton:{
    fontSize: 30
  }
})
