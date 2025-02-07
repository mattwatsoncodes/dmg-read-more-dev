import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Register our block.
 */
registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
