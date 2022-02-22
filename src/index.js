import './styles/style.css';

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
  const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=e33abff516f8fc21eb34082ce41dc0bb', {mode: 'cors'});
  const currentWeatherData = await response.json();
  console.log(currentWeatherData);
}