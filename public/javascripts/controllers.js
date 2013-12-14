app.controller("BlogCtrl", [
	"$scope", "$filter", "ParseService", "PostStatus", function($scope, $filter, ParseService, PostStatus)
	{
		$scope.posts = (localStorage['posts']) ? JSON.parse(localStorage['posts']) : [];

		var prPosts = Parse.Object.extend("Posts");

		var query = new Parse.Query(prPosts);
		query.limit(25);
		query.equalTo("status", PostStatus.published);
		query.descending("createdAt");
		query.find({
			success: function(_posts)
			{
				var posts = [];
				for (var x in _posts)
				{
					var post = _posts[x],
						npost = {};
					npost.id = post.id;
					npost.title = post.get("title");
					npost.body = post.get("body");
					npost.blurb = npost.body.substring(0, 200);
					npost.age = 'old';
					
					var d = new Date(post.createdAt),
						diff = new Date().getTime() - d.getTime(),
						seconds = parseInt(diff / 1000, 10),
						minutes = parseInt(seconds / 60, 10),
						hours = parseInt(minutes / 60, 10);
					if (diff < 82800000)
					{
						if (hours > 0) npost.datePosted = hours+" hours ago";
						else if (minutes > 0) npost.datePosted = minutes+" minutes ago";
						else if (seconds > 0) npost.datePosted = seconds+" seconds ago";
					} else {
						npost.datePosted = $filter('date')(d, 'medium');
					}
					npost.originalDate = d.getTime();
					
					posts.push(npost);
				}
				localStorage['posts'] = JSON.stringify(posts);
				$scope.$apply(function()
				{
					$scope.posts = posts;

					setInterval(function()
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
					}, 1000);
				});
			},
			error: function(error)
			{
				console.log("Error: "+error.code+" "+error.message);
			}
		});
		
		window.socket.on('new_post', function(data)
		{
			var post = data.postData;
			post.age = 'new';
			$scope.posts.push( post );
		});
	}
]);

var PostCtrl = app.controller("PostCtrl", [
	"$scope", "$filter", "post", function($scope, $filter, post)
	{
		var _post = post;

		var d = new Date(_post.createdAt),
			npost = {},
			diff = new Date().getTime() - d.getTime(),
			seconds = parseInt(diff / 1000, 10),
			minutes = parseInt(seconds / 60, 10),
			hours = parseInt(minutes / 60, 10);
		if (diff < 82800000)
		{
			if (hours > 0) npost.datePosted = hours+" hours ago";
			else if (minutes > 0) npost.datePosted = minutes+" minutes ago";
			else if (seconds > 0) npost.datePosted = seconds+" seconds ago";
		} else {
			npost.datePosted = $filter('date')(d, 'medium');
		}
		npost.originalDate = d.getTime();

		npost.title = _post.get('title');
		npost.body = _post.get('body');

		$scope.post = npost;

		setInterval(function()
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
		}, 1000);
	}
]);

PostCtrl.resolve = {
	post: function($q, $filter, ParseService, $route, $location)
	{
		var prPosts = Parse.Object.extend("Posts");

		var query = new Parse.Query(prPosts);
		return query.get($route.current.params.postId, {
			success: function(_post)
			{
				return _post;
			},
			error: function()
			{
				$location.path('/');
			}
		});
	}
};