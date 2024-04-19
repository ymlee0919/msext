<?PHP
	session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();
	
	$field = $_REQUEST["field"];
	$_list_out_values = array();

	if(isset($_REQUEST["layer"]) && isset($_REQUEST["field"]))
	{
		$msext_layer = $msMap->GetLayer($_REQUEST["layer"]);
		if($msext_layer)
		{
			$_values = $msext_layer->GetValuesOfField($field);
			
			for($i = 0; $i < count($_values); $i++)
			{
				$R = rand(0, 255);
				$G = rand(0, 255);
				$B = rand(0, 255);		
				$Hex_R = dechex($R);
				$Hex_G = dechex($G);
				$Hex_B = dechex($B);
				$_temp = array();
				$_temp[0] = $_values[$i][$field];
				$_temp[1] = ((strlen($Hex_R) ==  1) ? '0'.$Hex_R : $Hex_R).''.((strlen($Hex_G) ==  1) ? '0'.$Hex_G : $Hex_G).''.((strlen($Hex_B) ==  1) ? '0'.$Hex_B : $Hex_B);
				array_push($_list_out_values,$_temp);			
			}
		}
	}
	
	echo json_encode($_list_out_values);
?>