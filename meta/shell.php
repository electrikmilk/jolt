<?php
/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 17:6
 */

function successful( string $message ): string
{
    return "\033[32m$message\033[0m";
}

function banner( string $message ): string
{
    $cols = (int)shell_exec( "tput cols" );
    if ( $cols !== 0 ) {
        $cols = round( $cols / 2 ) - ( strlen( $message ) + 4 );
    }
    return str_repeat( '-', $cols )." [$message] ".str_repeat( '-', $cols )."\n";
}

function generate_copyright(): string
{
    return "/*
 * Jolt Framework ⚡
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: ".date( 'F j, Y H:i:s' )."
 */\n";
}

if ( $argc > 1 ) {
    if ( $argv[ 1 ] === "min" ) {
        include_once 'meta/minifier.php';
    } elseif ( $argv[ 1 ] === "mix" ) {
        include_once 'meta/mix.php';
    } elseif ( $argv[ 1 ] === "build" ) {
        include_once 'meta/build.php';
        include_once 'meta/minifier.php';
    }
} else {
    $commands = [
        'build' => 'Run tsc && php jolt min',
        'min'   => 'Minify jolt.js',
        'mix'   => 'Combine files in src into jolt.ts'
    ];
    echo "\033[32mUSAGE:\033[0m\n";
    foreach ( $commands as $command => $description ) {
        echo "jolt \033[1m$command\033[0m - $description\n";
    }
}