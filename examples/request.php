<?php
/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 16:43
 */

header( 'Content-Type: application/json' );
try {
    echo json_encode( [
        'status'  => 'success',
        'message' => 'Hello, World!'
    ], JSON_THROW_ON_ERROR );
} catch ( JsonException $e ) {
    die( $e->getMessage() );
}
