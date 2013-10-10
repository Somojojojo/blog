app.factory("PostStatus", function()
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
});