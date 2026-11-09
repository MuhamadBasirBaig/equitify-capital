/* Blue-pin locations map. Used by index.html and investment-portfolio.html.
   Expects #pfLocsMap and #pfLocsCount on the page; pins come from map-locations.js. */
(function(){
  "use strict";
  var locations = window.MAP_LOCATIONS || [];
  var el = document.getElementById("pfLocsMap");
  if(!window.L || !locations.length){ el.closest("section").style.display = "none"; return; }

  var states = {};
  locations.forEach(function(p){ states[p.state] = true; });
  var stateCount = Object.keys(states).length;
  document.getElementById("pfLocsCount").textContent =
    locations.length + " locations across " + stateCount + " state" + (stateCount === 1 ? "" : "s");

  /* No wheel zoom, and no one-finger drag on phones, so the page keeps scrolling. */
  var map = L.map(el, { scrollWheelZoom:false, dragging:!L.Browser.mobile });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:19,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var pinIcon = L.divIcon({
    className:"pf-pin", iconSize:[28,38], iconAnchor:[14,38], popupAnchor:[0,-34],
    html:'<svg width="28" height="38" viewBox="0 0 28 38" aria-hidden="true"><path d="M14 1C6.8 1 1 6.8 1 14c0 9.7 13 23 13 23s13-13.3 13-23C27 6.8 21.2 1 14 1z" fill="#2A93E6" stroke="#fff" stroke-width="1.5"/><circle cx="14" cy="14" r="4.8" fill="#fff"/></svg>'
  });

  var bounds = [];
  locations.forEach(function(p){
    var pop = document.createElement("div");
    var a = document.createElement("div"); a.className = "pf-pop-addr"; a.textContent = p.address;
    var c = document.createElement("div"); c.className = "pf-pop-city"; c.textContent = p.city + ", " + p.state + " " + p.zip;
    pop.appendChild(a); pop.appendChild(c);
    L.marker([p.lat, p.lng], { icon:pinIcon, title:p.address + ", " + p.city + ", " + p.state, alt:p.address + ", " + p.city + ", " + p.state })
      .addTo(map).bindPopup(pop);
    bounds.push([p.lat, p.lng]);
  });
  map.fitBounds(bounds, { padding:[40,40] });
})();
