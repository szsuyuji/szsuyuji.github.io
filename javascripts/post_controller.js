angular.module('posts', ['ngResource']).
config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: '/views/index.html',
			controller: indexCtrl
		}).
		when('/post/:postId', {
			templateUrl: '/views/post-detail.html',
			controller: postDetailCtrl
		}).
		when('/post', {
			templateUrl: '/views/post-new.html',
			controller:categoriesCtrl
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);

//var rest_server = "http://suyuji.ap01.aws.af.cm";
var rest_server = "http://localhost::port";
var port = "3000";

var indexCtrl = function($scope, $resource, $routeParams) {
	$scope.postsResult = $resource(rest_server+"/api/posts/page/1",{port:port}).get();
}


var postDetailCtrl = function($scope,$resource,$routeParams) {
    $scope.result  = $resource(rest_server+"/api/post/" + $routeParams.postId,{port:port}).get();
    $scope.commentsResult  = $resource(rest_server+"/api/post/"+$routeParams.postId+"/comments/page/"+1,{port:port}).get();
    $scope.comment = {
        postId:null,
        at:null,
        content:null,
        user:null
    }
    $scope.postComment = function(){
            $scope.comment.postId= $scope.result.post["_id"];
            var comment = $resource(rest_server+"/api/comment",{port:port});
            comment.save($scope.comment,function(result){
                $scope.commentsResult.comments.docs.unshift(result.comment);
                ++$scope.commentsResult.comments.totalRecords;
                $scope.comment.content=null;
                $scope.comment.user = null;
                $scope.comment.at = null;
                var top = $("#cmlist").offset().top;
                $("html,body").animate({scrollTop:top}, 500);
    });
    }
}


var categoriesCtrl = function($scope,$resource){
    $scope.categoriesResult = $resource(rest_server+"/api/categories",{port:port}).get();
}