<?PHP
	session_start();

	include_once('../../Framework/Server/ServerManagement/FnCaller.php');
	include_once('../../Framework/Server/ServerManagement/Validator.php');
	include_once('../../Framework/Server/DataAccess/ConnectionsManager.php');

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/msExt_Map.php';
	require_once($_map_path);
        
	// Get params to call the function
	$_function = $_REQUEST['fn'];

	// Get passed parameters by the user
	$_params = array();
	foreach( array_keys($_REQUEST) as $key)
		if( $key != 'fn' )
			$_params[$key] = $_REQUEST[$key];
	
	$_caller = new FnCaller();
	$_result = array();
	$_success = $_caller->Execute($_function, $_params);
	if($_success === false)
		$_result['errors'] = $_caller->GetErrorList();
	else
		$_result = $_caller->GetResult();
	
	$_result['success'] = $_success;
	echo json_encode($_result);
?>
