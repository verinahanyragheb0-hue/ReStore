<?php
// Connect to the database
require_once "db_connect.php";

// Only run if form was submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Get the data from the form
    $name           = trim($_POST["p-name"]);
    $category       = trim($_POST["p-category"]);
    $price          = trim($_POST["p-price"]);
    $condition_type = trim($_POST["p-condition"]);
    $description    = trim($_POST["p-desc"]);
    $user_id        = 1; // test user for now

    // Check all fields are filled
    if (empty($name) || empty($category) || empty($price) || empty($condition_type) || empty($description)) {
        echo json_encode(["success" => false, "message" => "Please fill in all fields."]);
        exit;
    }

    // Check price is a valid number
    if (!is_numeric($price) || $price <= 0) {
        echo json_encode(["success" => false, "message" => "Please enter a valid price."]);
        exit;
    }

    // Handle image upload
    $image_path = null;

    if (isset($_FILES["p-image"]) && $_FILES["p-image"]["error"] === UPLOAD_ERR_OK) {
        $file      = $_FILES["p-image"];
        $file_tmp  = $file["tmp_name"];
        $file_name = $file["name"];
        $file_size = $file["size"];
        $file_type = $file["type"];

        // Only allow image files
        $allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!in_array($file_type, $allowed_types)) {
            echo json_encode(["success" => false, "message" => "Only image files are allowed."]);
            exit;
        }

        // Max size 5MB
        if ($file_size > 5 * 1024 * 1024) {
            echo json_encode(["success" => false, "message" => "Image must be smaller than 5MB."]);
            exit;
        }

        // Create uploads folder if it doesn't exist
        $upload_dir = "uploads/products/";
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        // Give the image a unique name and save it
        $new_file_name = uniqid("product_") . "_" . basename($file_name);
        $destination   = $upload_dir . $new_file_name;

        if (move_uploaded_file($file_tmp, $destination)) {
            $image_path = $destination;
        } else {
            echo json_encode(["success" => false, "message" => "Failed to upload image."]);
            exit;
        }
    }

    // Save product to database
    $sql = "INSERT INTO products (user_id, name, category, price, condition_type, description, image_path)
            VALUES (:user_id, :name, :category, :price, :condition_type, :description, :image_path)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":user_id"        => $user_id,
        ":name"           => $name,
        ":category"       => $category,
        ":price"          => $price,
        ":condition_type" => $condition_type,
        ":description"    => $description,
        ":image_path"     => $image_path
    ]);

    // Send success response
    echo json_encode([
        "success"    => true,
        "message"    => "Product listed successfully!",
        "product_id" => $pdo->lastInsertId()
    ]);

} else {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
}
?>