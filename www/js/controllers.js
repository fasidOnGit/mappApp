angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

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
.controller('mAddCtrl' , ['$scope' , '$ionicModal' , '$cordovaGeolocation' ,function($scope , $ionicModal , $cordovaGeolocation){
  // console.log($scope.masjid);
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

   $scope.addPrayerTime=function(salah){
     var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude
          var long = position.coords.longitude
          console.log(lat +' , '+long);
        }, function(err) {
          // error
        });
     console.log(salah);
     $scope.modal.hide();
   }


}])

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
