<?php
/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/16/2022 17:53
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
 * Built: ".date( 'F j, Y H:i:s' )."
 */\n";
}

if ( $argc > 1 ) {
    if ( $argv[ 1 ] === 'mix' ) {
        include_once 'meta/mix.php';
    } elseif ( $argv[ 1 ] === 'min' ) {
        include_once 'meta/build.php';
        include_once 'meta/minifier.php';
    } elseif ( $argv[ 1 ] === 'build' ) {
        $build_for = 'dev';
        if ( $argv[ 2 ] === 'prod' ) {
            $build_for = 'prod';
        }
        include_once 'meta/mix.php';
        include_once 'meta/build.php';
        if ( $build_for === 'prod' ) {
            include_once 'meta/minifier.php';
        }
    }
} else {
    $commands = [
        'mix'        => 'Combine files in src into jolt.ts',
        'min'        => 'Minify compiled source',
        'build'      => 'Combine and compile',
        'build prod' => 'Combine, compile, and minify'
    ];
    echo "\033[32mUSAGE:\033[0m\n";
    foreach ( $commands as $command => $description ) {
        echo "\033[1m$command\033[0m\t\t$description\n";
    }
}