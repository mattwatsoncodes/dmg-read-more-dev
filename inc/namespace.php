<?php
/**
 * Plugin namespace.
 *
 * @package dmg-read-more
 */

namespace DMG_Read_More;

/**
 * Bootstrap.
 */
function bootstrap(): void {
	add_action( 'init', __NAMESPACE__ . '\\register_block' );

	CLI\bootstrap();
	Taxonomy\bootstrap();
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function register_block(): void {
	register_block_type( PLUGIN_ROOT_DIR . '/build/dmg-read-more' );
}
