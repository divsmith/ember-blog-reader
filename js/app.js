App = Ember.Application.create();

App.Router.map(function() {
	this.resource('about');
	this.resource('posts', function() {
		this.resource('post', { path: ':post_id' });
	});
});

App.PostsRoute = Ember.Route.extend({
	model: function() {
		/*return posts;*/
		return $.getJSON('http://tomdale.net/api/get_recent_posts/?callback=?').then(function(data) {
			return data.posts.map(function(post) {
				post.body = post.content;
				return post;
			});
		});
	}
});

App.PostRoute = Ember.Route.extend({
	model: function(params) {
		/*return posts.findBy('id', params.post_id);*/
		return $.getJSON('http://tomdale.net/api/get_post/?id='+params.post_id+'&callback=?').then(function(data) {
			data.post.body = data.post.content;
			return data.post;
		});
	}
});

App.PostController = Ember.ObjectController.extend({
	isEditing: false,

	actions: {
		edit: function() {
			this.set('isEditing', true);
		},

		doneEditing: function() {
			this.set('isEditing', false);
		}
	}
});

Ember.Handlebars.helper('format-date', function(date) {
	return moment(date).fromNow();
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
	return new Handlebars.SafeString(showdown.makeHtml(input));
});

/*
var posts = [{
	id: '1',
	title: 'My first post.',
	author: { name: 'Parker' },
	date: new Date('08-24-2014'),
	excerpt: 'There are lots of ways to write software...',
	body: '###I want to develop in Laravel AND Ember.js'
}, {
	id: '2',
	title: 'Rails is Omakase',
	author: { name: 'dbguy' },
	date: new Date('07-31-2014'),
	excerpt: 'Rails is Omakase and cream cheese and muffins. Okay, not really...',
	body: "But it's still really useful for lots of other stuff."
}];*/
