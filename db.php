<?php
require_once __DIR__ . '/config.php';

function getDbConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_errno) {
        sendResponse(['status' => false, 'message' => 'Kết nối cơ sở dữ liệu thất bại', 'error' => $conn->connect_error], 500);
    }
    $conn->set_charset(DB_CHARSET);
    $conn->query("SET NAMES 'utf8mb4'");
    $conn->query("SET CHARACTER SET utf8mb4");
    return $conn;
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function parseRequestBody() {
    $body = file_get_contents('php://input');
    if ($body) {
        $json = json_decode($body, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $json;
        }
    }
    return $_POST;
}

function getIdParam() {
    if (isset($_GET['id'])) {
        return (int) $_GET['id'];
    }
    if (isset($_REQUEST['id'])) {
        return (int) $_REQUEST['id'];
    }
    return null;
}

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    $padding = 4 - (strlen($data) % 4);
    if ($padding < 4) {
        $data .= str_repeat('=', $padding);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

function createJWT(array $payload) {
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $headerEncoded = base64UrlEncode(json_encode($header, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    $payloadEncoded = base64UrlEncode(json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    $signature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", JWT_SECRET, true);
    $signatureEncoded = base64UrlEncode($signature);
    return "$headerEncoded.$payloadEncoded.$signatureEncoded";
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    [$headerEncoded, $payloadEncoded, $signatureEncoded] = $parts;
    $header = json_decode(base64UrlDecode($headerEncoded), true);
    $payload = json_decode(base64UrlDecode($payloadEncoded), true);
    if (!is_array($header) || !is_array($payload)) {
        return false;
    }
    $expectedSignature = base64UrlEncode(hash_hmac('sha256', "$headerEncoded.$payloadEncoded", JWT_SECRET, true));
    if (!hash_equals($expectedSignature, $signatureEncoded)) {
        return false;
    }
    if (isset($payload['exp']) && time() > $payload['exp']) {
        return false;
    }
    return $payload;
}

function getBearerToken() {
    $headers = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    if (!empty($headers) && preg_match('/Bearer\s+(.*)$/i', $headers, $matches)) {
        return trim($matches[1]);
    }
    return null;
}

function getRequestUser() {
    $token = getBearerToken();
    if (!$token) {
        return null;
    }
    return verifyJWT($token);
}
