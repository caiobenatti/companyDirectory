<?php

	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	
	// $username = $_POST['userLogIn'];
	// $password = $_POST['passwordLogIn'];
// if (isset($_POST['submit'])) {
    $query = 'SELECT * FROM users WHERE login=' . $_POST['userLogIn'] .' and password=' . $_POST['passwordLogIn'];
    
	$result = $conn->query($query);
    
    $count = $result->num_rows;

    // if ($count == 1){
    // $output['status']['code'] = "200";
	// $output['status']['name'] = "ok";
	// $output['status']['description'] = "success";
	// $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	// echo '<script>window.location.replace("index.html")</script>';
    // } else{
    //     $output['status']['code'] = "400";
	// 	$output['status']['name'] = "executed";
	// 	$output['status']['description'] = "query failed";	
	// 	$output['data'] = [];

	// 	mysqli_close($conn);

	// echo "<script type='text/javascript'>alert('Invalid Login Credentials')</script>";

	// 	exit;

    // }


	// if (!$result) {

	// 	$output['status']['code'] = "400";
	// 	$output['status']['name'] = "executed";
	// 	$output['status']['description'] = "query failed";	
	// 	$output['data'] = [];

	// 	mysqli_close($conn);

	// 	echo json_encode($output); 

	// 	exit;

	// }

	// $output['status']['code'] = "200";
	// $output['status']['name'] = "ok";
	// $output['status']['description'] = "success";
	// $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    
	header('Content-Type: application/json; charset=UTF-8');
    
echo $count;
	mysqli_close($conn);

?>

