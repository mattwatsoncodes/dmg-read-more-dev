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
use WP_CLI\Utils;
use WP_Query;

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
		// Set default dates if not provided.
		$date_before = Utils\get_flag_value( $assoc_args, 'date-before', date( 'Y-m-d' ) );
		$date_after  = Utils\get_flag_value( $assoc_args, 'date-after', date( 'Y-m-d', strtotime( '-30 days' ) ) );

		// Build date query.
		$date_query = array(
			array(
				'after'     => $date_after,
				'before'    => $date_before,
				'inclusive' => true,
			),
		);

		// Set up WP_Query arguments.
		$query_args = array(
			'post_type'              => 'post',
			'post_status'            => 'publish',
			'date_query'             => $date_query,
			's'                      => 'wp:dmg/read-more', // Search string for the Gutenberg block.
			'fields'                 => 'ids',              // Return only Post IDs.
			'posts_per_page'         => -1,                 // Retrieve all matching posts.
			'no_found_rows'          => true,               // Optimize query for large datasets.
			'update_post_meta_cache' => false,              // Skip meta cache for performance.
			'update_post_term_cache' => false,              // Skip term cache for performance.
			'suppress_filters'       => true,               // Disable filters for this query.
		);

		$query = new WP_Query( $query_args );

		if ( empty( $query->posts ) ) {
			WP_CLI::warning( 'No posts found containing the DMG Read More block.' );
			exit;
		}

		foreach ( $query->posts as $post_id ) {
			WP_CLI::log( $post_id );
		}
	}
}
