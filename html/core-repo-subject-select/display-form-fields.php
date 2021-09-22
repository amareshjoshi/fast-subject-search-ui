<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>Display Humanities CORE Deposit Form Fields</title>
</head>
<body>
    <h1>Display Humanities CORE Deposit Form Fields</h1>

    <?php
        foreach ($_POST as $key => $value) {
            echo "key = {$key}, value = {$value}<br>";
        }
    ?>
</body>
</html>
