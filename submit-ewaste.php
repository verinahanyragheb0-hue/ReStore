<?php
session_start();
require 'db_connect.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$user_id         = $_SESSION['user_id'];
$device_list     = $data['deviceList'];
$disposal_method = $data['disposalMethod'];
$pickup_address  = $data['pickupAddress'] ?? '';
$preferred_date  = $data['preferredDate'];

$stmt = $conn->prepare("INSERT INTO ewaste_requests 
    (user_id, device_list, disposal_method, pickup_address, preferred_date) 
    VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("issss", $user_id, $device_list, $disposal_method, $pickup_address, $preferred_date);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'E-waste request submitted successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to submit request']);
}
?>