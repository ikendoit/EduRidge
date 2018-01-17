import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';

import {Button, Icon} from 'react-native-elements';


// for styles and stuff
import * as styles from './styles.js';

// for accordion
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

export default class CourseLister extends React.Component {

  static me = null;
  static navigationOptions = ({navigation,screenProps}) => {
	return { 
		headerStyle: {
		  /* F15A22 - orange */
		  backgroundColor: '#3f91f5'
		},
	//	headerLeft : <Button style="margin-left:-30px" backgroundColor='rgba(200,0,0,0)' icon={{name: "chevron-left", size:30}} onPress={()=>navigation.goBack()} />,
		headerTitle: `${navigation.state.params.dept}`,
		title: "Courses",
		headerTintColor: 'white',
	}
  };
  
  constructor(props, context) {  
    super(props, context);
    this.state = {
      loaded: false,
      activeSection: false,
    };
  }  

  // if the view has loaded fully, update state
  componentDidMount() {
    this.setState({
      loaded: true,
      //load datas from departments JS
      data: this.props.navigation.state.params.coursesData,
      title: this.props.navigation.state.params.dept,
    });
  }

  componentWillMount(){
  	me = this;
  }
  
  // Sets section to 'expanded'
  _setSection(section) {
    this.setState({ activeSection: section });
  }

  //add course to fav async storage 
  addFavs(id_sec) {
  	/*generate json of favs : 
		favs : 
			name : string 
			nums : []
	*/
  	AsyncStorage.getItem("favs").then((value)=>{ 
		let favs = [];

		//if storage is not empty 
		if (value != null) {
			favs=JSON.parse(value);
		}

		//boolean helps checking if course_id is stored
		let contained = false;

		//parse fav course id 
		let id = id_sec.split(" -- ")[0];
		let num = id_sec.split(" -- ")[1];

		//check all stored 
		for (miniFav of favs){
			//if course_id already stored
			if (miniFav["name"] == id){
				if (miniFav["nums"] == null){
					miniFav["nums"] = []; 
				}
				if (miniFav["nums"].indexOf(num) < 0){
					miniFav["nums"].push(num);
				}
				contained = true; 
			}
		}
		//if this is a new course_id
		if (!contained) {
			favs.push({
				"name" : id,
				"nums" : [num],
			});
		}
		AsyncStorage.setItem("favs",JSON.stringify(favs));
	});
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
  _renderContent(course, i, isActive) {
    let sections = [];
    for (let j = 0; j < course.offerings.length; j++) {
      let room = course.offerings[j].component[0].room; //lecture
      let waitlist = course.offerings[j].waitlist; // people on waitlist
        sections.push(
          <Animatable.View transition="backgroundColor" key={i+j} duration={500} style={[{paddingLeft: 20, paddingRight: 20}, isActive ? styles.active : styles.inactive]}>
            <Animatable.Text style={[{textAlign: 'center', padding: 10}, styles.activeText]} >Section {course.offerings[j].section} - CN: {course.offerings[j].course_num}</Animatable.Text>
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
			<Button color="green"  onPress={()=>{ me.addFavs(course.course_id + " -- "+ course.offerings[j].course_num); }} backgroundColor="rgba(0,123,200,0.6)" title="Add To Favorite" />

            <Text>{'\n'}</Text>
          </Animatable.View>
        );
    }
    return sections;
  }

  // main render function
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
		<View>
          <ScrollView style={{padding: 10}}>
              <Accordion style={styles.strongShadow}
                activeSection={this.state.activeSection}
                sections={this.state.data}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                duration={100}
                onChange={this._setSection.bind(this)}
                easing="easeOutCubic"
              />
          </ScrollView>
		</View>
    );
  }
  // show loading view while data is being loaded
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.animating}
          style={[styles.centering, {height: 80}]}
          size="large"
          color="#0000ff"
        />
      </View>
    );
  }
}

