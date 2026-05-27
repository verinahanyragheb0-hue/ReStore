<?php
// Connect to database
require_once "db_connect.php";

// Get all products from database
$sql = "SELECT * FROM products ORDER BY created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$products = $stmt->fetchAll();

// Send products as JSON
echo json_encode([
    "success"  => true,
    "products" => $products
]);
?>