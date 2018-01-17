import React from 'react';
import {Button, Icon} from 'react-native-elements';

// import classes for modal
import Modal from 'react-native-modalbox';
import Slider from 'react-native-slider';
import * as styles from './styles.js';

import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';

var screen = Dimensions.get('window');

export default class Tutorial extends React.Component {
  static navigationOptions = ({navigation})=> ({
    title: <Text color='white'>Tutorial</Text>,
    headerLeft: <Button icon={{name: 'menu', size: 25 }}
       backgroundColor='rgba(0,0,0,0)'
       onPress = {()=> navigation.navigate('DrawerOpen')}/>
  });
  constructor() {
    super();
    this.state = {
      isOpen: true,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3
    };
  }

  renderList() {
    var list = [];

    for (var i=0;i<50;i++) {
      list.push(<Text style={styles.text} key={i}>Elem {i}</Text>);
    }

    return list;
  }

  renderModal() {
    return
  }
  render() {
    // var BContent = <Button onPress={() => this.setState({isOpen: false})} style={[styles.btn, styles.btnModal]}>X</Button>;

    return (
      <View>
        <Modal
          style={[styles.modal, styles.modal1]}
          ref={"modal1"}
          swipeToClose={this.state.swipeToClose}
          onClosed={this.onClose}
          onOpened={this.onOpen}
          onClosingState={this.onClosingState}>
            <Text style={styles.text}>Basic modal</Text>
            
        </Modal>
        <Button title="1" onPress={() => this.refs.modal1.open()} style={styles.btn}>Disable swipeToClose({this.state.swipeToClose ? "true" : "false"})</Button>
        <Button title="2" onPress={() => this.refs.modal2.open()} style={styles.btn}>Position top</Button>
        <Button title="3" onPress={() => this.refs.modal3.open()} style={styles.btn}>Position centered + backdrop + disable</Button>
        <Button title="4" onPress={() => this.refs.modal4.open()} style={styles.btn}>Position bottom + backdrop + slider</Button>
      
        <Button title="6" onPress={() => this.refs.modal6.open()} style={styles.btn}>Position bottom + ScrollView</Button>
        <Button title="7" onPress={() => this.refs.modal7.open()} style={styles.btn}>Modal with keyboard support</Button>
      
        <Modal style={[styles.modal, styles.modal2]} backdrop={false}  position={"top"} ref={"modal2"}>
          <Text style={[styles.text, {color: "white"}]}>Modal on top</Text>
        </Modal>
      
        <Modal style={[styles.modal, styles.modal3]} position={"center"} ref={"modal3"} isDisabled={this.state.isDisabled}>
          <Text style={styles.text}>Modal centered</Text>
          <Button title="1" onPress={() => this.setState({isDisabled: !this.state.isDisabled})} style={styles.btn}>Disable ({this.state.isDisabled ? "true" : "false"})</Button>
        </Modal>
      
        <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal4"}>
          <Text style={styles.text}>Modal on bottom with backdrop</Text>
          <Slider style={{width: 200}} value={this.state.sliderValue} onValueChange={(value) => this.setState({sliderValue: value})} />
        </Modal>
      
        <Modal isOpen={this.state.isOpen} onClosed={() => this.setState({isOpen: false})} style={[styles.modal, styles.modal4]} position={"center"} >
          <Text style={styles.text}>Modal with backdrop content</Text>
        </Modal>
      
        <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal6"} swipeArea={20}>
          <ScrollView>
            <View style={{width: screen.width, paddingLeft: 10}}>
              {this.renderList()}
            </View>
          </ScrollView>
        </Modal>
      
        <Modal ref={"modal7"} style={[styles.modal, styles.modal4]} position={"center"}>
          <View>
            <TextInput style={{height: 50, width: 200, backgroundColor: '#DDDDDD'}}/>
          </View>
        </Modal>
        </View>
    );
  }

}
