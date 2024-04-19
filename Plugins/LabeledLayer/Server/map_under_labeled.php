<?PHP
	session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();

	if(isset($_REQUEST["layer"]))
	{		
		$msext_layer = $msMap->GetLayer($_REQUEST["layer"]);		
		if($msext_layer)		
			$msext_layer->UnderLabeledLayer();		
	}	
	
	$msMap->Save();
	
	$msMap->SetExtent();
	$data = $msMap->DrawMap();
	$data['legend'] = $msMap->BuildLegend();

	echo json_encode($data);
?>