<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
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

 $query = "SELECT login, password FROM users";

//   WHERE login=' . $_POST['userLogIn'] .' and password=' . $_POST['passwordLogIn']
	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}
		   

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	
	if($output['data'][0]['login'] == $_POST['userLogIn'] and $output['data'][0]['password'] == $_POST['passwordLogIn']){
		echo header('Location:../../app.html');
	}else{
			echo "<script type='text/javascript'>alert('Invalid Login Credentials')</script>";
	echo header('Location:../../index.html');
	echo "<script type='text/javascript'>alert('Invalid Login Credentials')</script>";
}

    header('Content-Type: application/json; charset=UTF-8');
    
	mysqli_close($conn);


?>