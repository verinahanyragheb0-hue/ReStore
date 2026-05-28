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
$phone          = $data['phone'];
$device_model   = $data['deviceModel'];
$issue_type     = $data['issueType'];
$appointment    = $data['appointmentDate'];
$issue_desc     = $data['issueDesc'];

$stmt = $conn->prepare("INSERT INTO repair_requests 
    (user_id, full_name, email, phone, device_model, issue_type, appointment_date, issue_desc) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isssssss", $user_id, $full_name, $email, $phone, $device_model, $issue_type, $appointment, $issue_desc);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Repair request submitted successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to submit request']);
}
?>