<?php
/**
 * WP-CLI Search Command
 *
 * This file register the `wp dmg-read-more search` subcommand.
 *
 * @package DMG_Read_More
 */

namespace DMG_Read_More\CLI;

use WP_CLI;

class Search {

	/**
	 * Search for posts that contain the 'DMG Read More' block.
	 *
	 * This command scans posts within a given date range to find occurrences
	 * of the 'DMG Read More' block.
	 *
	 * If no date arguments are provided, it defaults to searching the last
	 * 30 days.
	 *
	 * ## OPTIONS
	 *
	 * [--date-before=<YYYY-MM-DD>]
	 * : The latest date (inclusive) to search. Defaults to today's date.
	 *
	 * [--date-after=<YYYY-MM-DD>]
	 * : The earliest date (inclusive) to search. Defaults to 30 days ago.
	 *
	 * ## EXAMPLES
	 *
	 *     # Search for posts between Jan 10, 2024, and Feb 9, 2024
	 *     wp dmg-read-more search --date-before=2024-02-09 --date-after=2024-01-10
	 *
	 *     # Search for posts from the last 7 days
	 *     wp dmg-read-more search --date-after=$(date -d "-7 days" +%Y-%m-%d)
	 *
	 * @subcommand search
	 *
	 * @param array $args        Positional arguments (not used in this command).
	 * @param array $assoc_args  Associative arguments, including optional `date-before` and `date-after`.
	 */
	public function search( $args, $assoc_args ) {
		WP_CLI::success( 'TEST' );
	}
}
