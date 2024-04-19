<?PHP
	session_start();
	
	require_once('../../../Administration/Access/access_users.php');

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);
	
	$_user_manager = new AccessUsers();
	$_current_user = $_user_manager->getCurrentUser();
	
	$mapfile = $_REQUEST["mapfile"];
	$map_name = $_REQUEST["map_name"];
	
	$msMap = new msExt_Map();
	$msMap->GetInnerMap()->set('name',$map_name);
	$_dir = getcwd();
	
	chdir('../../../Map');
	if(!is_dir("Maps/$_current_user"))
		mkdir("Maps/$_current_user");
	$filename =  $_SESSION['APP_PATH'] . "/Map/Maps/$_current_user/$mapfile";
	$msMap->SaveAs($filename);
	chdir($_dir);
?>