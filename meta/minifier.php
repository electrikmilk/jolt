<?php
/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/12/2022 13:39
 */

function getMinified( string $content )
{
    $url = 'https://www.toptal.com/developers/javascript-minifier/api/raw';
    $ch  = curl_init();
    curl_setopt_array( $ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [ 'Content-Type: application/x-www-form-urlencoded' ],
        CURLOPT_POSTFIELDS     => http_build_query( [ 'input' => $content ] )
    ] );
    $minified = curl_exec( $ch );
    $status   = curl_getinfo( $ch, CURLINFO_HTTP_CODE );
    curl_close( $ch );
    if ( $status !== 200 ) {
        echo "\nMinifier Error: $minified\n";
        return null;
    }
    return $minified;
}

echo successful( 'Minifying... ' );
$minify = getMinified( file_get_contents( 'build/jolt.js' ) );
if ( $minify !== null ) {
    if ( ! file_put_contents( 'build/jolt.min.js', generate_copyright().$minify ) ) {
        die( "Error! Unable to save minified version." );
    }
    echo successful( 'done!' )."\n";
    echo successful( 'Created jolt.min.js!' )."\n";
} else {
    echo $minify;
}
