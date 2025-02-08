import { useBlockProps } from '@wordpress/block-editor';
import { Button, Disabled } from '@wordpress/components';
import { dispatch, select } from '@wordpress/data';
import { Icon, search } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import PluginInspectorControls from './components/inspector-controls';

import './editor.scss';

/**
 * Edit component.
 *
 * Renders the block editor interface by displaying PluginInspectorControls
 * (which handles post searching, listing, and pagination) and shows the selected post's link.
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 *
 * @return {JSX.Element} The rendered block editor interface.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { selectedPost } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<PluginInspectorControls
				selectedPost={ selectedPost }
				setAttributes={ setAttributes }
			/>
			<div { ...blockProps }>
				{ selectedPost?.id ? (
					<p className="dmg-read-more">
						<Disabled>
							<a href={ selectedPost.link }>
								{ __( 'Read More:', 'dmg-read-more' ) } { selectedPost.title }
							</a>
						</Disabled>
					</p>
				) : (
					<div className="components-placeholder block-editor-media-placeholder is-large">
						<div className="components-placeholder__label">
							<Icon icon={ search } />
							{ __( 'DMG Read More', 'dmg-read-more' ) }
						</div>
						<div className="components-placeholder__instructions">
							{ __( 'Please choose or search for a post using the block settings.', 'dmg-read-more' ) }
						</div>
						<div className="components-placeholder__fieldset">
							<Button
								variant="primary"
								onClick={ () => {
									// Check if the sidebar is open and showing the Block tab.
									const isSidebarOpen = select( 'core/edit-post' ).isEditorSidebarOpened();
									const isBlockTabActive = 'edit-post/block' === select( 'core/edit-post' ).getActiveGeneralSidebarName();

									// If the sidebar is not open or is not showing the Block tab, switch to the Block tab.
									if ( ! isSidebarOpen || ! isBlockTabActive ) {
										dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' );
									}

									// If it's closed, open it.
									if ( ! isSidebarOpen ) {
										dispatch( 'core/edit-post' ).openGeneralSidebar( 'inspector' );
									}

									// After a short delay, focus the search input in the inspector.
									setTimeout( () => {
										const searchInput = document.getElementById( 'dmg-read-more-search' );
										if ( ! searchInput ) {
											return;
										}

										searchInput.focus();

										// Add highlight effect,
										searchInput.classList.add( 'highlight-effect' );

										// Remove highlight effect after animation completes.
										setTimeout( () => {
											searchInput.classList.remove( 'highlight-effect' );
										}, 1000 );
									}, 100 );
								} }
							>
								{ __( 'Open Block Settings', 'dmg-read-more' ) }
							</Button>
						</div>
					</div>
				) }
			</div>
		</>
	);
}
