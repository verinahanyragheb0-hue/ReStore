<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_GET["id"])) {
    echo json_encode(["success" => false, "message" => "No product ID given."]);
    exit;
}

$product_id = intval($_GET["id"]);

if ($product_id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid product ID."]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, name, category, price, condition_type, description, image_path FROM products WHERE id = ?");
$stmt->execute([$product_id]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$product) {
    echo json_encode(["success" => false, "message" => "Product not found."]);
    exit;
}

echo json_encode(["success" => true, "product" => $product]);
?>