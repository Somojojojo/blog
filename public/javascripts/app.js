var app = angular.module("blogApp", ['ngRoute']);
var posts = [];

app.config(function($routeProvider)
{
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'BlogCtrl'
		})
		.when('/post/:postId', {
			templateUrl: 'views/post.html',
			controller: 'PostCtrl',
			resolve: PostCtrl.resolve
		})
		.otherwise({
			redirectTo: '/'
		});
});

var host = location.origin.replace(/^http/, 'ws');
window.socket = io.connect(host);