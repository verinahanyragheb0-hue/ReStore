<?php
session_start();
require 'db_connect.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$userId = $_SESSION['user_id'];

$stmt = $pdo->prepare("
    SELECT p.id, p.name, p.price, p.image_path as image
    FROM wishlist w
    JOIN products p ON p.id = w.product_id
    WHERE w.user_id = ?
    ORDER BY w.added_at DESC
");
$stmt->execute([$userId]);
$items = $stmt->fetchAll();

echo json_encode($items);