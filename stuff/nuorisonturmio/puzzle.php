<?php
    /*$ans = [
        'stayman',
        'blackwood',
        'bergen',
        'jacoby',
        'michaels',
        'splinter',
        'texas',
        'namyats'
    ];*/
    $ans = [
        'a',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ];
    $elms = '<div id="appendix" class="hidden"><br/><img src="stuff/nuorisonturmio/b19.png"><h2 id="finalQ">19?</h2></div>';
    $data = json_decode(file_get_contents('php://input'), true);
    $answers = $data['msg'] ?? [];
    $response = [];
    $com = 0;
    foreach ($answers as $i => $val) {
        if ($ans[$i] === $val) {
            $response[$i] = 1;
            $com++;
        } else {
            $response[$i] = 0;
        }
    }
    if ($com < 8) {
        echo json_encode(['status' => 'incomplete', 'list' => $response]);
    } else {
        echo json_encode(['status' => 'complete', 'elms' => $elms]);
    }
?>