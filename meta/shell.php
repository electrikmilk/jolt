<?php
/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/3/2022 17:10
 */

function successful( $message )
{
    return "\033[32m$message\033[0m";
}

function banner( $message )
{
    $cols = (int)shell_exec( "tput cols" );
    if ( $cols !== 0 ) { // for file watchers
        $cols = round( $cols / 2 ) - ( strlen( $message ) + 4 );
    }
    return str_repeat( '-', $cols )." [$message] ".str_repeat( '-', $cols )."\n";
}

function generate_copyright()
{
    return "/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: ".date( 'F j, Y H:i:s' )."
 */\n";
}

if ( $argc > 1 ) {
    if ( $argv[ 1 ] === "min" ) {
        include_once 'meta/minifier.php';
    } elseif ( $argv[ 1 ] === "mix" ) {
        include_once 'meta/mix.php';
    }
} else {
    $commands = [
        'mix' => 'Combine files in the source directory into jolt.js',
        'min' => 'Minify jolt.js'
    ];
    echo "\033[32mUSAGE:\033[0m\n";
    foreach ( $commands as $command => $description ) {
        echo "jolt \033[1m$command\033[0m - $description\n";
    }
}