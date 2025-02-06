<?php
/**
 * Plugin Name:       DMG Read More
 * Description:       Adds a block to search for and insert posts by ID, plus a WP-CLI command to find posts using the block.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Matt Watson <support@mattwatson.codes>
 * Author URI:        https://mattwatson.blog
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dmg-read-more
 *
 * @package           dmg-read-more
 */

namespace DMG_Read_More;

defined( 'ABSPATH' ) || exit;

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_dmg_read_more_block_init(): void {
	register_block_type( __DIR__ . '/build/dmg-read-more' );
}
add_action( 'init', 'create_block_dmg_read_more_block_init' );
