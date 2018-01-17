import React from  'react';
import { AsyncStorage, Text, TextInput, View, ScrollView, StyleSheet,ActivityIndicator} from 'react-native';
import { Icon,Button } from 'react-native-elements';
import * as styles from "./styles.js";
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

export default class Favourites extends React.Component {
    //Ken
    //Following a component will mount design pattern, which help changing static context (eg: NavigationOption)

    static me = null;

    constructor(){
		super();
		this.state={
			favs : [],
			loaded : false,
			activeSection : false,
		};
		AsyncStorage.getItem("data").then((value) => this.setState({data : JSON.parse(value),}));
	}

    componentWillMount(){
		//load course data in this screen
        me = this;
		this.loadFavs().then((value)=> {
			let listFavs = value.split("\n");
			let courses = [];

			//iterate through favs
			for (let i = 0 ; i < listFavs.length; i++){
				let line = listFavs[i];
				let info = line.split(" -- ");

				//iterate through datas
				for (let dept of this.state.data) {
					for (let course of dept["courses"]) {
						//if saw a course from favs in datas : 
						if (info[0] != null && course != null && course["course_id"].includes(info[0]) && (info[0]!="" && info[0]!=" ")){
							courses.push(course);
						}
					}
				}
			}
			this.setState({shows: courses,});
		}).catch((error) => {
			console.log("Error Favs 0923: "+error);
			return "Error Favs 0923 : data from favs not found";
		});
    }

	//load data of favs and generate view of courses in fav
	loadFavs(){
		return AsyncStorage.getItem("favs");
	}

	//nav bar
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerLeft: <Button icon={{name: 'menu', size: 25 }} backgroundColor='rgba(0,0,0,0)' onPress = {()=> {navigation.navigate('DrawerOpen');}}/>,
            headerTitle : "My Favorites",
        }
     };

    // Sets section to 'expanded'
    _setSection(section) {
      this.setState({ activeSection: section });
    }
			
    // displays courses as an accordion but closed
    _renderHeader(course, i, isActive) {
      return (
        <Animatable.View transition="backgroundColor" duration={500} style={[{ padding: 10, }, isActive ? styles.active : styles.inactive]}>
          <Text style={[isActive ? [styles.activeText, styles.headerActiveText]: [styles.inactiveText, styles.headerInactiveText]]}>{course.course_id} - {course.offerings[0].title} </Text>
        </Animatable.View>
      );
    }

    // displays courses and their sections
    renderContent() {
		let sections = [];
		console.log("--------------------------------------------");

		for (let course of this.state.shows) {
		   for (let j = 0; j < course.offerings.length; j++) {
			 let room = course.offerings[j].component[0].room; //lecture
			 let waitlist = course.offerings[j].waitlist; // people on waitlist
			 let isActive=true;
			 sections.push(
			 	
				<Animatable.View transition="backgroundColor" key={course.offerings[j].course_num} duration={500} style={[{paddingLeft: 20, paddingRight: 20}, isActive ? styles.active : styles.inactive]}>
				  <Animatable.Text style={[{textAlign: 'center', padding: 10}, styles.activeText]} >{course.course_id} - Section {course.offerings[j].section} - CN: {course.offerings[j].course_num}</Animatable.Text>

				   <View style={{ borderBottomColor: 'white', borderBottomWidth: 1, paddingBottom: 5 }}/>
				   
				   <Animatable.Text style={{color: 'white', paddingTop: 5}} >Seats Available: {course.offerings[j].seats}</Animatable.Text>
				   { waitlist != '' ? 
				    <Animatable.Text style={{color: 'white',}} >Current Waitlist: {waitlist}</Animatable.Text> :
				    <Animatable.Text style={{color: 'white',}} >Current Waitlist: 0</Animatable.Text> 
				   }
				   <Animatable.Text style={{color: 'white',}} >Instructor: {course.offerings[j].instructor}</Animatable.Text>
				   { room != 'WWW' && room != '' && room != 'TBSCH' ? 
				    <Animatable.Text style={{color: 'white',}} >Lecture Room: {room}</Animatable.Text> :
				    <Animatable.Text style={{color: 'white',}} >Lecture Room: TBA</Animatable.Text> 
				   }

				   <Text>{'\n'}</Text>
				</Animatable.View>
			 );
		   }
		}
		
		return sections;
	}
	
    // loading view while deparments are being pulled from the server
    renderLoadingView() {
      return (
        <View >
          <ActivityIndicator
            animating={this.state.animating}
            style={[styles.centering, {height: 80}]}
            size="large"
            color="#0000ff"
          />
        </View>
      );
    }

    // main render function
    render() {
	  if (!this.state.shows) {
	  	return this.renderLoadingView();
	  } else { 
	  	console.log("doing rendering!!!!!!!!!!!!!!!!!!!!!!!!");
      return (
			<ScrollView style={{padding: 10}}>
				{this.renderContent()}
			</ScrollView>
      );
	  }
    }
}
