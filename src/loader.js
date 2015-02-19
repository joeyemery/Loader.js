/**
 * Loader ----
 * Version: 	0.1
 * Author: 		JoeyEmery
 * Link: 		https://github.com/joeyemery/
 */
var Loader = {

	/**
	 * Loaders default configuration options.
	 */
	base: '',
	loading: [],
	hasLoaded: 0,

	/**
	 * Loaders init function loads in the first file specified by data-start.
	 */
	init: function() {
		if($('script[data-start]').length > 0) {
			Loader.load($('script[data-start]').data('start'));
		}
	},

	/**
	 * Loaders load function appends the script tag to the head and waits for the
	 * onLoad event to fire.
	 *
	 * @param {var} src - The source of the javascript file you wish to load.
	 * @param {func} callback - A function to run when the script has loaded.
	 */
	load: function(src, callback) {
		if(!callback) callback = function(){};

		/**
		 * Check if we're loading a single script or an array of scripts.
		 */
		if(src.constructor === Array) {
			this.loadMany(src, callback);
		} else {
			var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src 	= this.base + src;
			document.getElementsByTagName('head')[0].appendChild(script);

			script.onload = function() {
				callback();
			}
		}
	},

	/**
	 * Loads loadMany event loops through an array of scripts to load them all at
	 * once, then waits for the onLoad event for all the scripts to fire before triggering
	 * the callback.
	 *
	 * @param {array} src - An array of javascript assets to load.
	 * @param {func} callback - A function to run when all scripts have loaded.
	 */
	loadMany: function(src, callback) {
		var instance = this;
		this.loading = [];
		this.hasLoaded = 0;

		$.each(src, function(i, value) {
			var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src 	= instance.base + value;
			document.getElementsByTagName('head')[0].appendChild(script);

			instance.loading.push(script);

			script.onload = function() {
				instance.hasLoaded++;
				if(instance.hasLoaded == instance.loading.length)
					callback();
			}
		});
	},

	/**
	 * Here we allow the user to set a custom configuration.
	 *
	 * @param {obj} - An object of options to override the defaults.
	 */
	config: function(obj) {
		var instance = this;

		$.each(obj, function(key, value) {
			instance[key] = value;
		});
	}
};

/**
 * Check for jQuery, if it's not there we'll load it in programmatically from a CDN.
 */
(function() {
	if(typeof jQuery == 'undefined') {
		Loader.load('http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js', Loader.init);
	} else {
		Loader.init();
	}
})();