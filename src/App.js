import React, { Component } from 'react';
import "./App.css"
import Home from "./Home"



import { Route,Link,Switch } from "react-router-dom";

const API_KEY = "oN9zdAhzxlbL2Q1mTftpytElUkLCuudk"
var moment = require('moment');


class App extends Component {
  constructor(){
    super();
    this.state = {
      openInput: false,
      countries:[],
      latitude: "",
      longitude: "",
      timezone: "",
      summary:"",
      city:"",
      daily:[]
    }
  }

  addCity = () => {
    this.setState({
      openInput: true
    });
  }

  coordenates = (country) => {
    fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&inFormat=kvp&outFormat=json&location=${country}`)
    .then(res => res.json())
    .then(data => {
      var lat = data.results[0].locations[0].latLng.lat
      var lng = data.results[0].locations[0].latLng.lng
      var city = data.results[0].providedLocation.location
      this.setState({
        latitude: "Latitude: " + data.results[0].locations[0].latLng.lat,
        longitude : "Longitude: " + data.results[0].locations[0].latLng.lng,
        city: data.results[0].providedLocation.location
      })
      this.addInformation(lat, lng);
    })
  }

  addInformation = (lat, lng) => {
    fetch("https://api.darksky.net/forecast/4f250742483450c4a38f5bf0cc93d4ff/" + lat + ',' + lng )
    .then(res => res.json())
    .then(data => {
      console.log(data);
      var timezone = data.timezone
      var summary = data.hourly.summary
      var dayli = data.daily.data
      console.log(dayli)
      this.setState({
        timezone: data.timezone,
        summary: data.hourly.summary,
        daily:[...data.daily.data]
      })
    })
  }

  addLocation = (e) => {
    if(e.keyCode === 13){
      this.setState({
        countries:[...this.state.countries, e.target.value],
        openInput:false,
        inputText:e.target.value
      })
    }
  }

  render() {
    return (
      <div className='app'>
        <header className='app__header'>
          <button onClick={this.addCity} className='app__add'>
            <i className="fas fa-plus-circle"></i>
            New city
          </button>
          <Link to="/Home">Home</Link>
        </header>
        <div className='grid'>
          <aside className='app__aside'>
            <h1 className='app__title'>All countries</h1>
            {this.state.countries.map((country, index) => {
              return <a key={index} onClick={() => this.coordenates(country)} href='#' className='app__country'>
              <Link to={"/cities/" + country}>{country}</Link>
              </a>
            })}
            {this.state.openInput &&
              <input onKeyUp={this.addLocation} type='text' placeholder='Location' className='app__input' />
            }
          </aside>
          <section className='app__view'>
            {this.state.daily.map(day => {
              return(
                <div className="weather--container">
                  <h2 className="time-heading">{moment(`${day.time}`, "X").format('dddd')}</h2>
                  <h3 className="time-secondheading">{moment(`${day.time}`, "X").format("l")}</h3>
                  <i class="fas fa-cloud-sun-rain"></i>
                  <div className="subheading">Temp.</div>
                  <div className="subheading-value">{day.apparentTemperatureHigh}</div>
                  <div className="subheading">Pres.</div>
                  <div className="subheading-value">{day.pressure}</div>
                  <div className="subheading">Wind</div>
                  <div className="subheading-value">{day.windSpeed}</div>
                </div>
              );
            })}
          </section>
        </div>
        <Switch>
          <Route path="/Home" exact Component={App} />
          <Route path="/countries/:countryname"  Component={App} />
        </Switch>
      </div>
    );
  }
}

export default App;
