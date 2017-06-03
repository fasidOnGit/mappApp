angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $cordovaGeolocation ,$ionicLoading ,GetCurrentLocationService) {
  // var options = {timeout : 10000 , enableHighAccuracy : true};
  // $cordovaGeolocation.getCurrentPosition(options).then(function(position){
  //   //  var latlang=new google.maps.LatLang(position.coords.latitude , position.coords.longitude);
  //
  //
  // } , function(err){
  //   console.log(err);
  // });//$cordovaGeolocation

  GetCurrentLocationService.then(function(pos) {
    var LatLang = {lat : pos.lat , lng : pos.lng};

    console.log(LatLang);
    // Wach Position for change
        var watchOptions = {timeout : 3000, enableHighAccuracy: false};
        var watch = $cordovaGeolocation.watchPosition(watchOptions);

        watch.then(
           function(position) {
              var lat  = position.coords.latitude
              var long = position.coords.longitude
              console.log('watchPosition');
              console.log(lat + '' + long)
              LatLang.lat=lat;
              LatLang.lng=long;
           }
        ).catch(err => {
          console.log(err);
        });

        watch.clearWatch();

    var mapOptions = {
      center : LatLang,
      zoom : 15,
      mapTypeId : google.maps.MapTypeId.ROADMAP
    };

    $scope.map=new google.maps.Map(document.getElementById("map") , mapOptions);

    google.maps.event.addListenerOnce($scope.map , 'idle' , function(){
      var marker = new Marker({
        map : $scope.map,
        animation : google.maps.Animation.DROP,
        position : LatLang ,
        icon: {
  		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  		fillColor: '#0c60ee',
  		fillOpacity: 1,
  		strokeColor: '',
  		strokeWeight: 0,
      scale: 5

  	}
  	// map_icon_label: '<span class="map-icon map-icon-location-arrow"></span>'

      });

      var infoWindow = new google.maps.InfoWindow({
        content : "You are Here"
      });

      google.maps.event.addListener(marker , 'click' , function(){
        infoWindow.open($scope.map , marker);
      });
	  
		
    });
  }).catch(function(err){
    console.log(err);
  });

	$scope.centerOnMe = function(){
		  if(!$scope.map){
			  return;
		  }
		  $scope.loading=$ionicLoading.show({
		  showBackdrop : true
	  });
	   GetCurrentLocationService.then(function(pos) {
    var LatLang = {lat : pos.lat , lng : pos.lng};
	$scope.map.setCenter(new google.maps.LatLng(pos.lat , pos.lng));
	$ionicLoading.hide();
	   }).catch(err => {
		   console.log(err);
	   })
	  };


})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
.controller('mAddCtrl' , ['$scope' , '$ionicModal' , '$ionicPopup','$cordovaGeolocation' ,'$firebaseObject' , '$firebaseArray' ,'PrayerTimingService' ,'GetCurrentLocationService',
function($scope , $ionicModal ,$ionicPopup, $cordovaGeolocation, $firebaseObject,$firebaseArray ,PrayerTimingService , GetCurrentLocationService){
  //Create DB Ref..l̥ṣ.`

  const dbRefObject = firebase.database().ref().child('masjid');
  // console.log($scope.masjid);
  $scope.masjid={};
  $ionicModal.fromTemplateUrl('templates/AddPrayerTimeModal.html' , {
    scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal=modal;
  });
  $scope.openModal=function(){
    $scope.modal.show();
  };

  $scope.closeModal=function(){
    $scope.modal.hide();
  };
  $scope.destroyModel=function(){
    $scope.modal.remove();
  };

  //Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.modal.remove();
   });

   // Execute action on hide modal
   $scope.$on('modal.hidden', function() {
      // Execute action
   });

   // Execute action on remove modal
   $scope.$on('modal.removed', function() {
      // Execute action
   });
   $scope.submitMasjid=function(masjid){
		var confirmPopup = $ionicPopup.confirm({
			title : `Add Masjid`,
			template : `Are you sure you want to add ${masjid.name}`
		});
		confirmPopup.then(res => {
			if(res){
      
	  masjid.lat=GetCurrentLocationService.$$state.value.lat;
      
	  masjid.lng=GetCurrentLocationService.$$state.value.lng;
	  
	  
       console.log(masjid);
	   
      firebaseArrayRef= $firebaseArray(dbRefObject);
      firebaseArrayRef.$add(masjid).then(function(results){
		  console.log('deii')
        console.log(results.key);
		var keyRefObject=dbRefObject.child(results.key);
		var geoFire = new GeoFire(keyRefObject);
		geoFire.set("GeoLatLng" , [masjid.lat , masjid.lng]).then(()=>{
			$ionicPopup.alert({
				title : 'Success!!',
				template : 'Masjid Added Successfully!!'
			}).then(res => {
				document.addForm.reset();
				$scope.salah={};
			});//ionicPopup
		
		});//geoFireSet
		
      })//angularfire$add
	  } else {
				return;
			}
		})

   }
   $scope.addPrayerTime=function(salah){
        console.log(salah);
     PrayerTimingService.setSalah(salah);
     $scope.modal.hide();
   };


}])

.controller('AccountCtrl', function($scope , $cordovaGeolocation) {
  $scope.settings = {
    enableFriends: true
  };

  const dbRefObject = firebase.database().ref().child('masjid');
  dbRefObject.on('value' , snap =>{
    $scope.mList=JSON.stringify(snap.val() , null , 3);
    console.log($scope.mList);
  });
   var geoFire = new GeoFire(dbRefObject);
  var fishLocations = [
      [-16.130262, 153.605347],   // Coral Sea
      [-66.722541, -167.019653],  // Southern Ocean
      [-41.112469, 159.054565],   // Tasman Sea
      [30.902225, -166.66809]     // North Pacific Ocean
    ];

    for (var i = 0; i < fishLocations.length; i++) {
      geoFire.set("fish"+i ,fishLocations[i]).then(function(){
          log(`fish${i} initially set to [${fishLocations[i]}]`);
      }).catch(function(err){
        console.log(err);
      });
    }
    log("*** Updating locations ***");
    newLocation = [-53.435719, 140.808716];
    geoFire.set("fish1" , newLocation).then(function(){
      log(`fish1 moved to [${newLocation}]`);
    }).catch(function(err){
      log(err);
    });
      newLocation = [56.83069, 1.94822];
      geoFire.set("fish2" , newLocation).then(function(){
        log(`fish2 moved to [${newLocation}]`);
      }).catch(function(err){
        log(err);
      });
      geoFire.remove("fish0").then(function(){
        log("fish0 removed from GeoFire");
      }).catch(function(err){
        log(err);
      });

      document.getElementById("getFishLocation").addEventListener("click" , function(){
        var selectedFishKey = document.getElementById("fishSelect").value;
        geoFire.get(selectedFishKey).then(function(location){
          if (location===null) {
            log(`${selectedFishKey} is not in GeoFire`);
          } else {
            log(`${selectedFishKey} is at location [${location}]`);
          }
        })
      })
      // CordovaWatchLocation
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
  // $cordovaGeolocation
  // .getCurrentPosition(posOptions)
  //
  // .then(function (position) {
  //    var lat  = position.coords.latitude
  //    var long = position.coords.longitude
  //    console.log(lat + '   ' + long)
  // }, function(err) {
  //    console.log(err)
  // });

  var watchOptions = {timeout : 3000, enableHighAccuracy: false};
  var watch = $cordovaGeolocation.watchPosition(watchOptions);

  watch.then(
     function(position) {
        var lat  = position.coords.latitude
        var long = position.coords.longitude
        console.log('watchPosition');
        console.log(lat + '' + long)
     }
  ).catch(err => {
    console.log(err);
  });

  watch.clearWatch();

});


function log(message){
  var childDiv = document.createElement("div");
  var textNode = document.createTextNode(message);
  childDiv.appendChild(textNode);
  document.getElementById("log").appendChild(childDiv);
}
