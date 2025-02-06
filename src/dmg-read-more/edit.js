import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	const blockProps = useBlockProps();

	// Retrieve this from localized php for performance.
	// eslint-disable-next-line no-undef
	const { totalPublishedPosts = 0 } = dmgReadMoreData || {};
	const postsPerPage = 5;

	/**
	 * Fetch the posts, and the total amount of pages.
	 */
	const { posts, totalPages } = useSelect( ( select ) => {
		const query = {
			per_page: postsPerPage,
			page: 1,
			orderby: 'date',
			order: 'desc',
			status: 'publish',
		};

		const posts = select( 'core' ).getEntityRecords(
			'postType',
			'post',
			query
		);

		const totalPages = Math.ceil( totalPublishedPosts / postsPerPage )

		return {
			posts,
			totalPages,
		};
	}, [ totalPublishedPosts ] );

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
