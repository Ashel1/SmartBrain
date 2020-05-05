import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";
import Rank from './Components/Rank/Rank';
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Particles from "react-particles-js";

const app = new Clarifai.App({
  apiKey: "82b03225cfa24739bebe0a0aa93db013",
});

const particlesOptions = {
  particles: {
    number:{
      value: 80,
      density:{
        enable: true,
        value_area: 800
      }
    }
}
};

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageURL: '',
      box:{},
      route: 'SignIn',
      isSignedIn: false
    }
  }

calculateFaceLocation= (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image= document.getElementById('inputImage');
  const width=Number(image.width);
  const height=Number(image.height);
  console.log(width,height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - clarifaiFace.right_col * width,
    bottomRow: height - clarifaiFace.bottom_row * height
  };
}

displayFaceBox= (box) =>{
  console.log(box);
  this.setState({box:box});
}

onInputChange=(event)=>{
  this.setState({input:event.target.value});
}

onButtonSubmit= () =>{
  this.setState({imageURL:this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err=>console.log(err)
      )
}

onRouteChange= (route) =>{
  if(route === 'signout'){
    this.setState({isSignedIn: false});
  }
  else if(route === 'home' ){
    this.setState({isSignedIn: true})
  }
  this.setState({route:route});  
}

  render(){
    const {isSignedIn,imageURL,route,box} = this.state;
  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition
            box={box}
            imageURL={imageURL}
          />
        </div>
      ) : route === "SignIn" ? (
        <SignIn onRouteChange={this.onRouteChange} />
      ) : (
        <Register onRouteChange={this.onRouteChange} />
      )}
    </div>
  );
}
}

export default App;
