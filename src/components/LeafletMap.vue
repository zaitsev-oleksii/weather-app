<template>
  <div id="mapContainer" class="h-full w-full"></div>
</template>

<script>
import "./leaflet.css";
import L from "leaflet";

import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "LeafletMap",

  setup() {
    const store = useStore();

    const center = ref([49.84, 24.03]);
    const map = ref(null);
    const marker = ref(null);

    onMounted(() => setupLeafletMap());

    const setupLeafletMap = () => {
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

      // eslint-disable-next-line
      map.value = L.map("mapContainer")
        .addLayer(mapboxTiles)
        .setView(center.value, 12);

      map.value.on("click", handleMapClick);
    };

    const handleMapClick = (e) => {
      const location = e.latlng;
      setMarker(location);

      store.commit("setLocation", {
        lat: location.lat,
        lng: location.lng
      });
    };

    const changeLocation = () => {
      map.value.panTo(center.value);
    };

    const setMarker = (location) => {
      const markerIconURL =
        "https://i0.wp.com/www.worth.com/wp-content/uploads/2017/09/map-marker-icon.png?w=1024&ssl=1";
      const markerIcon = L.icon({
        iconUrl: markerIconURL,
        iconSize: [38, 38]
      });
      if (marker.value) {
        map.value.removeLayer(marker.value);
      }
      marker.value = new L.marker(location, { icon: markerIcon }).addTo(
        map.value
      );
    };

    watch(
      () => store.state.location,
      () => {
        if (!store.state.location) return;

        center.value = [store.state.location.lat, store.state.location.lng];

        changeLocation();
        setMarker(store.state.location);
      }
    );
  }
};
</script>

<style></style>
