<template>
  <svg
    id="Шар_1"
    data-name="Шар 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1000 1000"
  >
    <title>humidity</title>
    <linearGradient y2="0%" x2="0%" y1="100%" x1="0%" id="fill">
      <stop :stop-color="fillColor" :offset="fill + '%'" id="fill-st-1" />
      <stop stop-color="#000" offset="0%" id="fill-st-2" />
    </linearGradient>
    <path
      class="cls-1"
      fill="url('#F1g')"
      d="M517.27,49.27a22.41,22.41,0,0,0-34.54,0c-69.6,83.67-325.81,337.93-325.81,566.51,0,189.48,153.6,343.08,343.08,343.08s343.08-153.6,343.08-343.08C843.08,387.2,586.87,132.94,517.27,49.27Z"
    />
    <line class="cls-2" x1="347.74" y1="728.38" x2="645" y2="431.12" />
    <circle class="cls-1" cx="413.06" cy="434.86" r="62.95" />
    <circle class="cls-1" cx="589.32" cy="728.24" r="62.95" />
  </svg>
</template>

<script>
const fillColor = "#165d94"; // #043967

export default {
  props: {
    fill: Number
  },

  setup() {
    return {
      fillColor
    };
  }
};
</script>

<style>
.cls-1,
.cls-2 {
  stroke: #dfeaf2;
  stroke-miterlimit: 10;
  stroke-width: 35.77px;
}
.cls-2 {
  stroke-linecap: round;
}
.cls-1 {
  fill: url("#fill");
}
</style>
