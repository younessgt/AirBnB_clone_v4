$(document).ready(function () {
  const listCheckedAmenities = {};

  // update h4 tag with the list of amenities checked
  function updateTag () {
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

    updateTag();
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
});
