<?php
/**
 * CLI.
 *
 * This file registers and handles custom WP-CLI commands related to the DMG
 * Read More plugin.
 *
 * @package dmg-read-more
 */

namespace DMG_Read_More\CLI;

require_once __DIR__ . '/class-dmg-read-more-search.php';

use WP_CLI;

/**
 * Registers WP-CLI commands for the DMG Read More plugin.
 */
function bootstrap(): void {
	if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
		return;
	}
    WP_CLI::add_command( 'dmg-read-more', __NAMESPACE__ . '\\DMG_Read_More_Search' );
}
