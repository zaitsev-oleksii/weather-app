<template>
  <!-- <button @click="setupLeafletMap">BTN</button> -->
  <div id="mapContainer" class="h-full w-full"></div>
</template>

<script>
import "./leaflet.css";
import L from "leaflet";

export default {
  name: "LeafletMap",

  data() {
    return {
      center: [49.84, 24.03],
      map: null,
      marker: null,
      markerLatLng: []
    };
  },

  props: {
    mapCenter: null
  },

  mounted() {
    this.setupLeafletMap();
  },

  methods: {
    setupLeafletMap() {
      // Access token for mapbox
      // const accessToken =
      //   "pk.eyJ1Ijoib2xla3NpaXphaXRzZXYiLCJhIjoiY2wzbmp1dGJzMGUzazNkbnk5dWVmanVtMCJ9.BvXghcnYPhJbDKcXz45Cvg";
      const mapboxTiles = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "© OpenStreetMap"
        }
      );

      /*L.tileLayer(
        `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
        {
          attribution:
            '© <a hre.f="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          tileSize: 512,
          id: "mapbox.streets",
          zoomOffset: -1
        }
      ); */
      // eslint-disable-next-line
      this.map = L.map("mapContainer")
        .addLayer(mapboxTiles)
        .setView(this.center, 12);

      this.map.on("click", this.handleMapClick);
    },

    handleMapClick(e) {
      const position = e.latlng;
      const markerIconURL =
        "https://i0.wp.com/www.worth.com/wp-content/uploads/2017/09/map-marker-icon.png?w=1024&ssl=1";
      const markerIcon = L.icon({
        iconUrl: markerIconURL,
        iconSize: [38, 38]
      });
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = new L.marker(position, { icon: markerIcon }).addTo(
        this.map
      );

      // console.log({ lat: position.lat, lng: position.lng });
      // this.$emit("location-chosen", { lat: position.lat, lng: position.lng });
      this.$store.commit("setLocation", {
        lat: position.lat,
        lng: position.lng
      });
    },

    changeLocation() {
      this.map.panTo(this.center);
    }
  },
  watch: {
    mapCenter() {
      if (!this.mapCenter) {
        return;
      }

      // console.log("watch called", this.center);
      this.center = [this.mapCenter.lat, this.mapCenter.lng];
      // console.log(this.center);
      this.changeLocation();
    }
  }
};
</script>

<style></style>
