const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Ayush's Map",
}).addTo(map);

const markers = {};

// Receiving location updates from server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16);

  if (markers[id]) {
    // Update the existing marker's position
    markers[id].setLatLng([latitude, longitude]);
  } else {
    // Create a new marker for the user
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

// Handling user disconnection
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]); // Remove the marker from the map
    delete markers[id]; // Remove the marker from the markers object
  }
});
