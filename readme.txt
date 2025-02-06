=== DMG Read More ===
Contributors:      mattwatsoncodes
Tags:              block, gutenberg, posts, links, search
Requires at least: 6.0
Tested up to:      6.7
Stable tag:        0.1.0
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Adds a block to search for and insert posts by ID, plus a WP-CLI command to find posts using the block..

== Description ==

**DMG Read More** allows editors to easily insert "Read More" links to other posts within the Gutenberg editor.

Additionally, the plugin includes a WP-CLI command (`wp dmg-read-more search`) that scans your databases to find posts containing the block, using date-range filters.

== Frequently Asked Questions ==

= How do I use the WP-CLI command? =
Run:

```
wp dmg-read-more search -date-before=2025-01-01 -date-after=2024-12-01
```

This searches for posts containing the **DMG Read More** block within the specified date range.

== Changelog ==

= 0.1.0 =
* Initial release with Gutenberg block and WP-CLI command.

== Requirements ==

* WordPress version 6.0 or higher.
* PHP version 7.4 or higher.
* WP-CLI (for command-line functionality).
