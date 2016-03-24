(function () {
   'use strict';
   
   angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;
            $scope.showMenu = false;
            $scope.message = "Loading...";
            $scope.dishes = menuFactory.getDishes().query(function(response){
                $scope.dishes = response;
                $scope.showMenu = true;
            }, function(response){
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
            /*menuFactory.getDishes().then(function(response){
                $scope.dishes = response.data;
                $scope.showMenu = true;
            }, function(response){
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });*/
          
            $scope.select = function(setTab) {
                $scope.tab = setTab;
                
                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };
            $scope.isSelected = function (checkTab) { return ($scope.tab === checkTab); };
            $scope.toggleDetails = function() { $scope.showDetails = !$scope.showDetails; };
        }])

        .controller('ContactController', ['$scope', function($scope) {
            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
        }])

        .controller('FeedbackController', ['$scope', function($scope) {
            $scope.sendFeedback = function() {
                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                }
                else {
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message = "Loading...";
            menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
                .$promise.then(function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                }, function(response){
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
            /*menuFactory.getDish(parseInt($stateParams.id,10)).then(function(response){
                $scope.dish = response.data;
                $scope.showDish = true;
            }, function(response){
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });*/

        }])

        .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {
            $scope.comment = {rating:5, comment:"", author:"", date:""};
            $scope.submitComment = function () {
                $scope.comment.date = new Date().toISOString();
                $scope.dish.comments.push($scope.comment);
                menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);
                $scope.commentForm.$setPristine();
                $scope.comment = {rating:5, comment:"", author:"", date:""};
            };
        }])

        // implement the IndexController and About Controller here
        .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory){
            $scope.dish = {};
            $scope.showDish = false;
            $scope.message = "Loading...";
            menuFactory.getDishes().get({id: 0})
                .$promise.then(function(response){
                    $scope.featuredDish = response;
                    $scope.showDish = true;
                }, function(response){
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
            /*menuFactory.getDish(0).then(function(response){
                $scope.featuredDish = response.data;
                $scope.showDish = true;
            }, function(response){
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });*/
            $scope.featuredPromotion = menuFactory.getPromotion();
            $scope.featuredLeader = corporateFactory.getLeader(3);
        }])

        .controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory){
            $scope.leaders = corporateFactory.getLeaders();
        }]);

}());