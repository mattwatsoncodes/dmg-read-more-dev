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
use WP_Post;
use WP_Query;

class DMG_Read_More_Search {

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
	 * @param array<string>         $args        Positional arguments (not used in this command).
	 * @param array<string, string> $assoc_args  Associative arguments, including optional `date-before` and `date-after`.
	 */
	public function search( array $args, array $assoc_args ): void {
		// Set default dates if not provided.
		$date_before = Utils\get_flag_value( $assoc_args, 'date-before', gmdate( 'Y-m-d' ) );
		$date_after  = Utils\get_flag_value( $assoc_args, 'date-after', gmdate( 'Y-m-d', strtotime( '-30 days' ) ) );

		// Build date query.
		$date_query = array(
			array(
				'after'     => $date_after,
				'before'    => $date_before,
				'inclusive' => true,
			),
		);

		// Implement batching so we do not need to loop through all posts in one go.
		$batch_size  = 100; // Process 100 posts at a time.
   		$paged       = 1;   // Start at page 1
		$total_found = 0;   // Tracks the total number of matches.
		$query_count = 0;   // Query post count.

		do {
			// Set up WP_Query arguments with pagination.
			$query_args = [
				'post_type'              => 'post',
				'post_status'            => 'publish',
				'date_query'             => $date_query,
				's'                      => 'wp:dmg/read-more', // Search for the block.
				'fields'                 => 'ids',              // Return only Post IDs.
				'posts_per_page'         => $batch_size,        // Process in batches.
				'paged'                  => $paged,             // Pagination key.
				'no_found_rows'          => true,               // Optimize query for large datasets.
				'update_post_meta_cache' => false,              // Skip meta cache for performance.
				'update_post_term_cache' => false,              // Skip term cache for performance.
			];

			$query       = new WP_Query( $query_args );
			$query_count = count( $query->posts );

			// If no posts are found in this batch, stop processing.
			if ( empty( $query->posts ) ) {
				break;
			}

			// Log each found post ID, and increment the counter.
			foreach ( $query->posts as $post ) {

				// Ensure we get the post ID as a string.
				$post_id = ( $post instanceof WP_Post ) ? (string) $post->ID : (string) $post;
				WP_CLI::log( $post_id );

				++$total_found;
			}

			// Move to the next page of results.
			++$paged;

			// Sleep to reduce database load.
			sleep( 1 );

		} while ( $query_count === $batch_size );


		// If no posts were found at all, output a warning.
		if ( 0 === $total_found ) {
			WP_CLI::warning( 'No posts found containing the DMG Read More block.' );
		}
	}
}
