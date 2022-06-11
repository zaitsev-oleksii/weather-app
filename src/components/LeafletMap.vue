<template>
  <div id="mapContainer" class="h-full w-full"></div>
</template>

<script>
import "../assets/leaflet.css";
import L from "leaflet";

import { ref, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";

const intialCenter = [49.84, 24.03];

export default {
  name: "LeafletMap",

  setup() {
    const store = useStore();

    const map = ref(null);
    const marker = ref(null);

    const currentLocation = computed(() => store.state.location);

    onMounted(() => {
      setupLeafletMap();
      if (currentLocation.value) {
        changeLocation(currentLocation.value);
        setMarker(currentLocation.value);
      }
    });

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

      const center = currentLocation.value ?? intialCenter;
      map.value = L.map("mapContainer")
        .addLayer(mapboxTiles)
        .setView(center, 12);

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

    const changeLocation = (location) => {
      const { lat, lng } = location;
      map.value.panTo([lat, lng]);
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

    watch(currentLocation, () => {
      if (!currentLocation.value) return;

      changeLocation(currentLocation.value);
      setMarker(currentLocation.value);
    });
  }
};
</script>

<style></style>
