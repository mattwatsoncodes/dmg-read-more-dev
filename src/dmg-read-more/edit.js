import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	RadioControl,
	Spinner,
	TextControl
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { selectedPost } = attributes;

	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ currentPage, setCurrentPage ] = useState( 1 );

	const blockProps = useBlockProps();
	const postsPerPage = 5;

	/**
	 * Fetch the found posts, and the total amount of pages.
	 */
	const { posts, postByPostId, totalPages } = useSelect( ( select ) => {
		const query = {
			per_page: postsPerPage,
			page: currentPage,
			status: 'publish',
		};

		let posts = [];
		let postByPostId = null;

		// If the search query is numeric, attempt to return posts by matching
		// postId.
		if ( searchQuery && ! isNaN ( searchQuery ) ) {
			const postIdQuery = {
				...query,
				include: [ parseInt( searchQuery ) ],
			}

			const postByPostIds = select( 'core' )
				.getEntityRecords( 'postType', 'post', postIdQuery );

			// Post Ids are unique, there will only be one match.
			if ( postByPostIds && postByPostIds.length ) {
				postByPostId = postByPostIds[0];
			}
		}

		// If the search query is numeric or not, posts may contain numbers
		if ( searchQuery ) {
			query.search = searchQuery;
		}

		// WP_Query in the background does not have a concept of search by
		// relevance without third party plugins, however if those plugins are
		// available, do not order our results, so not to interfere with those.
		//
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

		console.log( currentPage );

		// Show "Loading posts…" if there are no posts yet.
		// Or if we are pagination (as we already have posts).
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
						label={ searchQuery ?
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

	/**
	 * Pagination component.
	 *
	 * Renders navigation controls for paginated data. Displays a sliding window
	 * of page numbers (defaulting to three visible pages) centered around the current page.
	 * When the current page is at the beginning or end of the range, the window shifts accordingly.
	 * "First" and "Previous" buttons are shown when the first page is not in view,
	 * and "Next" and "Last" buttons are shown when the last page is not in view.
	 * A status indicator is displayed (e.g., "Page 2 of 10").
	 *
	 * @param {Object}   props                The component props.
	 * @param {number}   props.currentPage    The current active page number.
	 * @param {number}   props.totalPages     The total number of pages available.
	 * @param {Function} props.setCurrentPage Callback function to update the current page.
	 *
	 * @return {JSX.Element|null} The rendered pagination controls as a JSX element, or null if there is only one page.
	 */
	const Pagination = ( { currentPage, totalPages, setCurrentPage } ) => {
		// Return early if there is one or less pages.
		if ( totalPages <= 1 ) {
			return null;
		}

		const visiblePages = 3;
		const paginationStatus = <>{ __( 'Page', 'dmg-read-more' ) } { currentPage } { __( 'of', 'dmg-read-more' ) } { totalPages }</>;

		let startPage, endPage;

		// If there are fewer pages than our visiblePage size, show all pages.
		if ( totalPages <= visiblePages ) {
			startPage = 1;
			endPage = totalPages;
		} else if ( 1 === currentPage ) {
			// If on page 1, display [1, 2, 3].
			startPage = 1;
			endPage = 3;
		} else if ( currentPage === totalPages ) {
			// If on the last page, display [totalPages - 2, totalPages - 1, totalPages]
			startPage = totalPages - 2;
			endPage = totalPages;
		} else {
			// Otherwise, center the current page in the window: [ currentPage - 1, currentPage, currentPage + 1 ]
			startPage = currentPage - 1;
			endPage = currentPage + 1;
		}

		// Renders 'First' and 'Previous' only if page 1 is not visible.
		// Renders 'Next' and 'Last' only if the last page is not visible.
		return (
			<BaseControl
				help={ paginationStatus }
				hideLabelFromVision
				id="dmg-read-more-pagination"
				label={ __( 'Search Results Pagination', 'dmg-read-more' ) }
			>
				{ startPage > 1 && (
					<>
						<Button
							label={ __( 'First', 'dmg-read-more' ) }
							showTooltip={ true }
							variant="tertiary"
							onClick={ () => setCurrentPage( 1 ) }
						>
							&laquo;
							<span className="screen-reader-text">
								{ __( 'First', 'dmg-read-more' ) }
							</span>
						</Button>
						<Button
							label={ __( 'Previous', 'dmg-read-more' ) }
							showTooltip={ true }
							variant="tertiary"
							onClick={ () => setCurrentPage( currentPage - 1 ) }
						>
							&lsaquo;
							<span className="screen-reader-text">
								{ __( 'Previous', 'dmg-read-more' ) }
							</span>
						</Button>
					</>
				) }
				{ Array.from( { length: endPage - startPage + 1 } ).map( ( _, i ) => {
					const page = startPage + i;
					return page === currentPage ? (
						<Button
							key={ page }
							variant="primary"
							disabled
							onClick={ ( e ) => e.preventDefault() }
						>
							{ page }
						</Button>
					) : (
						<Button
							key={ page }
							variant="tertiary"
							onClick={ () => setCurrentPage( page ) }
						>
							{ page }
						</Button>
					);
				} ) }
				{ endPage < totalPages && (
					<>
						<Button
							label={ __( 'Next', 'dmg-read-more' ) }
							showTooltip={ true }
							variant="tertiary"
							onClick={ () => setCurrentPage( currentPage + 1 ) }
						>
							&rsaquo;
							<span className="screen-reader-text">
								{ __( 'Next', 'dmg-read-more' ) }
							</span>
						</Button>
						<Button
							label={ __( 'Last', 'dmg-read-more' ) }
							showTooltip={ true }
							variant="tertiary"
							onClick={ () => setCurrentPage( totalPages ) }
						>
							&raquo;
							<span className="screen-reader-text">
								{ __( 'Last', 'dmg-read-more' ) }
							</span>
						</Button>
					</>
				) }
			</BaseControl>
		);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Select a Post', 'dmg-read-more' ) }>
					<TextControl
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
					{ <PostList
						currentPage={ currentPage }
						posts={ posts }
						postByPostId={ postByPostId }
						searchQuery={ searchQuery }
						selectedPost={ selectedPost }
						setAttributes={ setAttributes }
					/> }
					<Pagination
						currentPage={ currentPage }
						totalPages={ totalPages }
						setCurrentPage={ setCurrentPage }
					/>
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
