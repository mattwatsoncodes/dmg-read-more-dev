import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit() {
	const blockProps = useBlockProps();

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
