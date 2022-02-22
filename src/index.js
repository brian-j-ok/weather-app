import './styles/style.css';
import './styles/forecast.css';
import './styles/current.css';

import { format, fromUnixTime } from 'date-fns';

let latitude = 0;
let longitude = 0;

let city = null;
let state = null;

const searchBar = document.getElementById('search');
searchBar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
  search();
});

if('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeather();
  })
} else {
  console.log('no geolocation');
}

const getWeather = async () => {
  try {
    const response = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly&appid=e33abff516f8fc21eb34082ce41dc0bb', {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData);
    await reverseGeocode();
    generateCurrent(weatherData.current);
    generateForecast(weatherData.daily);
  } catch (error) {
    console.log(error);
  }
}

const reverseGeocode = async () => {
  try {
    const response = await fetch('http://api.openweathermap.org/geo/1.0/reverse?lat=' + latitude + '&lon=' + longitude + '&limit=1&appid=e33abff516f8fc21eb34082ce41dc0bb', {mode: 'cors'});
    const locationData = await response.json();
    city = locationData[0].name;
    state = locationData[0].state;
  } catch (error) {
    console.log(error);
  }
}

// Search Bar Functionality
async function search() {
  let input = searchBar.value.split(',');

  let locationData = null;

  if (input.length > 1) {
    city = input[0].replace(/\s+/g, '');
    state = input[1].replace(/\s+/g, '');

    const response = await fetch ('http://api.openweathermap.org/geo/1.0/direct?q=' + city + ',' + state + ',US&limit=1&appid=e33abff516f8fc21eb34082ce41dc0bb');
    locationData = await response.json();

    console.log(locationData);
  } else {
    city = input[0].replace(/\s+/g, '');

    const response = await fetch ('http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=e33abff516f8fc21eb34082ce41dc0bb');
    locationData = await response.json();
  }

  latitude = locationData[0].lat;
  longitude = locationData[0].lon;

  getWeather();
}

// Create Current Weather Forecast with DOM Elements
function generateCurrent(currentWeatherData) {
  const current = document.getElementById('current');

  while (current.firstChild) {
    current.removeChild(current.firstChild);
  }

  const dateTime = fromUnixTime(currentWeatherData.dt);

  let location = document.createElement('h2');
  location.innerText = city + ', ' + state;

  let currentWeatherImage = document.createElement('img');
  currentWeatherImage.setAttribute('data-weather', currentWeatherData.weather[0].main);

  let currentWeather = document.createElement('h3');
  currentWeather.innerText = currentWeatherData.weather[0].main;

  let currentTemp = document.createElement('h3');
  currentTemp.innerText = Math.round((currentWeatherData.temp - 273.15) * 9/5 + 32);

  current.appendChild(location);
  current.appendChild(currentWeatherImage);
  current.appendChild(currentWeather);
  current.appendChild(currentTemp);
}

// Create 7 Day Forecast with DOM Elements
function generateForecast(dailyWeatherData) {
  const forecast = document.getElementById('forecast');

  while (forecast.firstChild) {
    forecast.removeChild(forecast.firstChild);
  }

  dailyWeatherData.forEach((day) => {
    const dateTime = fromUnixTime(day.dt);

    // Creates Daily Forecast Container
    let dailyForecast = document.createElement('div');
    dailyForecast.classList.add('daily-forecast');

    // Finds the day of the week for forecast and displays as a header
    let weekDay = document.createElement('h2');
    weekDay.innerText = format(dateTime, 'EEE');

    // Creates Forecast Image and Sets Data Attribute which links to appropriate image in forecast.css
    let dailyForecastImage = document.createElement('img');
    dailyForecastImage.setAttribute('data-weather', day.weather[0].main);

    // Create Min and Max Temperature
    let dailyForecastMinMax = document.createElement('div');
    dailyForecastMinMax.classList.add('min-max');

    let dailyForecastMax = document.createElement('p');
    dailyForecastMax.innerText = Math.round((day.temp.max - 273.15) * 9/5 + 32);
    let dailyForecastMin = document.createElement('p');
    dailyForecastMin.innerText = Math.round((day.temp.min - 273.15) * 9/5 + 32);

    dailyForecastMinMax.appendChild(dailyForecastMax);
    dailyForecastMinMax.appendChild(dailyForecastMin);

    // Append all elements together
    dailyForecast.appendChild(weekDay);
    dailyForecast.appendChild(dailyForecastImage);
    dailyForecast.appendChild(dailyForecastMinMax);

    forecast.appendChild(dailyForecast);
  });
}