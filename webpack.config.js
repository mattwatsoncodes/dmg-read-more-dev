/**
 * Webpack Config.
 *
 * Override certain aspects of the wp-scripts webpack config
 * so that it is suitable for our plugin.
 */

// Import Webpack dependencies.
const { resolve } = require( 'path' );

// Load dependencies.
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// Set the root asset directory.
process.env.WP_SRC_DIRECTORY = 'src';

// Setup exports.
module.exports = {
	...defaultConfig,
	mode: 'production',
	resolve: {
		// This will allow us to access the core assets without
		// having to ../../../ etc...
		modules: [
			resolve( __dirname + '/src/' ),
			resolve( __dirname + '/node_modules' ),
		],
	},
};
