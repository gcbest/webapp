  $(document).ready(function(){
// =========Start Firebase =========
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCbTv3BkBJNDeICV4f0grvKiTPjyfcVEfE",
    authDomain: "snapsnax.firebaseapp.com",
    databaseURL: "https://snapsnax.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "961593911482"
  };
  firebase.initializeApp(config);
// =========End Firebase=========

// =========Start Materialize=========
  // Document Ready with the Materialize triggers

  	//Parallax Trigger
    $('.parallax').parallax();
  	// material select trigger
  	$('select').material_select();
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      starting_top: '4%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
     }
  );

  // =========End Materialize=========

  // =========Start Yelp API=========




// If they don't click anything it should search for everything
// add the values to the options and selected attributes
// add ids to the selects
// do it without global variables

var foodStr = "";
var priceStr = "";

// If food option is selected 
//     add to a holding array
//     if food option is deselected need to remove from the array
//  join the food array with comma and space separating them

$("#food").change(function() {
    var foodSelected = [];
    $("#food option:selected").each(function() {
        foodSelected.push($(this).attr("value"));
        foodStr = foodSelected.join(", ");
        console.log(foodStr);
    });
});

  // If price 1-4 is selected
  //   add to the price holding array
  //   if price is deselected remove from the array
  // join the price array with comma and space separating them
$("#price").change(function() {
    var priceSelected = [];
    $("#price option:selected").each(function() {
        priceSelected.push($(this).attr("value"));
        priceStr = priceSelected.join(", ");
        console.log(priceStr);
    });
});




$("#submit").on("click", function() {
    // var yelpTerms = $("#cuisine").val().trim();
    var auth = {
        consumerKey: 'A57Bv67Jx1i_WTKhVxaiTg',
        consumerSecret: 'z4fnfyiWxl25JrABzDChCd8NGGI',
        accessToken: 'aDHmxuRU28TxZ_c4ltxXPkc7rb77UwUH',
        accessTokenSecret: 'L_Q6vCfuuCl5QuaXSFi4lZ9X_UM',
        serviceProvider: {
            signatureMethod: "HMAC-SHA1"
        }
    };

    var terms = foodStr;
    var near = $("#userLocation").val().trim();
    var limit = 12;
    var image_url = 'image_url';
    var rating_img_url_large = 'rating_img_url_large';
    var phone = 'phone';
    var yelpUrl = 'url';
    var radius = 40000;
    var price = priceStr; // This will come from the user input
    var open_now = true;

    var randomInt = Math.floor(Math.random() * 12); // This will be used to pick a restaurant result at random
    var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
    };

    parameters = [];
    parameters.push(['url', yelpUrl]);
    parameters.push(['term', terms]);
    parameters.push(['location', near]);
    parameters.push(['limit', limit]);
    // parameters.push(['image_url', image_url]);
    // parameters.push(['rating_img_url_large', rating_img_url_large]);
    parameters.push(['open_now', true]);
    parameters.push(['phone', phone]);
    parameters.push(['radius', radius]);
    parameters.push(['price', price]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
    console.log(parameters);
    var message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var parameterMap = OAuth.getParameterMap(message.parameters);
    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);


    function formatPhoneNumber(number) {
        var phoneArray = number.split("");
        phoneArray.splice(0, 0, "(");
        phoneArray.splice(4, 0, ")");
        phoneArray.splice(5, 0, " ");
        phoneArray.splice(9, 0, "-");
        number = phoneArray.join("");

        return number;
    }


    
    $.ajax({
        'url': message.action,
        'method': 'GET',
        'data': parameterMap,
        'cache': true,
        'dataType': 'jsonp',
        'jsonpCallback': 'cb',
    }).done(function(response) {

        var name = response.businesses[randomInt].name;
        var phone = response.businesses[randomInt].phone;
        phone = formatPhoneNumber(phone);
        var address = response.businesses[randomInt].location.address[0] + " " +
            response.businesses[randomInt].location.city + ", " +
            response.businesses[randomInt].location.state_code + " " +
            response.businesses[randomInt].location.postal_code;
        var isOpen = 'Open Now';
        var imageURL = response.businesses[randomInt].image_url;
        var yelpURL = response.businesses[randomInt].mobile_url;

        var companyInfo = $("<div>")
        companyInfo.append(name + '<br>');
        companyInfo.append(phone + '<br>');
        companyInfo.append(address + '<br>');
        companyInfo.append(isOpen + '<br>');
        companyInfo.append('<img src="' + response.businesses[randomInt].image_url + '"">' + '<br>');
        companyInfo.append('<a href=' + yelpURL + '>' + yelpURL + '</a>' + '<br>');
        companyInfo.append('<iframe src=' + yelpURL + '>' + yelpURL + '</iframe>' + '<br>');
        $("#results").html(companyInfo);


        // console.log($.ajax({'url': message.action,    
        //       'method': 'GET',
        //       'data': parameterMap,
        //       'cache': true,
        //       'dataType': 'jsonp',
        //       'jsonpCallback': 'cb',}));
        // console.log(message);
        console.log(response.businesses[randomInt]);
        console.log(address);
        console.log(price);
    });
});



// =========End Yelp API=========

// =========Start Google Maps API ======

  // var geocoder;
  // var map;
  // var markers = new Array();
  // var infos = new Array();

  // function initialize() {
  //   geocoder = new google.maps.Geocoder();
  //   var latlng = new google.maps.LatLng(-34.397, 150.644);
  //   var mapOptions = {
  //     zoom: 8,
  //     center: latlngmap
  //     TypeId: google.maps.MapTypeId.ROADMAP
  //   }
  //   map = new google.maps.Map(document.getElementById('map'), mapOptions);
  // }

  // function codeAddress() {
  //   var address = document.getElementById('userLocation').value;
  //   geocoder.geocode( { 'address': address}, function(results, status) {
  //     if (status == 'OK') {
  //       console.log(address);
  //       // map.setCenter(results[0].geometry.location);
  //       // use the marker to set 
  //       // var marker = new google.maps.Marker({
  //       //     map: map,
  //       //     position: results[0].geometry.location
  //       // });
  //     } else {
  //       alert('Geocode was not successful for the following reason: ' + status);
  //     }
  //   });
  // }
// ========= autolocate ======
// var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  
//   var options = {
//     zoom: 15,
//     center: coords,
//     mapTypeControl: false,
//     navigationControlOptions: {
//       style: google.maps.NavigationControlStyle.SMALL
//     },
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   };
//   var map = new google.maps.Map(document.getElementById("mapcontainer"), options);
//   var marker = new google.maps.Marker({
//       position: coords,
//       map: map,
//       title:"You are here!"
//   });

// =========End Google Maps API ======

// =========Start Google Geocoder API ======
  // var inputAddress = $("#userLocation").val().trim();
  // var googleUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="+inputAddress+"&key=AIzaSyCNEH9ddgTnDDO-HPKQtW1INRnXiYkp5aA";
  // console.log(inputAddress);
  // console.log(googleUrl);
// =========End Google Geocoder API ======

$("#submit").on('click', function(){
  //alert("It works");
  // var inputAddress = $(near).val().trim();
  var quoAdd = "\" "+ $("#userLocation").val().trim(); +"\""
  console.log(quoAdd);
  var googleUrl = $("#maphere").append("<iframe src=\"//www.google.com/maps/embed/v1/place?q="+encodeURIComponent(quoAdd)+"&zoom=17&key=AIzaSyB4mN_A2vOANGFxYfVw99rUuOPftTeFUVM\"</iframe>")
  console.log(inputAddress);
  console.log(googleUrl);
/// REVIEW OBJ   geocoder.geocode( { 'address': inputAddress}, function(results, status) {
//         if (status == google.maps.GeocoderStatus.OK) { 
//             console.log("Google OK");
//             };
//         else {
//             alert('Geocode was not successful for the following reason: ' + status);
//         }
// });
});
}); //end Doc ready

  




