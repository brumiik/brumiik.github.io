<?php
// Povolení přijímání JSON dat
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['payload']) \vert{}\vert{} !isset($data['divize'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Neplatná data']);
    exit;
}

// ZDE VLOŽ SVÉ DISCORD WEBHOOKY
$webhookTS = "https://discord.com/api/webhooks/1564314004216619018/0Sewo2bpLq4NaMN3ajgn3JjB3ttces36bhG_wpLHwY2iNxze4K2pAOoDWd54j6wwS-m9"; 
$webhookParky = "https://discord.com/api/webhooks/1564314004216619018/0Sewo2bpLq4NaMN3ajgn3JjB3ttces36bhG_wpLHwY2iNxze4K2pAOoDWd54j6wwS-m9";

$divize =$data['divize'];
$cilovyWebhook = ($divize === 'Správa parků') ? $webhookParky :$webhookTS;

// Odeslání do Discordu přes cURL
$ch = curl_init($cilovyWebhook);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data['payload']));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode >= 200 &&$httpcode < 300) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Chyba při komunikaci s Discordem. Kód: ' . $httpcode]);
}
?>