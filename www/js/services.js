angular.module('starter.services', [])
// .factory('FirebaseArrayService' ,function($firebaseArray){
//   return {
//    getFirebaseArray:function($firebaseArray){
//       const ref = firebase.database().ref();
//     return $firebaseArray(ref);
//    }
//   }

// })
.factory('GetCurrentLocationService' , function($cordovaGeolocation){
  var posOptions = {frequency: 1000, timeout: 30000, enableHighAccuracy: false};
  var cordovaLocation=  $cordovaGeolocation
  .getCurrentPosition(posOptions)
  .then(function(position){
    var location={};
    location.lat = position.coords.latitude
    location.lng = position.coords.longitude
    return location;
  }).catch(err => {
    console.log(err);
    return err;
  });
  return cordovaLocation;

})
.factory('PrayerTimingService' , [function(){

  var salahTiming={};
  return {
    setSalah : function(salah){
        salahTiming=salah;
    } ,
    getSalah : function(){
      if (salahTiming) {

      return salahTiming;
      } else{
        return null;
      }
    }

  }
}])
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
