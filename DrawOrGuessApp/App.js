/**
 * Draw or Guess App
 * https://github.com/themreza/DrawOrGuess
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, Button} from 'react-native';

import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

console.disableYellowBox = true;

var originalimageBase64 = "";
var drawingimageBase64 = "";

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
  
  getBase64Image(url, callback){
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result.replace("data:application/octet-stream;base64,", ""));
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  
  componentDidMount(){
    this.getBase64Image('http://lorempixel.com/500/500'+'?random_number=' +new Date().getTime(), (myBase64) => {
      originalimageBase64 = myBase64;
      // Start counting when the page is loaded
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
      }, 5000);
      this.timeoutHandle = setTimeout(()=>{
        this.setState({
              showDrawNow: false,
              showCanvas: true
          });
      }, 8000);
      this.timeoutHandle = setTimeout(()=>{
        this.canvas.getBase64('png', false, true, true, true, (err, result) => {
          drawingimageBase64 = result;
          console.log(originalimageBase64, drawingimageBase64);
          fetch('http://192.168.0.144:3000/savedrawing', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              originalImage: originalimageBase64,
              drawingImage: drawingimageBase64,
            }),
          });
        });
        this.setState({
              showCanvas: false,
              showTimesUp: true
          });
      }, 18000);
    });
  }
  
  componentWillUnmount(){
    clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
  }
  
  _renderImage(){
        if (this.state.showImage) {
            return (
                <Image
                  resizeMode="contain"
                  style={styles.originalimage}
                  source={{uri: 'data:image/jpeg;base64,'+originalimageBase64}}
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
                <View style={{position: 'absolute', right: 0}}>
                    <Button title={' Clear '} style={{}}onPress={() => { this.canvas.clear(); }}/>
                </View>
                <View style={{position: 'absolute', left: 0}}>
                    <Button title={' Save '} onPress={() => {
                        //console.log(this.canvas.getPaths());
                        this.canvas.getBase64('png', false, true, true, true, (err, result) => {
                            drawingimageBase64 = result;
                        })
                    }}/>
                </View>
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
    backgroundColor: '#FFFFFF',
  },
  originalimage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
