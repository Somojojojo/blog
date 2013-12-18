var BlogCtrl = app.controller("BlogCtrl", [
	"$scope", "$filter", function($scope, $filter)
	{
		$scope.posts = (localStorage['posts']) ? JSON.parse(localStorage['posts']) : [];

		$scope.socket = io.connect(window.location.origin);

		$scope.socket.emit('get_all_posts');

		$scope.socket.on('new_post', function(data)
		{
			$scope.posts.push( data.postData );
		});

		$scope.socket.on('all_posts', function(data)
		{
			$scope.posts = data.posts;
			localStorage['posts'] = JSON.stringify(data.posts);

			setInterval(function()
			{
				BlogCtrl.updatePostsData($scope, $filter);
			}, 1000);
			BlogCtrl.updatePostsData($scope, $filter);
		});
	}
]);

BlogCtrl.updatePostsData = function($scope, $filter)
{
	for (var x in $scope.posts)
	{
		var d = $scope.posts[x].originalDate,
			diff = new Date().getTime() - d,
			seconds = parseInt(diff / 1000, 10),
			minutes = parseInt(seconds / 60, 10),
			hours = parseInt(minutes / 60, 10);
		if (diff < 82800000)
		{
			if (hours > 0) $scope.posts[x].datePosted = hours+" hours ago";
			else if (minutes > 0) $scope.posts[x].datePosted = minutes+" minutes ago";
			else if (seconds > 0) $scope.posts[x].datePosted = seconds+" seconds ago";
		} else {
			$scope.posts[x].datePosted = $filter('date')(d, 'medium');
		}
	}

	$scope.$apply(function()
	{
		$scope.posts = $scope.posts;
	});
};

var PostCtrl = app.controller("PostCtrl", [
	"$scope", "$filter", "$route", function($scope, $filter, $route)
	{
		$scope.post = {};

		$scope.socket = io.connect(window.location.origin);

		$scope.socket.emit('get_post', { postId: $route.current.params.postId });

		$scope.socket.on('post', function(data)
		{
			$scope.post = data.postData;
			setInterval(function()
			{
				PostCtrl.updatePostData($scope, $filter);
			}, 1000);
			PostCtrl.updatePostData($scope, $filter);
		});
	}
]);

PostCtrl.updatePostData = function($scope, $filter)
{
	var d = $scope.post.originalDate,
		diff = new Date().getTime() - d,
		seconds = parseInt(diff / 1000, 10),
		minutes = parseInt(seconds / 60, 10),
		hours = parseInt(minutes / 60, 10);
	if (diff < 82800000)
	{
		if (hours > 0) $scope.post.datePosted = hours+" hours ago";
		else if (minutes > 0) $scope.post.datePosted = minutes+" minutes ago";
		else if (seconds > 0) $scope.post.datePosted = seconds+" seconds ago";
	} else {
		$scope.post.datePosted = $filter('date')(d, 'medium');
	}

	$scope.$apply(function()
	{
		$scope.post = $scope.post;
	});
};