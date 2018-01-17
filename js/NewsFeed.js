import React from 'react';
import {Text, StyleSheet, View, ActivityIndicator, AsyncStorage,} from 'react-native';
import {
  Button, Icon
} from 'react-native-elements';

import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyA881FOyVulJ9uou8zAetJF-DZ16O2skXE",
    authDomain: "coursebackend1.firebaseapp.com",
    databaseURL: "https://coursebackend1.firebaseio.com",
    storageBucket: "coursebackend1.appspot.com",
    persistence: true
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class Introduction extends React.Component {

  constructor(props){
    super(props);   
    this.state = { 
        loaded : false 
    }
    this.itemsRef = firebaseApp.database().ref();
  }
    
  static navigationOptions = ({navigation}) => ({
    title: 'News Feed',
    headerLeft: <Button icon={{name: 'menu', size: 25 }}
     backgroundColor='rgba(0,0,0,0)'
     onPress = {()=> navigation.navigate('DrawerOpen')}/>
  });

  componentDidMount(){
    this.fetchData();
  }

  // retrieve deparments data from the firebase server
  fetchData() {
	///let data = [];
	///console.log("doing fetching");
	///let fetcher = fetch('http://localhost:8000/langara/').then((res) => res.json())
	///	.then((resJSON) => {
	///		console.log(resJSON);
	///		console.log("^^^^^^^^^^^^^^^^^^^^^^");
	///	})
	///	.catch((error) => {
	///	console.log("error this" +error);
	///	});
	let data=[];
    this.itemsRef.on('value',(snap)=> {
      /* loop for each value retrieved, then pushed to data array */
      // each "child" is a json: dept + courses
      snap.forEach((child) => {
        data.push({
          dept: child.val().dept,
          courses: child.val().courses
        });
      });
      /* update view state 
         put list of objects (dept & courses) in state: dpts
      */  

      this.setState({
        //done loading
        loaded: true,
      });

      if (data.length > 2) {
          console.log("updated data, Welcome Boss");
          AsyncStorage.setItem("data",JSON.stringify(data));
      }
    });
  }

  // this function shows news from a data array
  showNews() {
    let data = [];
    for (let i = 1; i < 6; i++) {
      data.push(
        <View key={i}>
          <Text style={introStyles.title}>News {i}</Text>
          <Text style={introStyles.moreInfo}>Lorem ipsum lmao hjajaja</Text>
          <Text style={introStyles.description}>Hello World!</Text>
        </View>
      );
    }
    return data;
  }

  // loading view while deparments are being pulled from the server
  renderLoadingView() {
    return (
      <View style={introStyles.container}>
        <ActivityIndicator
          animating={this.state.animating}
          style={[introStyles.centering, {height: 80}]}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }

  render() {
    if (!this.state.loaded){
        return this.renderLoadingView();
    } else {
      return (
        <View>
          <Text style={introStyles.description}>Hello World!</Text>
          <Text style={introStyles.title}>News 1</Text>
          <Text style={introStyles.moreInfo}>Lorem ipsum lmao hjajaja</Text>
          {this.showNews()} 
        </View>
      );
    }
  }
}

//styling
const introStyles = StyleSheet.create({
  container: {
    flex:1 ,
    justifyContent: 'center', 
    backgroundColor: '#F5FCFF',
  },
  description: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    color: 'blue',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  moreInfo: {
    textAlign: 'center',
  }
});
