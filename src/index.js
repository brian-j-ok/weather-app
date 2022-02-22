import './styles/style.css';
import './styles/forecast.css';

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
  console.log(dailyWeatherData);
  const forecast = document.getElementById('forecast');

  dailyWeatherData.forEach((day) => {
    let dailyForecast = document.createElement('div');
    dailyForecast.classList.add('daily-forecast');

    let dailyForecastImage = document.createElement('img');
    dailyForecastImage.setAttribute('data-weather', day.weather[0].main);

    dailyForecast.appendChild(dailyForecastImage);

    forecast.appendChild(dailyForecast);
  });
}