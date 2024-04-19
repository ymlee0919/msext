<?PHP
	session_start();
	
	require_once('../../../Administration/Access/access_users.php');
	
	$_user_manager = new AccessUsers();
	$_current_user = $_user_manager->getCurrentUser();
	
	$mapfile = $_REQUEST["mapfile"];	
	
	$_dir = getcwd();
	
	chdir('../../../Map');
	if(file_exists("Maps/$_current_user/$mapfile"))
		unlink("Maps/$_current_user/$mapfile");
		
	chdir($_dir);
?>