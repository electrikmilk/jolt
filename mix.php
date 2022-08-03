<?php

function successful( $message )
{
    return "\033[32m$message\033[0m";
}

function banner( $message )
{
    $cols = round( (int)shell_exec( "tput cols" ) / 2 ) - ( strlen( $message ) + 4 );
    return str_repeat( '-', $cols )." [$message] ".str_repeat( '-', $cols )."\n";
}

$js = "/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: ".date( 'F j, Y H:i:s' )."
 */\n";

$dashes = 1;

function collectJS( string $path ): string
{
    global $dashes;
    $contents = "";
    foreach ( scandir( $path ) as $item ) {
        if ( $item === '.' || $item === '..' || str_split( $item )[ 0 ] === '.' ) {
            continue;
        }
        if ( is_dir( "$path/$item" ) ) {
            echo banner( "$path/$item" );
            $contents .= "/* $item */\n".collectJS( "$path/$item" );
        } else {
            echo successful( '+' )." Added $path/$item\n";
            $contents .= file_get_contents( "$path/$item" )."\n";
        }
    }
    ++$dashes;
    return $contents;
}

$js = collectJS( 'js' );

//$js = preg_replace( '!/\*.*?\*/!s', '', $js );
$js = preg_replace( '/\n\s*\n/', "\n", $js );
//$js = str_replace("\n","",$js). "\n";

file_put_contents( 'mixed.js', $js );

echo "\n".successful( 'Combined javascript!' )."\n";