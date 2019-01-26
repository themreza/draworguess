/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';

import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

console.disableYellowBox = true;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
        
type Props = {};
export default class App extends Component<Props> {
  
  constructor(props) {
    super(props);
    this.state = {
      showReadySetGo: true,
      showTimesUp: false,
      showImage: false,
      showCanvas: false,
      showDrawNow: false,
    };
  }

  componentDidMount(){
    // Start counting when the page is loaded
    console.log("Hello!");
      this.timeoutHandle = setTimeout(()=>{
        this.setState({
              showReadySetGo: false,
              showImage: true
          });
      }, 3000);
      this.timeoutHandle = setTimeout(()=>{
        this.setState({
              showImage: false,
              showDrawNow: true
          });
      }, 5500);
      this.timeoutHandle = setTimeout(()=>{
        this.setState({
              showDrawNow: false,
              showCanvas: true
          });
      }, 7000);
      this.timeoutHandle = setTimeout(()=>{
        this.setState({
              showCanvas: false,
              showTimesUp: true
          });
      }, 24000);
  }
  
  componentWillUnmount(){
    clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
  }
  
  _renderImage(){
        if (this.state.showImage) {
            return (
                <Image
                  style={{width: 500, height: 500}}
                  source={{uri: 'http://lorempixel.com/500/500'+'?random_number=' +new Date().getTime()}}
                />
            );
        } else {
            return null;
        }
    }
  
  _renderCanvas(){
        if (this.state.showCanvas) {
            return (
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <SketchCanvas
                  ref={ref => this.canvas = ref}
                  style={{ flex: 1 }}
                  strokeColor={'black'}
                  strokeWidth={4}
                />
              </View>
            );
        } else {
            return null;
        }
    }
  
  _renderTimesUp(){
        if (this.state.showTimesUp) {
            return (
              <Text style={{fontSize: 30, textAlign: 'center'}}>Time's up!</Text>
            );
        } else {
            return null;
        }
  }
  
  _renderReadySetGo(){
        if (this.state.showReadySetGo) {
            return (
              <Text style={{fontSize: 30, textAlign: 'center'}}>You have 1 second to look at this image!</Text>
            );
        } else {
            return null;
        }
  }
  
  _renderDrawNow(){
        if (this.state.showDrawNow) {
            return (
              <Text style={{fontSize: 30, textAlign: 'center'}}>You have 10 seconds to draw what you saw!</Text>
            );
        } else {
            return null;
        }
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderReadySetGo()}
        {this._renderImage()}
        {this._renderCanvas()}
        {this._renderDrawNow()}
        {this._renderTimesUp()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
