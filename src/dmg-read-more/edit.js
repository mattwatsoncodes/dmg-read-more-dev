import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	const blockProps = useBlockProps();

	const posts = useSelect( ( select ) => {
		const query = {
			per_page: 10,
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

		return posts || [];
	}, [] );

	console.log( posts );

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
