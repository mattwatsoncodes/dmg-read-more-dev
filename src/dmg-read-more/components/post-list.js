import { RadioControl, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	formatTitle,
	formatExcerpt,
} from '../functions/text-utils';

/**
 * PostList Component
 *
 * Displays a list of posts and allows the user to select a post using radio
 * buttons. If a post is found by ID, it is displayed separately above the
 * search results.
 *
 * @param {Object}   props               Component props.
 * @param {number}   props.currentPage   The current selected page.
 * @param {Array}    props.posts         List of post objects retrieved from the API.
 * @param {Object}   props.postByPostId  A single post object found via post ID search.
 * @param {string}   props.searchQuery   The Searched Query.
 * @param {Object}   props.selectedPost  Currently selected post object.
 * @param {Function} props.setAttributes Function to update the selected post attributes.
 *
 * @return {JSX.Element} The rendered PostList component.
 */
const PostList = ( { currentPage, posts, postByPostId, searchQuery, selectedPost, setAttributes } ) => {
	const chosenPost = parseInt( selectedPost?.id );

	// Show "Loading posts…" if there are no posts yet.
	// Or if we are paginating (as we already have posts).
	if (
		( ! posts && ! postByPostId ) ||
		( posts && 0 === posts.length && ! postByPostId && currentPage > 1 )
	) {
		return (
			<>
				<Spinner />
				<p>{ __( 'Loading posts…', 'dmg-read-more' ) }</p>
			</>
		);
	}

	// Show "No posts found" if there are no results (and we are not paginating).
	if ( currentPage <= 1 && posts && 0 === posts.length && ! postByPostId ) {
		return <p>{ __( 'No posts found.', 'dmg-read-more' ) }</p>;
	}

	return (
		<>
			{ postByPostId && (
				<RadioControl
					id='dmg-read-more-found-post'
					label={ __( 'Found Post Matching ID', 'dmg-read-more' ) }
					selected={ chosenPost }
					options={ [
						{
							label: postByPostId.title.rendered,
							value: postByPostId.id,
						},
					] }
					onChange={ ( postId ) => {
						const selectedPost = {
							id: postId,
							title: postByPostId.title.rendered,
							link: postByPostId.link,
						};

						setAttributes( { selectedPost } );
					} }
				/>
			) }

			{ posts && 0 < posts.length && (
				<RadioControl
					id='dmg-read-more-found-posts'
					label={ searchQuery ?
						__( 'Found Posts', 'dmg-read-more' ) :
						__( 'Latest Posts', 'dmg-read-more' ) }
					selected={ chosenPost }
					options={ posts.map( ( post ) => ( {
						label: (
							<>
								{ formatTitle( post, searchQuery ) }
								{ formatExcerpt( post, searchQuery ) }
							</>
						),
						value: post.id,
					} ) ) }
					onChange={ ( postId ) => {
						const post = posts.find( ( post ) => post.id === parseInt( postId, 10 ) );

						if ( post ) {
							const selectedPost = {
								id: postId,
								title: post.title.rendered,
								link: post.link,
							};

							setAttributes( { selectedPost } );
						}
					} }
				/>
			) }
		</>
	);
};

export default PostList;
