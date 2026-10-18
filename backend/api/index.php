<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if ($certificate = getenv('MYSQL_ATTR_SSL_CA_CONTENT')) {
    $certificatePath = '/tmp/aiven-ca.pem';
    file_put_contents($certificatePath, $certificate);
    putenv('MYSQL_ATTR_SSL_CA='.$certificatePath);
    $_ENV['MYSQL_ATTR_SSL_CA'] = $certificatePath;
}

require __DIR__.'/../vendor/autoload.php';

/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
