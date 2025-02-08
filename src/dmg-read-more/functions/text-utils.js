/**
 * Strips HTML tags from a string.
 *
 * @param {string} html HTML string to clean.
 * @return {string} Cleaned string without HTML tags.
 */
export const stripHTMLWithRegex = ( html ) => html.replace( /<\/?[^>]+(>|$)/g, '' );

/**
 * Extracts snippets around a search term.
 *
 * @param {string} text         Full text content.
 * @param {string} searchQuery  Search query.
 * @param {number} contextWords Number of words before and after the term.
 * @return {Array} Array of extracted snippets.
 */
export const extractSnippets = ( text, searchQuery, contextWords = 5 ) => {
	if ( ! searchQuery ) {
		return [];
	}

	const regex = new RegExp( `(?:\\S+\\s+){0,${contextWords}}\\b${searchQuery}\\b(?:\\s+\\S+){0,${contextWords}}`, 'gi' );
	return text.match( regex ) || [];
};

/**
 * Truncates a string to a specified length, appending an ellipsis if needed.
 *
 * @param {string} text  The text to truncate.
 * @param {number} limit The character limit.
 * @return {string} Truncated text.
 */
export const truncateText = ( text, limit = 50 ) => ( text.length <= limit ? text : text.substring( 0, limit ).trim() + '…' );

/**
 * Formats the title, highlighting search matches if found.
 *
 * @param {Object} post        The post object.
 * @param {string} searchQuery The search query.
 * @return {JSX.Element} Formatted title element.
 */
export const formatTitle = ( post, searchQuery ) => {
	const title = stripHTMLWithRegex( post.title.rendered );

	// If there's no search term, return the normal title.
	if ( ! searchQuery ) {
		return title;
	}

	// Split the title into parts based on the search term.
	const parts = title.split( new RegExp( `(${searchQuery})`, 'gi' ) );

	// If no matches found, return the original title.
	if ( 1 === parts.length ) {
		return title;
	}

	// Highlight matched terms without truncation or ellipses.
	return parts.map( ( part, i ) =>
		part.toLowerCase() === searchQuery.toLowerCase()
			? <mark key={ i }>{ part }</mark>
			: part
	);
};

/**
 * Formats the post excerpt or content snippet.
 *
 * @param {Object} post        The post object.
 * @param {string} searchQuery The search query.
 * @return {JSX.Element} Formatted excerpt element.
 */
export const formatExcerpt = ( post, searchQuery ) => {
	// If no search term, do not show excerpt.
	if ( ! searchQuery ) {
		return '';
	}

	const content = stripHTMLWithRegex( post.content.raw );
	const contentSnippets = extractSnippets( content, searchQuery );

	// If no matches found, return nothing.
	if ( 0 === contentSnippets.length ) {
		return '';
	}

	// Determine if the first snippet is at the start of the content.
	const firstSnippetIndex = content.indexOf( contentSnippets[0] );
	const needsPrefixEllipsis = firstSnippetIndex > 0;

	// Combine all snippets into a single string with ellipses in between.
	let combinedExcerpt = contentSnippets.join( '…' );

	// Add prefix ellipsis if the first snippet is not at the start of the content.
	if ( needsPrefixEllipsis ) {
		combinedExcerpt = '…' + combinedExcerpt;
	}

	// Truncate the entire excerpt to 50 characters.
	combinedExcerpt = truncateText( combinedExcerpt, 50 );

	// Apply search term highlighting **after** truncation.
	const parts = combinedExcerpt.split( new RegExp( `(${searchQuery})`, 'gi' ) );

	return (
		<>
			<br />
			<em className="dmg-read-more-radio-excerpt">
				{ parts.map( ( part, i ) =>
					part.toLowerCase() === searchQuery.toLowerCase()
						? <mark key={ i }>{ part }</mark> // Highlight matched terms.
						: part
				) }
			</em>
		</>
	);
};
