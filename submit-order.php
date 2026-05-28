<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$user_id        = $_SESSION['user_id'];
$full_name      = $data['fullName'];
$email          = $data['email'];
$address        = $data['address'];
$city           = $data['city'];
$phone          = $data['phone'];
$payment_method = $data['paymentMethod'];
$total_amount   = $data['totalAmount'];

// Insert order
$stmt = $conn->prepare("INSERT INTO orders 
    (user_id, full_name, email, address, city, phone, payment_method, total_amount) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("issssssd", $user_id, $full_name, $email, $address, $city, $phone, $payment_method, $total_amount);

if ($stmt->execute()) {
    // Clear the cart after order
    $clear = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
    $clear->bind_param("i", $user_id);
    $clear->execute();

    echo json_encode(['success' => true, 'message' => 'Order placed successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to place order']);
}
?>