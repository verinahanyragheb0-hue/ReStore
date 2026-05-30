<?php
session_start();
require 'db_connect.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'not_logged_in']);
    exit;
}

$userId    = $_SESSION['user_id'];
$productId = (int) ($_POST['product_id'] ?? 0);

if ($productId === 0) {
    echo json_encode(['success' => false, 'error' => 'invalid_product']);
    exit;
}

$stmt = $pdo->prepare(
    "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?"
);
$stmt->execute([$userId, $productId]);

echo json_encode(['success' => true]);