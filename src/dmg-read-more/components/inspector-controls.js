import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import PostList from './post-list';
import Pagination from './pagination';

/**
 * PluginInspectorControls Component.
 *
 * Manages the search query and pagination state, fetches posts via useSelect,
 * and renders the Inspector Controls including a search text control, a PostList,
 * and Pagination controls.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.selectedPost  Currently selected post object.
 * @param {Function} props.setAttributes Function to update the selected post attributes.
 *
 * @return {JSX.Element} The rendered Inspector Controls.
 */
const PluginInspectorControls = ( { selectedPost, setAttributes } ) => {
	const postsPerPage = 5;
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ currentPage, setCurrentPage ] = useState( 1 );

	const { posts, postByPostId, totalPages } = useSelect( ( select ) => {
		const currentPostId = select( 'core/editor' ).getCurrentPostId();

		// We do not want to include the current post in our search.
		const query = {
			exclude: currentPostId ? [ currentPostId ] : [],
			per_page: postsPerPage,
			page: currentPage,
			status: 'publish',
		};

		let posts = [];
		let postByPostId = null;

		// Convert the search query is a post ID.
		const parsedSearchQuery = /^\d+$/.test( searchQuery ) ? parseInt( searchQuery, 10 ) : NaN;

		// If the search query is numeric, attempt to return posts by matching postId.
		// Exclude the current post ID.
		if ( ! isNaN( parsedSearchQuery ) && parsedSearchQuery !== currentPostId ) {
			const postIdQuery = {
				...query,
				include: [ parsedSearchQuery ],
			};

			const postByPostIds = select( 'core' )
				.getEntityRecords( 'postType', 'post', postIdQuery );

			// Post Ids are unique, there will only be one match.
			if ( postByPostIds?.length ) {
				postByPostId = postByPostIds[ 0 ];
			}
		}

		// If the search query is numeric or not, posts may contain numbers.
		if ( searchQuery ) {
			query.search = searchQuery;
		}

		// If there is no search, be sure to return the latest posts first.
		if ( ! searchQuery ) {
			query.order = 'desc';
			query.orderby = 'date';
		}

		// Do the post search.
		posts = select( 'core' ).getEntityRecords(
			'postType',
			'post',
			query
		);

		// Get the total pages for our search results.
		const totalPages = select( 'core' ).getEntityRecordsTotalPages(
			'postType',
			'post',
			query
		);

		// Return the posts.
		return {
			posts,
			postByPostId,
			totalPages,
		};
	}, [ currentPage, searchQuery ] );

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Select a Post', 'dmg-read-more' ) }>
				<TextControl
					id="dmg-read-more-search"
					label={ __( 'Search Posts', 'dmg-read-more' ) }
					value={ searchQuery }
					onChange={ ( value ) => {
						// Check if value is only space.
						const isOnlyWhitespace = 0 === value.trim().length;

						// Trim left side and allow at most one trailing space.
						const sanitizedValue = value.replace( /^\s+/, '' ).replace( /\s+$/, ' ' );

						// Let's not search for spaces.
						setSearchQuery( isOnlyWhitespace ? '' : sanitizedValue );

						// Don't update page if the value has not actually changed.
						if ( searchQuery.trim() === sanitizedValue.trim() ) {
							return;
						}

						// New search, be sure to start at page 1.
						setCurrentPage( 1 );
					} }
					placeholder={ __( 'Enter post title or ID…', 'dmg-read-more' ) }
				/>
				<PostList
					currentPage={ currentPage }
					posts={ posts }
					postByPostId={ postByPostId }
					searchQuery={ searchQuery }
					selectedPost={ selectedPost }
					setAttributes={ setAttributes }
				/>
				<Pagination
					currentPage={ currentPage }
					totalPages={ totalPages }
					setCurrentPage={ setCurrentPage }
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default PluginInspectorControls;
