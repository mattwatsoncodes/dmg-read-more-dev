import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RadioControl, Spinner, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { selectedPost } = attributes;

	const [ searchString, setSearchQuery ] = useState( null );
	const [ pageNumber, setCurrentPage ] = useState( 1 );

	// Retrieve this from localized php for performance.
	// eslint-disable-next-line no-undef
	const { totalPublishedPosts = 0 } = dmgReadMoreData || {};


	const blockProps = useBlockProps();
	const postsPerPage = 5;

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
		if ( searchString && ( ! posts || ! posts.length || isNaN( searchString ) ) ) {
			query.search = searchString;
		}

		// If no posts have been returned, use the default query.
		if ( ! posts || ! posts.length ) {
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

	const PostList = ( { posts, selectedPost, setAttributes } ) => {
		let postList;

		if ( posts && ! posts.length ) {
			postList = <p>{ __( 'No posts found.', 'dmg-read-more' ) }</p>;
		}

		if ( ! posts ) {
			postList = (
				<>
					<Spinner />
					<p> { __( 'Loading posts…', 'dmg-read-more' ) }</p>
				</>
			);
		}

		if ( posts && posts.length ) {
			postList = <RadioControl
				label={ __( 'Choose a Post', 'dmg-read-more' ) }
				selected={ selectedPost?.id || null }
				options={ posts.map( ( post ) => ( {
					label: post.title.rendered,
					value: post.id,
				} ) ) }
				onChange={ ( postId ) => {
					const post = posts.find(
						( post ) => post.id === parseInt( postId )
					);

					if ( post ) {
						const selectedPost = {
							id: post.id,
							title: post.title.rendered,
							link: post.link,
						};

						setAttributes( { selectedPost } );
					}
				} }
			/>
		}

		return postList;
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Select a Post', 'dmg-read-more' ) }>
					<TextControl
						label={ __( 'Search Posts', 'dmg-read-more' ) }
						value={ searchString }
						onChange={ ( value ) => {
							setSearchQuery( value.trim() || null );
							setCurrentPage( 1 );
						} }
						placeholder={ __( 'Enter post title or ID…', 'dmg-read-more' ) }
					/>
					{ <PostList
						posts={ posts }
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
