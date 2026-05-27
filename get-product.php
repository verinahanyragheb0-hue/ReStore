<?php
// Connect to the database
require_once "db_connect.php";

// Get the product ID from the URL
if (!isset($_GET["id"])) {
    echo json_encode(["success" => false, "message" => "No product ID given."]);
    exit;
}

// Make sure it's a valid number
$product_id = intval($_GET["id"]);

if ($product_id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid product ID."]);
    exit;
}

// Get the product from the database
// JOIN gets the seller name from the users table at the same time
$sql = "SELECT 
            products.id,
            products.name,
            products.category,
            products.price,
            products.condition_type,
            products.description,
            products.image_path,
            products.created_at,
            users.full_name AS seller_name
        FROM products
        JOIN users ON products.user_id = users.id
        WHERE products.id = :id
        LIMIT 1";

$stmt = $pdo->prepare($sql);
$stmt->execute([":id" => $product_id]);

$product = $stmt->fetch();

// If no product found
if (!$product) {
    echo json_encode(["success" => false, "message" => "Product not found."]);
    exit;
}

// Send the product data back
echo json_encode([
    "success" => true,
    "product" => $product
]);
?>