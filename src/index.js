import './styles/style.css';
import './styles/forecast.css';

import { format, fromUnixTime } from 'date-fns';

let latitude = 0;
let longitude = 0;

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
  const response = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly&appid=e33abff516f8fc21eb34082ce41dc0bb', {mode: 'cors'});
  const weatherData = await response.json();
  console.log(weatherData);
  generateForecast(weatherData.daily);
}

function generateForecast(dailyWeatherData) {
  const forecast = document.getElementById('forecast');

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