var app = angular.module("blogApp", []);
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
			controller: 'PostCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
});

var host = location.origin.replace(/^http/, 'ws');
var socket = io.connect(host);
socket.on('message', function(data)
{
	switch(data.type)
	{
		default: break;
	}
});