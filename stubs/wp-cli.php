<?php
namespace WP_CLI\Utils;

/**
 * Stub for WP_CLI\Utils\get_flag_value to satisfy PHPStan.
 *
 * @template T
 * @param array<string, mixed> $assoc_args The associative arguments array.
 * @param string $flag The flag key to retrieve.
 * @param T|null $default_value The default value to return if the flag is not set.
 * @return mixed The value of the flag or the default.
 */
function get_flag_value( array $assoc_args, string $flag, mixed $default_value = null ): mixed {
    return $assoc_args[ $flag ] ?? $default_value;
}
