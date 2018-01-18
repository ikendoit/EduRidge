import React from 'react'; 
import { View, Text } from 'react-native' ;
import * as styles from "./styles.js"; 

export default class Policy extends React.Component { 
	//nav bar
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerLeft: <Button icon={{name: 'menu', size: 25 }} backgroundColor='rgba(0,0,0,0)' onPress = {()=> { me.setState({shows: false}); navigation.navigate('DrawerOpen');}}/>,
            headerTitle : "Policy and Copyrights",
			title: "Policy and Copyrights",
        }
    };

	//render
	render(){
		return(
			<View> 
				<Text style={introStyles.description}>
					<Text>1. The Falcon-Ridge Application does not affiliate with any Langara Service.</Text>
					<Text>2. This application was made entirely independently from any Langara's party.</Text> 
					<Text>3. Falcon-Ridge was provided with permission to use Langara's public Dara.</Text>
				</Text>
			</View>
		);
	}
}
