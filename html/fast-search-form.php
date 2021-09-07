<!DOCTYPE html>
<html lang="en">
<head>
    <!--

    TODO: form doesn't work on first load

    TODO: need to hook up to select again

    TODO: need to improve XSLT to pull ALL relevent info

    -->
    <meta charset="utf-8"/>
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <title>FAST SRU Search</title>

    <!-- jQuery and select2 -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
          rel="stylesheet"/>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <!-- local stuff -->
    <link rel="stylesheet" href="./css/fast.css"/>
    <script src="./js/fast-autosuggest-select2.js"></script>
    <script src="./js/get-subject-details.js"></script>
    <!--
    <script>
        $(document).ready(function () {
            selectFAST();
        });
    </script>
    -->
    <?php
    /**
     * create FAST API URL from search string
     *
     * @param $searchTerm - search string
     * @return string - FAST URL
     */
    function createFastUrl($searchTerm){
        //$site = 'https://experimental.worldcat.org/fast/search';
        $site = 'https://fast.oclc.org/fast/search';
        $startRecord = 1;
        $sortKey = "usage";
        //
        // these can come from the web form eventually
        $search = urlencode($searchTerm);
        $dataType = "application/xml";
        $maximumRecords = 7;
        $facet = "cql.any";
        //$facet = "oclc.topic";
        //$facet = "oclc.geographic";

        //
        // urlencode() doesn't work because it replaces "+" and "/" which we want to retain unchanged
        $args = array(
            "query" => $facet . "+all+%22" . $search . "%22",
            "httpAccept" => $dataType,
            "maximumRecords" => strval($maximumRecords),
            "startRecord" => strval($startRecord),
            "sortKey" => $sortKey
        );

        $url = $site . "?";
        foreach ($args as $name => $value) {
            $url .= $name . '=' . $value . '&';
        }
        // chop off last ampersand
        $url = substr($url, 0, strlen($url) - 1);

        return $url;
    }
    /**
     *
     * Download data from FAST site using Curl
     *
     * @param $url - site URL
     * @return bool|string
     * @throws Exception
     *
     */
    function downloadFastData($url){
        // setup Curl
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        try {
            $curlResult = curl_exec($ch);
        } catch (Exception $e) {
            throw new Exception($e);
        }
        curl_close($ch);
        return $curlResult;
    }

    /**
     *
     * Return FAST subject list based on search string
     * formatted for display with links to subject details pages
     *
     * @param $searchTerm - search string
     * @return false|string
     * @throws Exception
     */
    function getSubjectList($searchTerm) {
        //if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit"])) {
        if (isset($_SERVER["REQUEST_METHOD"]) && $_SERVER["REQUEST_METHOD"] == "POST") {
            if (isset($_POST["submit"]) && $_POST["submit"] == "submit" &&
                isset($_POST["query"])) {



                //
                // get data
                $url = createFastUrl($searchTerm);
                $curlResult = downloadFastData($url);

                /*
                 * need to fix the result string: 'xmlns="http...' ==> 'xmlns:srw="http...'
                 * before the XSLT transform
                 */
                $fixedCurlResult = str_replace('xmlns="http://www.loc.gov/zing/srw/"',
                    'xmlns:srw="http://www.loc.gov/zing/srw/"', $curlResult);

                if ($curlResult) {
                    $xmlDoc = new DOMDocument();
                    $xmlDoc->loadXML($fixedCurlResult);
                    //
                    $xslDoc = new DOMDocument();
                    $xslDoc->load("./xml/fast-sru.xsl");

                    $htmlDoc = new XSLTProcessor();

                    $htmlDoc->importStylesheet($xslDoc);
                    $subjectList = $htmlDoc->transformToXML($xmlDoc);

                    //return "URL = {$url}<br />" . $subjectList;
                    return $subjectList;
                }
            }
        }
        return "";
    }
    ?>
</head>

<body>

<h1>FAST SRU Search</h1>

<p><a href="../">Return to main page</a></p>

<div class="Zgrid-container">
    <table border="3">
        <!-- ************************************************************************ -->
        <tr>
            <td>
                <!-- top section -->
                <div class="Zgrid-item upper part1">
                    <form method="post"
                          name="formSRUSearch"
                          action="<?php echo htmlspecialchars($_SERVER[ "PHP_SELF" ]); ?>"
                    >
                        <div>
                            <label>Search for a FAST subject</label>
                            <!--
                            <select
                                    name="query"
                                    id="query"
                                    class="fast-autosuggest"
                                    data-placeholder="FAST subject search"
                                    data-allow-clear="1"
                                    data-width="75%"
                            >
                            </select>
                            -->
                            <input type="text" name="query"
                                   value="<?php if(isset($_POST["query"])){echo htmlspecialchars($_POST["query"]);} ?>">
                             <!-- -->
                        </div>
                        <br>
                        <div>
                            <input type="submit" name="submit" Value="submit">
                        </div>
                    </form>
                </div>
            </td>
        </tr>
        <!-- ************************************************************************ -->
        <tr>
            <td>
                <!-- bottom left section -->
                <div class="Zgrid-item lower-left part2">
                    <!-- List of subjects (with alternate spelling and URLs) will go here -->
                    <?php
                        if (isset($_POST['submit'])) {
                            $searchTerm = $_POST["query"];
                            $subjectList = getSubjectList($searchTerm);
                            echo $subjectList;
                        }
                    ?>
                </div>
            </td>
            <!-- ************************************************************************ -->
            <td>
                <!-- bottom left section -->
                <div class="Zgrid-item lower-right part 3">
                    <p>Detailed information on an individual subject</p>
                    <iframe id="subjectDetail"></iframe>
                </div>
            </td>
        </tr>
    </table>
</div>

<p><a href="../">Return to main page</a></p>
</body>
</html>
