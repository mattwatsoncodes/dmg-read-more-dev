import { BaseControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Pagination component.
 *
 * Handles navigation for paginated results. Displays a dynamic set of page
 * numbers, ensuring the currently selected page is centered where possible.
 *
 * - If at the start of the pagination range, the first few pages are displayed.
 * - If at the end, the last few pages are shown.
 * - Otherwise, the current page is centered within the visible range.
 *
 * The "First" and "Previous" buttons are only shown if page 1 is not visible.
 * The "Next" and "Last" buttons are only shown if the last page is not visible.
 *
 * A small label (visually hidden for accessibility) provides feedback on the
 * current page position.
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
		// If on the last page, display [totalPages - 2, totalPages - 1,
		// totalPages]
		startPage = totalPages - 2;
		endPage = totalPages;
	} else {
		// Otherwise, center the current page in the window: [ currentPage - 1,
		// currentPage, currentPage + 1 ]
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

export default Pagination;
