
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var Parse = require('parse').Parse;
var parseHelper = require('./parseHelper.js');

var app = express();

var parse_creds = require('./parse_creds.json');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(parse_creds.cookie_secret));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// development only
/*if ('development' == app.get('env'))
{
	app.use(express.errorHandler());
}*/

app.get('/', routes.index);

Parse.initialize(parse_creds.app_key, parse_creds.javascript_key);

var io = require('socket.io').listen(http.createServer(app).listen(app.get('port')));
io.sockets.on('connection', function(socket)
{
	socket.on('get_all_posts', function()
	{
		parseHelper.getAllPosts(Parse).then(function(posts)
		{
			posts = parseHelper.parsePostData(posts, parseHelper.QuantityType.Many, 'old');
			socket.emit('all_posts', { posts: posts });
		});
	});

	socket.on('get_post', function(data) // new post was published, send to all clients to avoid high API usage.
	{
		parseHelper.getPost(Parse, data.postId).then(function(post)
		{
			post = parseHelper.parsePostData(post, parseHelper.QuantityType.One, 'old');
			socket.emit('post', { postData: post });
		});
	});

	socket.on('new_post', function(data) // new post was published, send to all clients to avoid high API usage.
	{
		parseHelper.getPost(Parse, data.postId).then(function(post)
		{
			post = parseHelper.parsePostData(post, parseHelper.QuantityType.One, 'new');
			socket.emit('new_post', { postData: post });
		});
	});
});