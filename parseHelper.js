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

exports.getAllPosts = function(Parse)
{
	var PostStatus = Parse.Object.extend("PostStatus");
	var published = new PostStatus();
	published.id = "lwI1dkKmM3";

	var prPosts = Parse.Object.extend("Posts");

	var query = new Parse.Query(prPosts);
	query.limit(25);
	query.equalTo("status", published);
	query.descending("createdAt");
	return query.find();
};

exports.parsePostData = function(_posts, _howMany, _age)
{
	if (_howMany === this.QuantityType.One)
	{
		var d = new Date(_posts.createdAt),
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
		}
		npost.originalDate = d.getTime();
		npost.age = _age;

		npost.title = _posts.get('title');
		npost.body = _posts.get('body');

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
			}
			npost.originalDate = d.getTime();
			npost.age = _age;
			
			posts.push(npost);
		}
		return posts;
	}
};