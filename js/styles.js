import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  /* general styling */
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  content: {
    padding: 20,
  },
  /* course lister styling */
  strongShadow: {
    shadowOpacity: 0.75,
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
  },
  active: {
    backgroundColor: '#3f91f5', /* color theme */
    
  },
  activeText: {
    color: 'white',
    padding: 10,
  },
  headerActiveText: {
    fontSize: 16,
    color: 'white',

  },
  headerInactiveText: {
    borderRadius: 101,
    backgroundColor: '#3f91f5', /* color theme */
    color: 'white',

    /* shadowing effect weak */
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOffset: { height: 0, width: 0 },
  },
  inactive: {
    backgroundColor: '#e9e9ef',
    
  },
  inactiveText: {
    padding: 10,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
  },
  /* tutorial view styles */
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },
  modal3: {
    height: 300,
    width: 300
  },
  modal4: {
    height: 300
  },
  text: {
    color: "black",
    fontSize: 22
  },
});

module.exports = styles;
