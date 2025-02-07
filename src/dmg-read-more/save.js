import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function, this is what will render to the end user.
 *
 * @param {Object} props            Block props.
 * @param {Object} props.attributes Block attributes.
 *
 * @return {JSX.Element|null} Element to render or null if no post is selected.
 */
export default function save( { attributes } ) {
	const { selectedPost } = attributes;

	// If no post is selected, do not render anything.
	if ( ! selectedPost?.id ) {
		return null;
	}

	return (
		<div { ...useBlockProps.save() }>
			<p className="dmg-read-more">
				<a href={ selectedPost.link }>
					{ `Read More: ${selectedPost.title}` }
				</a>
			</p>
		</div>
	);
}
