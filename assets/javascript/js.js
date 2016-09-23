// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCbTv3BkBJNDeICV4f0grvKiTPjyfcVEfE",
    authDomain: "snapsnax.firebaseapp.com",
    databaseURL: "https://snapsnax.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "961593911482"
  };
  firebase.initializeApp(config);

  // Document Ready with the modal trigger
  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });
          