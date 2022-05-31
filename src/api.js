const WEATHER_API_KEY = "42e19325d76941a898082725222805";
const AUTOCOMPLETE_ACCESS_TOKEN = "pk.c4c504420e844b45f50ec36aa44e6098";
let autocomplete_ts = Date.now();

export const getCurrentWeatherData = async ({ lat, lng }) => {
  // Openweather
  // const API_KEY = "f88d5cc2fbae75f7dfa60fd059792f0c";
  // const reqURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${API_KEY}`;
  // Weatherapi
  if (!(lat && lng)) {
    return;
  }
  const reqURL = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lng}`;
  const parsedData = await fetch(reqURL)
    .then((res) => res.json())
    .then((res) => res.current)
    .catch((error) => {
      console.log(
        "Error occured while getting current weather from API. ",
        error
      );
    });
  if (!parsedData) {
    return;
  }
  const imgSrc = parsedData.condition.icon;
  const datetime = parsedData.last_updated;
  const currentTemp = parsedData.temp_c;
  const text = parsedData.condition.text;
  const feelsLikeTemp = parsedData.feelslike_c;

  return {
    imgSrc,
    datetime,
    currentTemp,
    text,
    feelsLikeTemp
  };
};

export const getTodayWeatherData = async ({ lat, lng }) => {
  // Weatherapi
  if (!(lat && lng)) {
    return;
  }
  const reqURL = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lng}&days=1&aqi=yes`;
  const parsedData = await fetch(reqURL)
    .then((res) => res.json())
    .catch((error) => {
      console.log(
        "Error occured while getting today weather from API. ",
        error
      );
    });
  // console.log(parsedData);
  const hours = parsedData.forecast.forecastday[0].hour.map((hour) => ({
    imgSrc: hour.condition.icon,
    datetime: new Date(hour.time),
    temp: hour.temp_c,
    humidity: hour.humidity,
    windSpeed: hour.wind_kph,
    windDegree: hour.wind_degree,
    pressure: hour.pressure_in,
    cloudCover: hour.cloud,
    uv: hour.uv
  }));

  return {
    hours,
    aqi: {
      pm2_5: parsedData.current.air_quality.pm2_5,
      pm10: parsedData.current.air_quality.pm10
    }
  };
};

export const getForecastWeatherData = async ({ lat, lng }) => {
  // Weatherapi
  if (!(lat && lng)) {
    return;
  }
  const reqURL = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lng}&days=7`;
  const parsedData = await fetch(reqURL)
    .then((res) => res.json())
    .then((r) => r.forecast.forecastday)
    .catch((error) => {
      console.log(
        "Error occured while getting today weather from API. ",
        error
      );
    });
  // console.log(parsedData);
  return parsedData.map((forecastday) => ({
    imgSrc: forecastday.day.condition.icon,
    datetime: new Date(forecastday.date),
    minTemp: forecastday.day.mintemp_c,
    maxTemp: forecastday.day.maxtemp_c
  }));
};

export const getPlacesAutocompleteSuggestions = async (prefix, limit) => {
  // const fetchedCities = await fetch(
  //   `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix=${prefix}`
  // );

  // SAD STORY TO HANDLE 2 REQS/S API LIMIT
  if (Date.now() - autocomplete_ts < 500) {
    // console.log("hi");
    return;
  }
  if (prefix?.length < 2) {
    return;
  }

  const parsedPlacesData = await fetch(
    `https://api.locationiq.com/v1/autocomplete.php?key=${AUTOCOMPLETE_ACCESS_TOKEN}&q=${prefix}`
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res.status);
      }
    })
    .catch((error) => {
      console.log(
        "Error occured while getting today weather from API. ",
        error
      );
    });

  autocomplete_ts = Date.now();

  if ("error" in parsedPlacesData) {
    return;
  }

  return parsedPlacesData
    .map((place) => ({
      placeName: place.display_name,
      lat: place.lat,
      lon: place.lon
    }))
    .slice(0, limit);
};
