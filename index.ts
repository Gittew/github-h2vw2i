/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var el;
var count=0;
var u : string = ""
function initMap(): void {

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
    }
  );

  const input = document.getElementById("pac-input") as HTMLInputElement;



  // Specify just the place data fields that you need.
  const autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["place_id", "geometry", "formatted_address", "name"],
  });


  autocomplete.bindTo("bounds", map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById(
    "infowindow-content"
  ) as HTMLElement;

  infowindow.setContent(infowindowContent);

  const marker = new google.maps.Marker({ map: map });

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });

  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    count++;
   

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    var service = new google.maps.places.PlacesService(map);
    
    service.getDetails({
        placeId: place.place_id,
        fields: ['url']
    }, function(place, status) {
        if (      status === google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry &&
          place.geometry.location) {
            u =place.url

        }
        

    });

    // Set the position of the marker using the place ID and location.
    // @ts-ignore This should be in @typings/googlemaps.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location,

    });

    marker.setVisible(true);
     

    (
      infowindowContent.children.namedItem("place-name") as HTMLElement
    ).textContent = place.name as string;
    (
      infowindowContent.children.namedItem("place-id") as HTMLElement
      
    ).textContent = place.place_id as string;
    (
      infowindowContent.children.namedItem("place-address") as HTMLElement
    ).textContent = place.formatted_address;

    if(u==""||u==null){u=encodeURI("https://www.google.com/maps/search/"+place.name)}
    
    var openURL=`https://script.google.com/macros/s/AKfycbzZOCL_JXPXAeNMcdnAsBiUimniEAD2-Rg4PyoFXYeHHl7aHcYp34eyLF0lGLRw9lbd/exec?p1=${place.place_id}&p2=${decodeURI(place.formatted_address)}&p3=${decodeURI(place.name)}&p4=${encodeURIComponent(u)}`

     //if(el.length==2){document.removeChild(el[0].remove()) }
    const idbutton:HTMLButtonElement = <HTMLButtonElement>document.createElement('button');
    idbutton.textContent = "追加する";
    idbutton.name="BTN"
    var el =document.getElementsByName("BTN")
    idbutton.onclick = function() {
      alert(u)
      window.open(openURL, '_blank');
      //window.open(encodeURI(u), '_blank');
      document.removeChild(el[0].remove())
    }

  

    infowindowContent.appendChild(idbutton)
    


      


    infowindow.open(map, marker);
    //document.removeChild(el[0].remove())
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
