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
			loaded : true,
			activeSection : false,
		};
		//grab data of all courses from async storage
		AsyncStorage.getItem("data").then((value) => this.setState({data : JSON.parse(value),}));
	}

    componentWillMount(){
		//load course data in this screen
        me = this;
		this._refresh();
    }

	_refresh(){
		//Promise, work with value (pulling data of favs from async) 
		//this.setState({shows: false});
		if (! this.state.loaded) return;
		this.loadFavs().then((value)=> {
			
			/*
				json containing the stored favs data (course_id + nums)
				favs : []
					name : string course_id 
					nums : [] nums
			*/
			let favs = JSON.parse(value);

			//list of courses from favs (containing all newly loaded infos)
			let courses = [];

			//iterate through datas
			for (let dept of this.state.data) {
				let curDone = false;
				for (let course of dept["courses"]) {
					//if saw a course from favs in datas : 
					for (miniFav of favs) {
						if (miniFav["nums"] == null) {
							continue;
						}
						if (miniFav["name"] != null && miniFav["nums"].length >0 && course != null && course["course_id"].includes(miniFav["name"]) ){
							
							//filter sections
						
							for (let i = 0 ; i < course["offerings"].length ; i++){ 
								for (let offer of course["offerings"]){

									if (miniFav["nums"].indexOf(offer.course_num) <0){
										course["offerings"].splice(course["offerings"].indexOf(offer),1);
										continue;
									} 
								}
							}
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

	//remove course from favs
	removeFavs(id_sec){
		this.loadFavs().then((value)=>{
			me.setState({loaded: false});
			let id = id_sec.split(" -- ")[0];	
			let num = id_sec.split(" -- ")[1];	
			let favs = JSON.parse(value);
			for (miniFav of favs){
				if (miniFav["name"] == id){
					if (miniFav["nums"] == null) {
						Favs.remove(miniFav);
						break;
					}
					let remove = miniFav["nums"].indexOf(num);
					miniFav["nums"].splice(remove,1);
				}
			}
			AsyncStorage.setItem("favs",JSON.stringify(favs)).then(()=>{
				me.setState({shows : false});
				me.setState({loaded : true});
				me._refresh();
			});
		});
	}

	//nav bar
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerLeft: <Button icon={{name: 'menu', size: 25 }} backgroundColor='rgba(0,0,0,0)' onPress = {()=> { me.setState({shows: false}); navigation.navigate('DrawerOpen');}}/>,
            headerTitle : "My Favorites",
			title: "My Favorites",
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
          <Text style={[isActive ? [styles.activeText, styles.headerActiveText]: [styles.inactiveText, styles.headerInactiveText]]}>{course.course_id} - #{course.offerings.length} - {course.offerings[0].title}</Text>
        </Animatable.View>
      );
    }

    // displays courses and their sections
    _renderContent(course,i,isActive) {
		let sections = [];

	   for (let j = 0; j < course.offerings.length; j++) {
		 let room = course.offerings[j].component[0].room; //lecture
		 let waitlist = course.offerings[j].waitlist; // people on waitlist
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
			   <Button color="green" onPress={()=>{me.removeFavs(course.course_id + " -- "+ course.offerings[j].course_num); }} backgroundColor="rgba(100,123,200,0.6)" title="Remove From Favs" />

			   <Text>{'\n'}</Text>
			</Animatable.View>
		 );
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
      return (
			<ScrollView style={{padding: 10}}>
                <Accordion style={styles.strongShadow}
                  activeSection={this.state.activeSection}
                  sections={this.state.shows}
                  renderHeader={this._renderHeader}
                  renderContent={this._renderContent}
                  duration={100}
                  onChange={this._setSection.bind(this)}
                  easing="easeOutCubic"
                />

			</ScrollView>
      );
	  }
    }
}
