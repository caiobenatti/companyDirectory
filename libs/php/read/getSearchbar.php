
<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("../config.php");



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
    $search = $_REQUEST['txt'];
        $query = "SELECT personnel.lastName, personnel.firstName, personnel.jobTitle, personnel.email, department.name as department, location.name as location  FROM personnel LEFT JOIN department ON personnel.departmentID = department.id LEFT JOIN location ON location.id = department.locationID WHERE  personnel.firstName LIKE '%".$search."%' OR personnel.lastName LIKE '%".$search."%' OR personnel.email LIKE '%".$search."%' OR personnel.jobTitle LIKE '%".$search."%' OR  personnel.departmentID LIKE '%".$search."%' OR department.name LIKE '%".$search."%' OR location.name  LIKE '%".$search."%' ORDER BY personnel.lastName, personnel.firstName, department.name, location.name";
    
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
	
	mysqli_close($conn);


	echo json_encode($output); 

?>
