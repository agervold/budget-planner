function initMap() {
  var myLatLng = {lat: 55.6866708, lng: 12.5285764};
  var nandrups = {lat: 55.6845481, lng: 12.5274394};

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 15
  });

  if (pugCoords != null) {
    var infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < pugCoords.length; i++) {
        var marker = new google.maps.Marker({
            map: map,
            position: {lat: pugCoords[i].lat, lng: pugCoords[i].lng},
            title: pugCoords[i].title
        });

        marker.addListener('click', function() {
            var self = this;
            map.setCenter(self.getPosition());
            $.each($(".pugTitle"), function() {
                if (this.innerText === self.getTitle()) {
                    var id = $(this).parents(".temp")[0].id
                    if (pugInfoHidden) {
                        showPugInfo(id);
                    } else {
                        showNewPugInfo(id);
                    }
                    return false;
                }
            });

        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
            infowindow.setContent(pugCoords[i].title);
            infowindow.open(map, marker);
            }
        })(marker, i));
    }
  }

  if (onPugPage) {
    /*SHOW PUG MAP*/
    $("#pugBody #pugInfo div:eq(0)").on("click", function() {
        $("#pugBody #pugInfo #map").toggle();
        initMap();
    });
  }
}