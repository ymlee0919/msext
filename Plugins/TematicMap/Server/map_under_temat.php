<?PHP

	session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();	
	
	if(isset($_REQUEST["layer"]))
	{
		$msext_layer = $msMap->GetLayer($_REQUEST["layer"]);		
		if($msext_layer)
		{
			$cant_class = $msext_layer->getMetadata('cant_class_temat');
			if($cant_class)
				while($cant_class--)
					$msext_layer->DeleteClass(0);
		}
		
		$msext_layer->SetMetadata(array('cant_class_temat' => 0));	
		$msext_layer->Close();
	
		$msMap->Save();
		$msMap->UpdateReference();
	}	
	
	$msMap->SetExtent();
	$data = $msMap->DrawMap();
	$data['legend'] = $msMap->BuildLegend();

	echo json_encode($data);
?>