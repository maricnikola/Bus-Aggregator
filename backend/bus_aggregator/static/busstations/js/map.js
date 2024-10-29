document.addEventListener('DOMContentLoaded', function () {
    var latitudeField = document.getElementById('id_latitude');
    var longitudeField = document.getElementById('id_longitude');

    // Centar mape na početnu poziciju - Beograd
    var defaultLat = latitudeField.value || 44.787197;  // Default latitude
    var defaultLng = longitudeField.value || 20.457273; // Default longitude
    var defaultLocation = { lat: parseFloat(defaultLat), lng: parseFloat(defaultLng) };

    // Kreiranje mapu
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: defaultLocation,
    });

    // Marker
    var marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true, // Prevlačenje markera
    });

    // Funkcija za zaokruživanje na 6 decimalnih mesta
    function roundToSixDecimals(value) {
        return Math.round(value * 1000000) / 1000000;
    }

    // Kada se klikne na mapu, postavi se marker na to mesto i popune se koordinate
    map.addListener('click', function (event) {
        var clickedLocation = event.latLng;
        marker.setPosition(clickedLocation);

        // Popunjavanje polja sa koordinatama
        latitudeField.value = roundToSixDecimals(clickedLocation.lat());
        longitudeField.value = roundToSixDecimals(clickedLocation.lng());
    });

    // Omogućeno da prevlačenjem markera koordinate budu ažurirane
    marker.addListener('dragend', function (event) {
        latitudeField.value = event.latLng.lat();
        longitudeField.value = event.latLng.lng();
    });
});
