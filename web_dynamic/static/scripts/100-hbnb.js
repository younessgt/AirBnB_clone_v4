$(document).ready(function () {
  let listCheckedAmenities = {};
  let listCheckedStates = {};
  let listCheckedCities = {};

  // update h4 tag with the list of amenities checked
  function updateTag1 () {
    const tagList = Object.values(listCheckedAmenities);
    // taglist is an array that contain all the values of listCheckedAmenities array
    // it conatin the values and not the keys
    if (tagList.length !== 0) {
      $('.amenities h4').text(tagList.join(', '));
    } else {
      $('.amenities h4').text('\u00A0');
      // '\u00A0' is same as &nbsp non-breaking space we can use to
      // $('.amenities h4').html('&nbdp');
      // if we dont do this condition and we uncheck all the checkboxs
      // the last value in the array
      // will appeared in h4 tag even if it is unchecked
    }
  }
  // update h4 tag with the list of checked states
  function updateTag2 () {
    const tagList = Object.values(Object.assign({}, listCheckedStates, listCheckedCities));
    if (tagList.length !== 0) {
      $('.locations h4').text(tagList.join(", "));
    } else {
      $('.locations h4').text('\u00A0');
    }
  }

  // update h4 tag with the list of checked cities
  function updateTag3 () {
    const tagList = Object.values(Object.assign({}, listCheckedStates, listCheckedCities));
    if (tagList.length !== 0) {
      $('.locations h4').text(tagList.join(', '));
    } else {
      $('.locations h4').text('\u00A0');
    }
  }

  // Listen for changes on each input checkboxes tag
  $('.amenities .popover ul li input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');
    // we can use also $(this).data('name')
    // method used to access the values of custom data attributes
    // which ara prefixed with "data-"

    if (this.checked) {
      listCheckedAmenities[amenityId] = amenityName;
    } else {
      delete listCheckedAmenities[amenityId];
    }

    updateTag1();
  });

  $('.locations .popover ul li h2 input[type="checkbox"]').change(function () {
    const stateId = $(this).attr('data-id');
    const stateName = $(this).attr('data-name');
    if (this.checked) {
      listCheckedStates[stateId] = stateName;
    } else {
      delete listCheckedStates[stateId];
    }

    updateTag2();
  });

  $('.locations .popover ul ul li input[type="checkbox"]').change(function () {
    const cityId = $(this).attr('data-id');
    const cityName = $(this).attr('data-name');

    if (this.checked) {
      listCheckedCities[cityId] = cityName;
    } else {
      delete listCheckedCities[cityId];
    }

    updateTag3();
  });

  $.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:5001/api/v1/status/',
    dataType: 'json',
    success: function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }
  });

  $.ajax({
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    url: 'http://127.0.0.1:5001/api/v1/places_search/',
    dataType: 'json',
    success: function (data) {
      for (const place of data) {
        $('section.places').append(`<article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">${place.price_by_night} $</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} Guests </div>
          <div class="number_rooms">${place.number_rooms} Bedrooms </div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathrooms </div>
        </div>
        <div class="description">${place.description}</div>
      </article>`);
      }
    }
  });
  $('#btn').click(function () {
    $('section.places').empty();
    const dataAm = Object.keys(listCheckedAmenities);
    const dataSt = Object.keys(listCheckedStates);
    const dataCy = Object.keys(listCheckedCities);
    $.ajax({
      type: 'POST',
      data: JSON.stringify({ 'amenities': dataAm, 'states': dataSt, 'cities': dataCy }),
      contentType: 'application/json',
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      dataType: 'json',
      success: function (data) {
        for (const place of data) {
          $('section.places').append(`<article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">${place.price_by_night} $</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} Guests </div>
          <div class="number_rooms">${place.number_rooms} Bedrooms </div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathrooms </div>
        </div>
        <div class="description">${place.description}</div>
      </article>`);
        }
      }
    });
  });
});
