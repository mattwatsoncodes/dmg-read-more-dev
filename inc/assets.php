<?php
/**
 * Localize Assets.
 *
 * @package dmg-read-more
 */

namespace DMG_Read_More\Assets;

/**
 * Bootstrap the asset related functions.
 */
function bootstrap(): void {
	add_action( 'enqueue_block_assets', __NAMESPACE__ . '\\localize_dmg_read_more_block', 20 );
}

/**
 * Enqueue block assets and localize script with total published posts,
 *
 * Retrieving the post count using PHP's wp_count_posts() function is more efficient
 * than performing the same operation in the block editor with React.
 */
function localize_dmg_read_more_block(): void {
    // Ensure the function only runs in the block editor context.
    if ( ! is_admin() || ! is_user_logged_in() ) {
        return;
    }

    $block_name           = 'mattwatsoncodes/dmg-read-more';
	$editor_script_handle = 'mattwatsoncodes-dmg-read-more-editor-script';

    // Check if wp_count_posts function exists.
    if ( ! function_exists( 'wp_count_posts' ) ) {
        return;
    }

    // Get the total number of published posts.
    $post_count            = wp_count_posts();
    $total_published_posts = isset( $post_count->publish ) ? (int) $post_count->publish : 0;

    // Ensure the script is registered before localising.
    if ( ! wp_script_is( $editor_script_handle, 'registered' ) ) {
        return;
    }

    // Localize the script with the total number of published posts.
    wp_localize_script(
        $editor_script_handle,
        'dmgReadMoreData',
        array(
            'totalPublishedPosts' => $total_published_posts,
        )
    );
}
