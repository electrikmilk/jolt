<?php
/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 17:6
 */

echo successful( 'Compiling... ' );
echo shell_exec( "tsc" );
echo successful( 'done!' )."\n";

$build_path = 'build/jolt.js';
$js = generate_copyright().file_get_contents($build_path);
file_put_contents( $build_path, $js );

echo successful( 'Created jolt.js!' )."\n";