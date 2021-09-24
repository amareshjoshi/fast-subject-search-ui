<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>Display Form Fields</title>
</head>
<body>
    <h1>Display Form Fields</h1>

    <ul>
    <?php
        foreach ($_POST as $key => $value) {
            // check if $value is an array
            if(!is_array($value)) {
                echo "<li>key = {$key}, value = {$value}</li>";
            } else {
                echo "<li> key = {$key}";
                echo "<ul>";
                foreach ($value as $index => $data) {
                    echo "<li>index = {$index}, data = {$data}</li>";
                }
                echo "</ul>";
                echo "</li>";
            }
        }
    ?>
    </ul>
    <br>
    <br>
    <a href="simple-fast-select.html">Back to the simple FAST Subject select page.</a>


</body>
</html>
