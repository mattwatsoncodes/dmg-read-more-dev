<?php
/**
 * Misc project specific declarations for phpstan.
 *
 * Holds any classes, constants, or functions which are otherwise
 * not available via included files and directories.
 *
 * @link https://phpstan.org/user-guide/discovering-symbols
 *
 *  scanFiles:
 *  - stubs/stubs.php
 */

// phpcs:ignore Universal.Namespaces.DisallowCurlyBraceSyntax.Forbidden, Universal.Namespaces.DisallowDeclarationWithoutName.Forbidden
namespace {
	const ABSPATH = '';
	const ADMIN_COOKIE_PATH = '';
	const AUTH_COOKIE = '';
	const AUTH_KEY = '';
	const AUTH_SALT = '';
	const DB_NAME = '';
	const DOMAIN_CURRENT_SITE = '';
	const COOKIEPATH = '';
	const COOKIE_DOMAIN = '';
	const LOGGED_IN_COOKIE = '';
	const LOGGED_IN_KEY = '';
	const LOGGED_IN_SALT = '';
	const NONCE_KEY = '';
	const NONCE_SALT = '';
	const PLUGINS_COOKIE_PATH = '';
	const SCRIPT_DEBUG = true;
	const SECURE_AUTH_COOKIE = '';
	const SECURE_AUTH_KEY = '';
	const SECURE_AUTH_SALT = '';
	const SITECOOKIEPATH = '';
	const WP_CONTENT_DIR = '';
	const WP_CONTENT_URL = '';
	const WP_PLUGIN_DIR = '';
	const WP_SITE_ROOT = '';

	require_once './wp-cli.php';
}
