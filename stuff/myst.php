<?php
    $db = new PDO('sqlite:myst.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("CREATE TABLE IF NOT EXISTS guesses (answer TEXT PRIMARY KEY, attempts INTEGER)");
    $guess = preg_replace('/[^a-zA-Z0-9äöåÄÖÅ]/u', '', strtolower(trim($_POST['guess'] ?? '')));
    $page = preg_replace('/[^a-zA-Z0-9äöåÄÖÅ]/u', '', strtolower(trim($_POST['page'] ?? '')));
    $df = __DIR__ . "/{$page}/puzzle.txt";
    $ap = __DIR__ . "/{$page}/solved.html";

    if (!file_exists($df)) {
        http_response_code(404);
        echo json_encode(["error" => "Datatiedosto hukassa"]);
        exit;
    }
    if (!file_exists($ap)) {
        http_response_code(404);
        echo json_encode(["error" => "Vastaussivu hukassa"]);
        exit;
    }
    $apc = file_get_contents($ap);
    $lines = file($df, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if ($guess !== 'villatehdas') {
        $replies = [];
        $coords = [];
        $currentKey = null;

        $s = $db->prepare("INSERT INTO guesses (answer, attempts) VALUES (:guess, 1) ON CONFLICT(answer) DO UPDATE SET attempts = attempts + 1");
        $s->execute([':guess' => $guess]);

        foreach ($lines as $line) {
            $line = trim($line);
            if (str_starts_with($line, '#')) {
                $currentKey = strtolower(substr($line, 1));
                if ($currentKey !== 'coords') {
                    $replies[$currentKey] = [];
                }
            } elseif ($currentKey) {
                if ($currentKey === 'taunts') {
                    [$cue, $taunt] = explode('%', $line, 2);
                    $replies[$currentKey][] = [
                        'cue' => trim($cue),
                        'taunt' => trim($taunt)
                    ];
                } elseif ($currentKey === 'coords') {
                    $coords[] = $line;
                } else {
                    $replies[$currentKey][] = $line;
                }
            }
        }

        if (in_array($guess, $replies['answer'])) {
            echo json_encode(['status' => 'correct', 'ap' => $apc, 'coords' => $coords]);
        } elseif (in_array($guess, $replies['closes'])) {
            echo json_encode(['status' => 'incorrect', 'message' => 'polttaa...']);
        } else {
            foreach ($replies['taunts'] as $t) {
                if (str_contains($guess, $t['cue'])) {
                    echo json_encode(['status' => 'incorrect', 'message' => $t['taunt']]);
                    exit;
                }
            }
            echo json_encode(['status' => 'incorrect', 'message' => 'hmm...']);
        }
    } else {
        $res = $db->query("SELECT * FROM guesses");
        $rows = $res->fetchAll(PDO::FETCH_ASSOC);
        usort($rows, function($a, $b) {
            return $b['attempts'] - $a['attempts'];
        });
        echo json_encode(['status' => 'cheater', 'responses' => $rows]);
    }
?>