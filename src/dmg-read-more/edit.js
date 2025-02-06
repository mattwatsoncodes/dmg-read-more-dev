import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	const blockProps = useBlockProps();

	// Retrieve this from localized php for performance.
	// eslint-disable-next-line no-undef
	const { totalPublishedPosts = 0 } = dmgReadMoreData || {};

	// Setup our variables.
	const postsPerPage = 5;
	const pageNumber = 1
	const searchString = 'totam';

	/**
	 * Fetch the posts, and the total amount of pages.
	 */
	const { posts, totalPages } = useSelect( ( select ) => {
		const query = {
			per_page: postsPerPage,
			page: pageNumber,
			orderby: 'date',
			order: 'desc',
			status: 'publish',
		};

		let posts = [];

		// Check if search string is a number (Post ID).
		if ( searchString && ! isNaN ( searchString ) ) {
			const postIdQuery = {
				...query,
				include: [ parseInt( searchString ) ],
			}
			posts = select( 'core' ).getEntityRecords(
				'postType',
				'post',
				postIdQuery
			);
		}

		// If the search string is not a number, or if it was and returned no
		// results.
		if ( searchString && ( ! posts.length || isNaN( searchString ) ) ) {
			query.search = searchString;
		}

		// If no posts have been returned, use the default query.
		if ( ! posts.length ) {
			posts = select( 'core' ).getEntityRecords(
				'postType',
				'post',
				query
			);
		}

		const totalPages = Math.ceil( totalPublishedPosts / postsPerPage )

		return {
			posts,
			totalPages,
		};
	}, [ totalPublishedPosts, pageNumber, searchString ] );

	console.log( totalPages, posts );

	const selectedPost = {
		link: 'http://test.com',
		title: {
			rendered: __( 'Test Post', 'dmg-read-more' ),
		},
	};

	return (
		<div { ...blockProps }>
			<p className="dmg-read-more">
				<a href={ selectedPost.link }>{ __( 'Read More:', 'dmg-read-more' ) } { selectedPost.title.rendered }</a>
			</p>
		</div>
	);
}
