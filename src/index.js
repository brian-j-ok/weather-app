import './styles/style.css';

fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=e33abff516f8fc21eb34082ce41dc0bb', {mode: 'cors'})
.then(function(response) {
  return response.json();
})
.then(function(response) {
  console.log(response);
});