exports.QuantityType = {
	Many: 0,
	One: 1
};

exports.PostStatus = function()
{
	var PostStatus = Parse.Object.extend("PostStatus");

	var published = new PostStatus();
	published.id = "lwI1dkKmM3";

	var removed = new PostStatus();
	removed.id = "sR1zP3JIEt";

	var draft = new PostStatus();
	draft.id = "0lnZ6Lyfev";

	return {
		'published': published,
		'removed': removed,
		'draft': draft
	};
};

exports.getPost = function(Parse, _postId)
{
	var prPosts = Parse.Object.extend("Posts");
	var query = new Parse.Query(prPosts);
	return query.get(_postId);
};

exports.parsePostData = function(_posts, _howMany)
{
	if (_howMany === this.QuantityType.One)
	{
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

		return npost;
	} else {
		var posts = [];
		for (var x in _posts)
		{
			var post = _posts[x],
				npost = {};
			npost.id = post.id;
			npost.title = post.get("title");
			npost.body = post.get("body");
			npost.blurb = npost.body.substring(0, 200);
			
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
		return posts;
	}
};