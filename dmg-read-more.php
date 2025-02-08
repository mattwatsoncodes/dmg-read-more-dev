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
 * Define constants.
 */
const PLUGIN_ROOT_DIR = __DIR__;

/**
 * Load the namespaces.
 */
require_once PLUGIN_ROOT_DIR . '/inc/cli.php';
require_once PLUGIN_ROOT_DIR . '/inc/namespace.php';
require_once PLUGIN_ROOT_DIR . '/inc/taxonomy.php';

/**
 * Run.
 */
bootstrap();
