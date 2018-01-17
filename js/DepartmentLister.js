import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight,
  TextInput,
  FlatList,
  AsyncStorage,
} from 'react-native';

import {
  Button, Icon
} from 'react-native-elements';

// for styles and stuff
import * as styles from './styles.js';

export default class DepartmentLister extends React.Component {
    //Ken
    //Following a component design pattern, which help changing static context (eg: NavigationOption)

    static me = null;

	//**********************Component initialization
	// set navigation params for static context switching
    _setNavigationParams(){
        let opened = this.state.opened;

		let textInput = <TextInput placeholder="search" autoFocus={true} style={{backgroundColor: "white", width: 200}} onChangeText={(text)=>this.textSearch(text)} />; 

		let closeButton = <Button icon={{name: 'clear', size: 25 }} backgroundColor='rgba(0,0,0,0)' onPress = {()=> {this.onButtonPress()}}/>;

		let searchButton = <Button icon={{name: 'search', size: 25 }} backgroundColor='rgba(0,0,0,0)' onPress = {()=> this.onButtonPress()}/>;

        this.props.navigation.setParams({
            opened,
			textInput, 
			closeButton, 
			searchButton,
        });
    }

    constructor(props) {
      super(props);
      this.state = {
        loaded: false,
        dpts: [],
        opened : false,
		searcher : "",
      }
	  //load data into state.dpts
	  AsyncStorage.getItem("data").then((value)=> this.setState({dpts:JSON.parse(value), loaded: true,}));
    }

	//After this component has mounted
    componentWillMount() {
		me = this;
		this.setState({opened : false});
    }

	componentDidMount(){
		this._setNavigationParams();
	}

	//**************************SEARCHES

	//change between nav mode bs search mode
	onButtonPress(){
		let changeOpened = ! this.state.opened;
		this.setState({ 
			opened : changeOpened 
		}, ()=> {
			console.log("what" +this.state.opened);
			this._setNavigationParams();
			if (this.state.opened == false) {
				this.textSearch("");
			}
		});
	}

	//search for courses based on text in search bar
	//@params: text : from search bar
	textSearch(text){
		if (text == "" ) {
			this.setState({ 
				searchCourses : []
			});				
			return;
		}
		allCourses = [] ;
		for (let i = 0 ; i < this.state.dpts.length ; i++){
			this.state.dpts[i].courses.forEach((course)=> {
				if (course["course_id"].toUpperCase().includes(text.toUpperCase())) {
					allCourses.push(course);
				}
			});
		}

		this.setState({
			searchCourses : allCourses,
			seacher : text,
		});
		
		return allCourses;
	}

    static navigationOptions = ({navigation,screenProps}) => {
        const params = navigation.state.params || {};
		//checking if search is on
		console.log(params.opened);
		const opened = params.opened || false;
        return {
            //set header right : 2 ways: in search mode or normal mode
            headerLeft:  
               <Button icon={{name: 'menu', size: 25 }} backgroundColor='rgba(0,0,0,0)' onPress = {()=> {navigation.navigate('DrawerOpen');}}/>,

            //set title, 2 ways.
            headerTitle : ( params.opened  ? params.textInput : "Departments" ), 
            //set header right 
            headerRight : (  opened ? params.closeButton :params.searchButton ), 
			//title for navigation 
			title: "Departments",
        }
     };

   	//************************************RENDER + showing
    // generate list of components showing courses within departments
    showDepartments()  {
      const courses = [];
      const {navigate} = this.props.navigation;

      //if we are showing search view
      if (this.state.searchCourses != null && this.state.searchCourses.length != 0){
      	let finds = this.state.searchCourses;
      	for (let i = 0 ; i < finds.length ; i++){ 
      		courses.push(
      			<View key={finds[i]["course_id"]}> 
      				<Button style={{paddingBottom : 10, paddingTop : 10}} onPress={ ()=>navigate("Courses",{
      					coursesData: [finds[i],], 
      					dept : "Searches"
      				})}
      				title={finds[i]["course_id"]} 
      				backgroundColor="#3f91f5" 
      				raised/>
      			</View>
      		);
      	}

      //else if we are doing normal depts view
      } else {
      	let departments = this.state.dpts;
      	for (let i = 0; i < departments.length; i++){
		  //generate list of components containing every course and its departments
      	  courses.push(
      		<View key={departments[i].dept}>
      		  <Button style={{paddingBottom: 10, paddingTop: 10}}
      			onPress={ ()=> navigate('Courses', { 
      			  coursesData: departments[i].courses, 
      			  dept: departments[i].dept
      			})}
      		  title={departments[i].dept}
      		  backgroundColor="#3f91f5"
      		  raised/>
      		</View>
      	  );
      	}
      }
      return courses;
    }

    // loading view while deparments are being pulled from the server
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

    //main renderer
    render() {
      if (!this.state.loaded) {
        return this.renderLoadingView();
      }
      return(
        <ScrollView>
          {this.showDepartments()}
        </ScrollView>

      );
    }
};
