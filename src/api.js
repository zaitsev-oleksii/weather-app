// const WEATHER_API_KEY = "42e19325d76941a898082725222805";
const WEATHER_API_KEY = "f88d5cc2fbae75f7dfa60fd059792f0c";
const PLACE_BY_LOC_KEY = "42e19325d76941a898082725222805";
const AUTOCOMPLETE_ACCESS_TOKEN = "pk.c4c504420e844b45f50ec36aa44e6098";
let autocomplete_ts = Date.now();

const unixTsToJsTs = (unixTs) => unixTs * 1000;

export const getCurrentWeatherData = async (location) => {
  const { lat, lng } = location;

  // Openweathermap
  const reqURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`;
  const parsedData = await fetch(reqURL)
    .then((res) => res.json())
    // .then((res) => res.current)
    .catch((error) => {
      console.log(
        "Error occured while getting current weather from API. ",
        error
      );
    });

  console.log(parsedData);
  if (!parsedData) {
    return;
  }

  const temp = parsedData.main.temp;
  const feelsLikeTemp = parsedData.main.feels_like;
  const text = parsedData.weather.description;
  const datetime = unixTsToJsTs(parsedData.dt);
  console.log(datetime);
  return {
    datetime,
    temp,
    text,
    feelsLikeTemp
  };
};

export const getHourlyWeatherData = async (location) => {
  const { lat, lng } = location;
  // Openweathermap

  const reqURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`;
  const parsedData = await fetch(reqURL)
    .then((res) => res.json())
    .catch((error) => {
      console.log(
        "Error occured while getting today weather from API. ",
        error
      );
    });

  const nextDayStr = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate() + 1}`;
  const nextDayTs = Date.parse(nextDayStr);

  const hours = parsedData.hourly
    .filter((hour) => unixTsToJsTs(hour.dt) < nextDayTs)
    .map((hour) => ({
      datetime: unixTsToJsTs(hour.dt),
      temp: hour.temp - 273.15,
      humidity: hour.humidity,
      windSpeed: hour.wind_speed,
      windDegree: hour.wind_deg,
      pressure: hour.pressure * 0.02953,
      cloudCover: hour.clouds,
      uv: hour.uvi
    }));

  return {
    hours
  };
};

export const getDailyWeatherData = async (location) => {
  const { lat, lng } = location;

  // Openwethermap
  const reqURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`;
  const parsedData = await fetch(reqURL)
    .then((res) => res.json())
    .catch((error) => {
      console.log(
        "Error occured while getting today weather from API. ",
        error
      );
    });

  const days = parsedData.daily.map((day) => ({
    datetime: unixTsToJsTs(day.dt),
    avgTemp:
      (day.temp.day + day.temp.eve + day.temp.morn + day.temp.night) / 4 -
      273.15,
    sunrise: unixTsToJsTs(day.sunrise),
    sunset: unixTsToJsTs(day.sunset),
    rainingChance: day.pop * 100,
    humidity: day.humidity,
    uv: day.uvi
  }));

  return { days };
};

export const getPlacesAutocompleteSuggestions = async (prefix, limit) => {
  // const fetchedCities = await fetch(
  //   `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix=${prefix}`
  // );

  // SAD STORY TO HANDLE 2 REQS/S API LIMIT
  if (Date.now() - autocomplete_ts < 500) {
    return;
  }
  if (prefix?.length < 2) {
    return;
  }

  const parsedPlacesData = await fetch(
    `https://api.locationiq.com/v1/autocomplete.php?key=${AUTOCOMPLETE_ACCESS_TOKEN}&q=${prefix}`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.log(
        "Error occured while getting autocomplete suggestions. ",
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

export const getPlaceByLocation = async (location) => {
  const { lat, lng } = location;

  const reqURL = `http://api.weatherapi.com/v1/search.json?key=${PLACE_BY_LOC_KEY}&q=${lat},${lng}`;
  const parsedData = await fetch(reqURL)
    .then((res) => res.json())
    .then((r) => r[0])
    .catch((error) => {
      console.log("Error occured while getting place name from API. ", error);
    });
  if (!parsedData) {
    return;
  }
  return {
    name: parsedData.name,
    country: parsedData.country
  };
};
