<?php
/**
 * Taxonomy for tracking the "DMG Read More" block.
 *
 * This file registers a hidden taxonomy (`dmg_read_more_status`) to track
 * whether the `dmg/read-more` block has been inserted into a post.
 *
 * Why use a taxonomy?
 * -------------------
 * Searching for blocks in post content using `WP_Query` with the `s` parameter
 * (`s` => 'wp:dmg/read-more') is extremely inefficient, as it requires a
 * full-text search on `wp_posts.post_content`.
 *
 * Performance tests on 1,000,000 posts show:
 * - A full-text search (`s` parameter) takes ~10 seconds.
 * - A taxonomy-based query (`tax_query`) returns results in ~1 second.
 *
 * The speed difference occurs because taxonomy queries leverage indexed
 * relationships in the `wp_term_relationships` table, allowing MySQL to
 * efficiently retrieve only relevant posts without scanning `post_content`.
 *
 * @package dmg-read-more
 */

namespace DMG_Read_More\Taxonomy;

use WP_Post;

/**
 * Taxonomy constants.
 */
const TAXONOMY_SLUG = 'dmg_read_more_status';
const TAXONOMY_TERM = 'true';

/**
 * Bootstrap the taxonomy registration process.
 */
function bootstrap(): void {
	add_action( 'init', __NAMESPACE__ . '\\register_hidden_taxonomy' );
	add_action( 'save_post', __NAMESPACE__ . '\\update_post_taxonomy', 10, 2 );
}

/**
 * Register the hidden taxonomy.
 *
 * This taxonomy is used internally to track if the "dmg-read-more" block
 * has been inserted in a post. It is not exposed in the UI.
 */
function register_hidden_taxonomy(): void {
	$taxonomy_name = __( 'DMG Read More', 'dmg-read-more' );

	$args = [
		'labels'            => [ 'name' => $taxonomy_name ],
		'public'            => false,
		'show_ui'           => false,
		'show_in_menu'      => false,
		'show_in_nav_menus' => false,
		'show_tagcloud'     => false,
		'show_in_rest'      => true, // Needed for WP-CLI support.
		'hierarchical'      => false,
		'rewrite'           => false,
		'query_var'         => false,
	];

	// Apply the taxonomy to all post types.
	$post_types = get_post_types( [ 'public' => true ], 'names' );

	register_taxonomy( TAXONOMY_SLUG, $post_types, $args );
}

/**
 * Update the taxonomy term when a post is saved.
 *
 * If the post contains the "dmg/read-more" block, the term 'true' is added.
 * Otherwise, all terms for this taxonomy are removed from the post.
 *
 * @param int     $post_id The post ID.
 * @param WP_Post $post The post object.
 */
function update_post_taxonomy( int $post_id, WP_Post $post ): void {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( wp_is_post_revision( $post_id ) ) {
		return;
	}

	// Get the post content.
	$content        = $post->post_content;
	$existing_terms = wp_get_object_terms( $post_id, TAXONOMY_SLUG, [ 'fields' => 'names' ] );

	// If the post contains the "dmg/read-more" block.
	if ( has_block( 'dmg/read-more', $content ) ) {

		// If the term already exists, bail.
		if ( in_array( TAXONOMY_TERM, $existing_terms, true ) ) {
			return;
		}

		// Otherwise set the term.
		wp_set_object_terms( $post_id, TAXONOMY_TERM, TAXONOMY_SLUG, false );
		return;
	}

	// If the term exists but the block is missing, remove it.
	if ( ! empty( $existing_terms ) ) {
		wp_set_object_terms( $post_id, [], TAXONOMY_SLUG, false );
	}
}
