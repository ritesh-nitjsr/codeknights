var app = angular.module('mainApp', []);
 
    // define the ctrl
    function mainController($scope) {
 
        // the last received msg
        $scope.msg = {};
 
        // handles the callback from the received event
        var handleCallback = function (msg) {
            $scope.$apply(function () {
                $scope.msg = JSON.parse(msg.data)
            });
        }
 
        var source = new EventSource('/dashboard');
        source.addEventListener('message', handleCallback, false);
    }