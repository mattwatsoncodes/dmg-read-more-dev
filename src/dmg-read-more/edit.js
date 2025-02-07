import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RadioControl, Spinner, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { selectedPost } = attributes;

	const [ searchString, setSearchQuery ] = useState( '' );
	const [ pageNumber, setCurrentPage ] = useState( 1 );

	// Retrieve this from localized php for performance.
	// eslint-disable-next-line no-undef
	const { totalPublishedPosts = 0 } = dmgReadMoreData || {};


	const blockProps = useBlockProps();
	const postsPerPage = 5;

	/**
	 * Fetch the found posts, and the total amount of pages.
	 */
	const { posts, postByPostId, totalPages } = useSelect( ( select ) => {
		const query = {
			per_page: postsPerPage,
			page: pageNumber,
			status: 'publish',
		};

		let posts = [];
		let postByPostId = null;

		// If the search string is numeric, attempt to return posts by matching
		// postId.
		if ( searchString && ! isNaN ( searchString ) ) {
			const postIdQuery = {
				...query,
				include: [ parseInt( searchString ) ],
			}

			const postByPostIds = select( 'core' )
				.getEntityRecords( 'postType', 'post', postIdQuery );

			// Post Ids are unique, there will only be one match.
			if ( postByPostIds && postByPostIds.length ) {
				postByPostId = postByPostIds[0];
			}
		}

		// If the search string is numeric or not, posts may contain numbers
		if ( searchString ) {
			query.search = searchString;
		}

		// WP_Query in the background does not have a concept of search by
		// relevance without third party plugins, however if those plugins are
		// available, do not order our results, so not to interfere with those.
		//
		// If there is no search, be sure to return the latest posts first.
		if ( ! searchString ) {
			query.order = 'desc';
			query.orderby = 'date';
		}

		// Do the post search.
		posts = select( 'core' ).getEntityRecords(
			'postType',
			'post',
			query
		);

		// Calculate the total pages for our search results.
		const totalPages = Math.ceil( totalPublishedPosts / postsPerPage )

		// Return the posts.
		return {
			posts,
			postByPostId,
			totalPages,
		};
	}, [ totalPublishedPosts, pageNumber, searchString ] );

	/**
	 * PostList Component
	 *
	 * Displays a list of posts and allows the user to select a post using radio
	 * buttons. If a post is found by ID, it is displayed separately above the
	 * search results.
	 *
	 * @param {Object}   props               Component props.
	 * @param {Array}    props.posts         List of post objects retrieved from the API.
	 * @param {Object}   props.postByPostId  A single post object found via post ID search.
	 * @param {string}   props.searchString  The Searched Query.
	 * @param {Object}   props.selectedPost  Currently selected post object.
	 * @param {Function} props.setAttributes Function to update the selected post attributes.
	 *
	 * @return {JSX.Element} The rendered PostList component.
	 */
	const PostList = ( { posts, postByPostId, searchString, selectedPost, setAttributes } ) => {
		const chosenPost = parseInt( selectedPost?.id );

		// Show "Loading posts…" if there are no posts yet.
		if ( ! posts && ! postByPostId ) {
			return (
				<>
					<Spinner />
					<p>{ __( 'Loading posts…', 'dmg-read-more' ) }</p>
				</>
			);
		}

		// Show "No posts found" if there are no results.
		if ( posts && 0 === posts.length && ! postByPostId ) {
			return <p>{ __( 'No posts found.', 'dmg-read-more' ) }</p>;
		}

		return (
			<>
				{ postByPostId && (
					<RadioControl
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
						label={ searchString ?
							__( 'Found Posts', 'dmg-read-more' ) :
							__( 'Latest Posts', 'dmg-read-more' ) }
						selected={ chosenPost }
						options={ posts.map( ( post ) => ( {
							label: (
								<>
									{ post.title.rendered }
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

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Select a Post', 'dmg-read-more' ) }>
					<TextControl
						label={ __( 'Search Posts', 'dmg-read-more' ) }
						value={ searchString }
						onChange={ ( value ) => {
							// Check if value is only space.
							const isOnlyWhitespace = 0 === value.trim().length;

							// Trim left side and allow at most one trailing space.
							const sanitizedValue = value.replace( /^\s+/, '' ).replace( /\s+$/, ' ' );

							// Let's not search for spaces.
							setSearchQuery( isOnlyWhitespace ? '' : sanitizedValue );

							// Don't update page if the value has not actually changed.
							if ( searchString.trim() === sanitizedValue.trim() ) {
								return;
							}

							// New search, be sure to start at page 1.
							setCurrentPage( 1 );
						} }
						placeholder={ __( 'Enter post title or ID…', 'dmg-read-more' ) }
					/>
					{ <PostList
						posts={ posts }
						postByPostId={ postByPostId }
						searchString={ searchString }
						selectedPost={ selectedPost }
						setAttributes={ setAttributes }
					/> }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<p className="dmg-read-more">
					<a href={ selectedPost.link }>{ __( 'Read More:', 'dmg-read-more' ) } { selectedPost.title }</a>
				</p>
			</div>
		</>
	);
}
