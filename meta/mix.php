<?php
/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 0:36
 */

function collect( string $path ): string
{
    $contents = "";
    foreach ( scandir( $path ) as $item ) {
        if ( $item === '.' || $item === '..' || str_split( $item )[ 0 ] === '.' ) {
            continue;
        }
        if ( is_dir( "$path/$item" ) ) {
            echo banner( "$path/$item" );
            $contents .= "/* $item */\n".collect( "$path/$item" );
        } else {
            if ( pathinfo( "$path/$item", PATHINFO_EXTENSION ) === "ts" ) {
                echo successful( '+' )." Added $path/$item\n";
                $contents .= file_get_contents( "$path/$item" )."\n";
            }
        }
    }
    return $contents;
}

if ( ! file_exists( 'build' ) ) {
    if ( ! mkdir( 'build' ) && ! is_dir( 'build' ) ) {
        throw new \RuntimeException( sprintf( 'Directory "%s" was not created', 'build' ) );
    }
}

$js = collect( 'src' );

$js = preg_replace( '!/\*.*?\*/!s', '', $js );
$js = preg_replace( '/\n\s*\n/', "\n", $js );
//$js = str_replace("\n","",$js). "\n";

$js = generate_copyright().$js;

file_put_contents( 'build/jolt.ts', $js );

echo "\n".successful( 'Created jolt.ts!' )."\n";
