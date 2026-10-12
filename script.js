// 1. Grab elements from the page
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

// 2. Turn Open-Meteo weather codes into readable text
function describeWeather(code) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Rain showers";
  return "Thunderstorm";
}

// 3. Main function: city name -> coordinates -> weather
async function getWeather(city) {
  result.textContent = "Loading...";
  try {
    // Step A: find the city's latitude and longitude
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geoData = await geoRes.json();
    if (!geoData.results) {
      result.innerHTML = `<p class="error">City not found.</p>`;
      return;
    }
    const { latitude, longitude, name, country } = geoData.results[0];

    // Step B: get the current weather for those coordinates
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`
    );
    const weatherData = await weatherRes.json();
    const w = weatherData.current_weather;

    // Step C: show it on the page
    result.innerHTML = `
      <h3>${name}, ${country}</h3>
      <div id="temp">${Math.round(w.temperature)}°F</div>
      <p>${describeWeather(w.weathercode)}</p>
      <p>Wind: ${w.windspeed} mph</p>
    `;
  } catch (error) {
    console.error(error);
    result.innerHTML = `<p class="error">Something went wrong: ${error.message}</p>`;
  }
}

// 4. Run when the button is clicked or Enter is pressed
searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim()) getWeather(cityInput.value.trim());
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});
