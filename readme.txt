=== DMG Read More ===
Contributors:      mattwatsoncodes
Tags:              block, gutenberg, posts, links, search
Requires at least: 6.0
Tested up to:      6.7
Stable tag:        1.0.0
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Adds a block that allows users to search for posts by ID and insert them as links,
plus a WP-CLI command to identify posts containing the block.

== Description ==

The DMG Read More plugin implements two features:

- **The 'DMG Read More' editor block** - This block enables users to search for
posts by their ID and insert them as links directly into their content.

- **A WP-CLI command (`dmg-read-more search`)** - The WP-CLI command lists all
Posts (all post types) that contain the 'DMG Read More' block.

== Repositories ==

In order to provide a plugin that is suitable for the WordPress plugin repository by passing the [Plugin Check (PCP)](https://wordpress.org/plugins/plugin-check/) tests, and also provide tooling and testing, this plugin exists in a development repository, which is deployed via a deployment script (`.github/workflows/release.yml`) to a release repository. The assets are built in the release repository, ensuring compatibility and readiness for installation.

- **Development Repository:** [https://github.com/mattwatsoncodes/dmg-read-more-dev](https://github.com/mattwatsoncodes/dmg-read-more-dev) – Contains unbuilt source code, development tooling, and testing.
- **Release Repository:** [https://github.com/mattwatsoncodes/dmg-read-more](https://github.com/mattwatsoncodes/dmg-read-more) – Includes built assets, optimized and ready for installation.

Please be sure to review the development repository, and to avoid the need to build the plugin you can use the release for installation and testing.

== Installation ==

This section describes how to install the plugin and get it working.

**Option 1: Install from the Release Repository (Recommended)**

1. Download the latest release ZIP file from the [Release Repository](https://github.com/mattwatsoncodes/dmg-read-more/releases).
2. In WordPress, navigate to **Plugins > Add New** and click **Upload Plugin**.
3. Select the downloaded ZIP file and click **Install Now**.
4. Once installed, click **Activate Plugin**.

**Option 2: Install via Git**

1. Navigate to your WordPress plugin directory:
   ```
   cd wp-content/plugins/
   ```
2. Clone the release repository:
   ```
   git clone https://github.com/mattwatsoncodes/dmg-read-more.git
   ```
3. In WordPress, go to **Plugins > Installed Plugins** and activate **DMG Read More**.

**Option 3: Development Installation**
If you want to modify or contribute to the plugin, install from the development repository.

1. Navigate to your WordPress plugin directory:
   ```
   cd wp-content/plugins/
   ```
2. Clone the development repository:
   ```
   git clone https://github.com/mattwatsoncodes/dmg-read-more-dev.git
   ```
3. Navigate into the plugin directory:
   ```
   cd dmg-read-more-dev
   ```
4. Install PHP dependencies using Composer:
   ```
   composer install
   ```
5. Install JavaScript dependencies:
   ```
   npm install
   ```
6. Build the assets:
   ```
   npm run build
   ```
7. In WordPress, go to **Plugins > Installed Plugins** and activate **DMG Read More**.

By following these steps, you can install the plugin in a way that best suits your needs.

== Frequently Asked Questions ==

= DMG Read More Block - Tell me about the implementation =

Here are some of the key features that the DMG Read More Block offers:


- **Search for posts by keyword or ID**: Editors can search for posts using either a string (for title-based searches) or a numerical ID.
- **Recent posts listing**: By default, the block displays a list of recent posts to choose from.
- **Inspector Controls**: The block provides an **InspectorControls** panel in the sidebar for searching and selecting posts.
- **Search highlighting and guidance**: If the sidebar is closed, a button allows users to open the block settings, highlighting the search input field to guide user interaction.
- **Pagination Support**: If multiple posts match the search criteria, results are paginated for ease of navigation.
- **Live Preview**: Once a post is selected, the anchor link updates dynamically in the editor.


**Post ID Search**

If the entered value is numeric, the block first attempts to fetch a post by ID, however it also performs a keyword-based search. This is because posts can also contain numbers, so we do not want to limit the experience.
For example if a user searches for `1479` it may return a post with the ID `1479` as the first result, but if any posts contain `1479` these will be returned too.

**Guided Interaction**

To enhance usability, a new block that has not been configured uses the standard WordPress block `components-placeholder` and a **button** that when clicked ensures the settings panel is open when searching for posts:

A **temporary yellow highlight effect** is applied to the search input field when the settings panel is opened, making it easier for users to locate.

= WP-CLI dmg-read-more search Command - Tell me about the implementation =

Here are some of the key features that the WP-CLI `dmg-read-more search` command offers:


- **Search for posts containing the DMG Read More block**: Efficiently finds Posts (of any post type) that include the `DMG Read More` block by leveraging a hidden taxonomy instead of a full-text search.
- **Date range filtering**: Allows users to specify a `date-before` and `date-after` parameter to limit searches to a specific time frame. Defaults to searching the last **30 days** if omitted.
- **Optimized taxonomy-based query**: Uses a hidden taxonomy (`dmg_read_more_status`) to track posts with the block, significantly improving search performance compared to a full-text search.
- **Batch processing for large datasets**: Retrieves results in **batches of 100** posts at a time to prevent excessive memory usage and improve performance on large databases.
- **Sleep interval to reduce database load**: Introduces a **`sleep(1)`** interval between query batches to prevent overwhelming MySQL and ensure stable performance.
- **Robust error handling and validation**: If invalid date parameters are provided, defaults to a safe and valid search range (last 30 days). If no results are found, a clear warning message is displayed.
- **Efficient WP_Query execution**: Returns **only post IDs** instead of full post objects, optimizing performance by minimizing unnecessary data retrieval.
- **Logs matching results to STDOUT**: Outputs found post IDs directly to the console, making integration with other CLI scripts or automation workflows seamless.


**Performance - Taxonomy Query**

To improve performance, the **DMG Read More** block uses a hidden taxonomy, `dmg_read_more_status`. When a post containing the block is saved, a term is added to this taxonomy. If the block is removed, the term is deleted.

This approach avoids inefficient full-text searches on `wp_posts.post_content`, which are required when using `WP_Query` with the `s` parameter (`s => 'wp:dmg/read-more'`).

Performance tests on 100,000 posts show:
- A full-text search (`s` parameter) takes approximately **10 seconds**.
- A taxonomy-based query (`tax_query`) returns results in around **1 second**.

The significant speed improvement comes from leveraging indexed relationships in the `wp_term_relationships` table, allowing MySQL to retrieve relevant posts efficiently without scanning `post_content`.

**Performance - Query Batching**

Instead of setting `posts_per_page` to `-1`, which retrieves all matching posts at once, queries are processed in batches of **100 posts at a time**. This prevents excessive memory usage and improves query efficiency, especially on large datasets.

A **sleep interval (`sleep(1)`)** is introduced between batch queries to reduce database load and prevent excessive strain on MySQL.

**Validation and Error Handling**

If a user omits or provides an invalid `date-before` or `date-after` argument, the command defaults to searching within the last **30 days** to ensure reliability.

If no posts are found, a clear message is displayed to inform the user rather than failing silently.

= How do I use the DMG Read More block? =

To use the **DMG Read More** block:

1. Create or edit a post.
2. Use the block insertion button and search for `DMG Read More`
3. Insert the **DMG Read More** block into a post or page.
4. Use the **block settings panel** to search for a post by **Keyword or ID** (you can use the provided button to open the panel)
5. Select a post from the search results, or choose one of the latest posts.
6. The block will generate a **'Read More'** link using the selected post's title and permalink.

= How do I use the dmg-read-more search WPCLI command? =

Use the `wp dmg-read-more search` command, with the optional `--date-before` and `--date-after`` commands.

To use the following examples, in your (project that supports WP-CLI commands), open the terminal and run:

1. Find posts published between January 10, 2024, and February 9, 2024:
   ```
   wp dmg-read-more search --date-before=2024-02-09 --date-after=2024-01-10
   ```

2. Retrieve posts from the last 7 days:
   ```
   wp dmg-read-more search --date-after=$(date -d "-7 days" +%Y-%m-%d)
   ```

3. Run the command without date parameters to search posts from the past 30 days:
   ```
   wp dmg-read-more search
   ```

= What happens if I don't specify a date range when running the WP-CLI command? =
The command defaults to searching for posts within the last **30 days** if no date parameters are provided.

= How do I run the WP-CLI command on wp-env? =

Prefix the `wp` command with `wp-env run cli`.

If you're using **wp-env**, you can run the command in your project by opening the terminal and running:

```
wp-env run cli wp dmg-read-more search --date-before=2025-01-01 --date-after=2024-12-01
```

= How do I build the development build? =
To build the file locally you need to:

1. Navigate into the plugin directory:
   ```
   cd dmg-read-more-dev
   ```
2. Install PHP dependencies using Composer:
   ```
   composer install
   ```
3. Install JavaScript dependencies:
   ```
   npm install
   ```
4. Build the assets:
   ```
   npm run build
   ```

= How are the development files structured, and what do each of them do? =
The **DMG Read More** plugin was initially scaffolded using the official WordPress block development tool:

```sh
npx @wordpress/create-block dmg-read-more
```

This command generated the foundational structure, including essential files for block development. From there, custom configurations were added to enhance the development workflow and maintain high code quality.

.
├── .github
│   └── workflows
│       └── release.yml
├── build
├── inc
│   ├── class-dmg-read-more-search.php
│   ├── cli.php
│   ├── namespace.php
│   └── taxonomy.php
├── node_modules
├── src
│   └── dmg-read-more
│       ├── components
│           ├── inspector-controls.js
│           ├── pagination.js
│           └── post-list.js
│       ├── functions
│           └── text-utils.js
│       ├── block.json
│       ├── edit.js
│       ├── editor.scss
│       ├── index.js
│       └── save.js
├── stubs
│   ├── stubs.php
│   └── wp-cli.php
├── vendor
├── .editorconfig
├── .eslintrc.js
├── .gitignore
├── .stylelintrc.json
├── composer.json
├── composer.lock
├── dmg-read-more.php
├── package-lock.json
├── package.json
├── phpcs.xml.dist
├── phpstan.neon
├── readme.txt
└── webpack.config.js

- **.github/workflows/release.yml** - GitHub Actions workflow for deploying the plugin from the development repository [dmg-read-more-dev](https://github.com/mattwatsoncodes/dmg-read-more-dev) to the release repository [dmg-read-more](https://github.com/mattwatsoncodes/dmg-read-more).
- **build/** - Contains built assets after running the build process.
- **inc/** - PHP files providing core functionality for the plugin.
  - **class-dmg-read-more-search.php** - Defines the main search WP-CLI subcommand for the plugin.
  - **cli.php** - Handles WP-CLI integration for the plugin.
  - **namespace.php** - Defines the PHP namespace for better organization, bootstraps the plugin.
  - **taxonomy.php** - Registers and manages the hidden taxonomy used for efficient queries.
- **node_modules/** - Contains installed Node.js dependencies (ignored in production).
- **src/dmg-read-more/** - Source code for the Gutenberg block.
  - **components/** - Contains reusable React components for the block editor.
    - **components.js** - Contains the PluginInspectorControl component and handles the search logic.
	- **pagination.js** - Contains the Pagination component.
	- **pagination.js** - Contains the PostList component for rendering the post selector.
  - **functions/** - Utility functions related to block behavior.
	- **text-utils.js** - Contains helper functions for highlighting search term keywords.
  - **block.json** - Metadata and settings for the block.
  - **edit.js** - Defines the block's behavior in the editor, incorporates the components.
  - **editor.scss** - Styles for the block editor interface.
  - **index.js** - Registers the block.
  - **save.js** - Defines how the block is saved and rendered on the frontend.
- **stubs/** - Placeholder files for development or testing with PHPStan.
  - **stubs.php** - Contains stub data or helper functions.
  - **wp-cli.php** - Stub file for WP-CLI integration.
- **vendor/** - Composer dependencies (ignored in production).
- **.editorconfig** - Defines consistent coding styles across different editors.
- **.eslintrc.js** - ESLint configuration for enforcing JavaScript coding standards.
- **.gitignore** - Specifies files and folders to ignore in Git commits.
- **.stylelintrc.json** - Stylelint configuration for enforcing CSS/SASS standards.
- **composer.json** - PHP dependencies and project metadata for Composer.
- **composer.lock** - Locked versions of Composer dependencies.
- **dmg-read-more.php** - **Main plugin file**, defining hooks and functionality.
- **package-lock.json** - Locked versions of Node.js dependencies.
- **package.json** - Defines JavaScript dependencies and scripts.
- **phpcs.xml.dist** - PHP_CodeSniffer configuration for code quality checks.
- **phpstan.neon** - PHPStan configuration for static code analysis.
- **readme.txt** - Plugin readme file for WordPress.org repository.
- **webpack.config.js** - Webpack configuration for bundling JavaScript and assets.

= How do I test with the code quality tools? =

This plugin uses **PHP_CodeSniffer**, **PHPStan**, **PHP-CS-Fixer**, and **WordPress scripts** for linting and formatting.

= How do I run PHP-CS-Fixer? =

PHP-CS-Fixer automatically corrects PHP coding style issues.

```
composer run fixer
```

= How do I run PHP_CodeSniffer? =

PHP_CodeSniffer detects PHP coding standard violations.

```
composer run phpcs .
```

= How do I run PHP Code Beautifier and Fixer (PHPCBF)? =

PHPCBF attempts to automatically fix PHP_CodeSniffer issues.
```
composer run phpcbf .
```

= How do I run PHPStan? =

PHPStan performs static analysis for PHP to detect potential issues.
```
composer run phpstan
```

= How do I build the plugin assets? =

This compiles JavaScript and CSS for production.
```
npm run build
```

= How do I format JavaScript using WordPress linting rules? =

Run the following command:
```
npm run format
```

= How do I lint CSS files? =

Run the following command:
```
npm run lint:css
```

= How do I lint JavaScript files? =

In the plugin directory, run the following command:

```
npm run lint:js
```

= How do I ensure my code follows WordPress standards? =

Before committing changes, ensure your code passes all quality checks:
```
npm run lint && composer run phpcs
```

= What should I do before committing code? =

Before committing, ensure your code passes all checks:
```
npm run lint && npm run build && composer run phpstan
```
This ensures:
- Code formatting is correct
- Linting checks pass
- PHP static analysis has no errors
- The plugin is built and ready for use

== Changelog ==

= 1.0.0 =
- Initial release with DMG Read More block and `dmg-read-more search` WP-CLI command.

== Upgrade Notice ==

= 1.0.0 =
Welcome to the first release of DMG Read More! Enjoy inserting and finding read more links across your site.

== Requirements ==

- WordPress version 6.0 or higher.
- PHP version 7.4 or higher.
- WP-CLI (for command-line functionality).

== Known Issues ==

= Deployment Script =
The deployment script is currently not removing all files, and creating an undesired PR in the development repository. These kinks will be ironed out in the future.
