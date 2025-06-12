<?php
    $db = new PDO('sqlite:myst.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("CREATE TABLE IF NOT EXISTS guesses (answer TEXT PRIMARY KEY, attempts INTEGER)");
    $guess = strtolower(trim($_POST['guess'] ?? ''));
    if ($guess) {
        $s = $db->prepare("INSERT INTO guesses (answer, attempts) VALUES (:guess, 1) ON CONFLICT(answer) DO UPDATE SET attempts = attempts + 1");
        $s->execute([':guess' => $guess]);
    } else {
        $res = $db->query("SELECT * FROM guesses");
        $rows = $res->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);
    }
?>