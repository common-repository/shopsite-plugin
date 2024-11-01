<?php
define("DOWNLOAD",  1);
define("UPLOAD",  2);
define("PUBLISH",  3);

function oauth($clientid, $secretkey, $code, $authorizationurl, $request_type, $options, $xml_file=false, $verify_peer=false) {
  error_reporting(E_ALL);

  #stuff generated from config stuff, for authorization request
  $nonce1 = mt_rand(10000000,99999999);
  $credentials = "$clientid:$nonce1"; # clientid:nonce1
  $encodedcredentials = base64_encode($credentials); # base64 encoded credentials
  $hmachash1 = hash_hmac("sha1", $encodedcredentials, $secretkey, true); # encoded credentials, signed with secret key
  $signature1 = base64_encode($hmachash1); # signed hash base64 encoded

  #stuff for download request
  $token = ''; # this will contain the result of the authorization request
  $nonce2 = mt_rand(10000000,99999999); # nonce for download request
  $timestamp = time(); # in UNIX time

  # create the data string for the authorization request and get length for Content-Length
  $request = "grant_type=authorization_code&code=$code&client_credentials=$encodedcredentials&signature=$signature1";
  $length = strlen($request);

  $response = wp_remote_post($authorizationurl, array(
    'headers' => array('Content-Type: application/x-www-form-urlencoded', "Content-Length: $length"),
    'body'    => $request,
    'timeout' => 30
  ));

  if (wp_remote_retrieve_response_code($response) != 200) {
    return array('success'=>false, 'error'=>'OAUTH call failed. Error: '.wp_remote_retrieve_response_message($response));
  } else
    $json = wp_remote_retrieve_body($response);

  //debug_print($json);

  $json = json_decode($json, true);
  if (!is_array($json))
    return array('success'=>false, 'error'=>'Malformed response or bad URL');

  if (array_key_exists("error", $json)) {
    return array('success'=>false, 'error'=>"OAUTH request error: ".$json['error_description']);
  }

  switch ($request_type) {
  case DOWNLOAD:
    $endpointurl = $json['download_url'];
    break;
  case UPLOAD:
    $endpointurl = $json['upload1_url'];
    break;
  case PUBLISH:
    $endpointurl = $json['publish_url'];
    break;
  }
  //debug_print("endpoint: ".$endpointurl);

  $url_stuff = parse_url($endpointurl);
  $endpoint = $url_stuff['path'];
  $domain = $url_stuff['host'];
  if (strstr($endpointurl, "https://"))
    $port = 443;
  else
    $port = 80;

  # get query parameters into array, and sort alphabetically ascending (not up to spec)
  $data = $options;
  ksort($data);

  # should also percent encode names and values according to http://tools.ietf.org/html/draft-hammer-oauth-v2-mac-token-02#section-3.3.1.1
  $token = $json['access_token'];
  # put the array back into an MAC-compatible string
  //$imploded = http_build_query($data,'',"\n", PHP_QUERY_RFC3986);
  $imploded = "";
  foreach($data as $k=>$v) {
    $imploded.= "$k=".rawurlencode($v)."\n";
  }
  $imploded = trim($imploded,"\n");
  //debug_print($imploded);
  $macdigest = "$token\n$timestamp\n$nonce2\n\nPOST\n$domain\n$port\n$endpoint\n$imploded\n";
  $macdigesthash = hash_hmac("sha1", $macdigest, $secretkey, true);
  $signature2 = base64_encode($macdigesthash);

  $data['signature'] = $signature2;
  $data['token'] = $token;
  $data['timestamp']=$timestamp;
  $data['nonce']=$nonce2;

  if ($request_type == UPLOAD && !array_key_exists('filename', $data)) {
    $data['UploadFile'] = "@$xml_file;type=text/xml";
  }

  $db_request = "";
  foreach ($data as $k=>$v) {
    $db_request .= "$k=".rawurlencode($v)."&";
  }
  $db_request = trim($db_request, "&");

  //debug_print("db_request: $db_request");

  $response = wp_remote_post($endpointurl, array('body' => $db_request));
  if (wp_remote_retrieve_response_code($response) != 200) {
    return array('success'=>false, 'error'=>'Data request failed. Error: '.wp_remote_retrieve_response_message($response));
  }
  $downloaddata = wp_remote_retrieve_body($response);

  //debug_print("downloaddata: $downloaddata");

  if (($json2 = json_decode($downloaddata, true)) != NULL) {
    if (array_key_exists('error', $json2)) {
      return array('success'=>false, 'error'=>"Data request error: ".$json2['error_description']);
    }
  }

  if ($request_type == UPLOAD) {
    if(array_key_exists('filename', $data)) {
      $matches = array();
      preg_match("/dbmake.cgi\?(.*)?\"/", $downloaddata, $matches);
      if (count($matches) > 1)
        $downloaddata = $matches[1];
      else
        return array('success'=>false, 'error'=>"DBupload output error, no compatible string for DBmake");
    }

    $endpointurl = $json['upload2_url'];
    $nonce3 = mt_rand(10000000,99999999);
    $timestamp3 = time();
    //$db_request = $downloaddata."&token=$token&timestamp=$timestamp3&nonce=$nonce3";

    $pieces = explode("&", $downloaddata);
    sort($pieces);
    $imploded = implode("\n",$pieces);

    $url_stuff = parse_url($endpointurl);
    $endpoint = $url_stuff['path'];
    $domain = $url_stuff['host'];
    if (strstr($endpointurl, "https://"))
      $port = 443;
    else
      $port = 80;

    $macdigest = "$token\n$timestamp3\n$nonce3\n\nPOST\n$domain\n$port\n$endpoint\n$imploded\n";
    $macdigesthash = hash_hmac("sha1", $macdigest, $secretkey, true);
    $signature3 = base64_encode($macdigesthash);
    $db_request = $downloaddata."&token=$token&timestamp=$timestamp3&nonce=$nonce3&signature=$signature3";

    $response = wp_remote_post($endpointurl, array('body' => $db_request));
    if (wp_remote_retrieve_response_code($response) != 200) {
      return array('success'=>false, 'error'=>'DBmake request failed. Error: '.wp_remote_retrieve_response_message($response));
    }
    $downloaddata = wp_remote_retrieve_body($response);

    if (($json2 = json_decode($downloaddata, true)) != NULL) {
      if (array_key_exists('error', $json2)) {
        return array('success'=>false, 'error'=>"DBmake request error: ".$json2['error_description']);
      }
    }

    return array('success'=>true);
  }

  if ($request_type == DOWNLOAD) {
    return array('success'=>true, 'data'=>$downloaddata);
  }

  if ($request_type == PUBLISH) {
    return array('success'=>true);
  }
}

