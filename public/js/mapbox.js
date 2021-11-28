// <!-- mapbox-gl -->
mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 15, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

map.addControl(new mapboxgl.FullscreenControl());

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h4>${campground.title}</h4><p>${campground.location}</p> `
);

new mapboxgl.Marker({ color: "teal", rotation: 35 })
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
