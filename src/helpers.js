import { preferencesConfig } from "./config";

export const kelvinsToPreferredTemp = (temp, tempPreference) => {
  if (tempPreference === preferencesConfig.temperature.celsius) {
    return temp - 273.15;
  }
  if (tempPreference === preferencesConfig.temperature.fahrenheit) {
    return (temp - 273.15) * 1.8 + 32;
  }
  return temp;
};

export const formatPressure = (pressure, pressurePreference) => {
  if (pressurePreference === preferencesConfig.pressure.inhg) {
    return pressure * 0.02953;
  }
  return pressure;
};

export const formatWindSpeed = (windSpeed, windSpeedPreference) => {
  if (windSpeedPreference === preferencesConfig.windSpeed.kmph) {
    return windSpeed * 3.6;
  }
  if (windSpeedPreference === preferencesConfig.windSpeed.mph) {
    return windSpeed * 2.23694;
  }
  return windSpeed;
};
