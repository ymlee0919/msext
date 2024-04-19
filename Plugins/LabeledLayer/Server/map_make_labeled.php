<?PHP
	session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();

	$layer_name = $_POST["layer"];
	$field = $_POST["field"];
	$size = $_POST["size"];
	$position = $_POST["position"];
	$min_scale = $_POST["min_scale"];
	$max_scale = $_POST["max_scale"];
	$color = $_POST["color"];
	$transparency = $_POST["transparency"];
	$force = $_POST["force"];
	$partials = $_POST["partials"];

	//color
	$R = hexdec(substr($color, 0, 2));
	$G = hexdec(substr($color, 2, 2));
	$B = hexdec(substr($color, 4, 2));

	if(isset($_REQUEST["layer"]))
	{		
		$msext_layer = $msMap->GetLayer($_REQUEST["layer"]);		
		if($msext_layer)
		{
			$_ms_layer = $msext_layer->CreateLabeledLayer($field, TRUE);
			//Se configura el rango de visibilidad
			if($min_scale != 0){$_ms_layer->SetProperty('labelminscale', $min_scale);}
			if($max_scale != 0){$_ms_layer->SetProperty('labelmaxscale', $max_scale);}
			$_ms_layer->SetProperty('transparency', $transparency);
			//Se le adiciona la clase
			$_class_index = $_ms_layer->CreateClass('Labeled',TRUE);
			
			//Se configura el etiquetado
			$_ms_layer->SetPropertyToLabel($_class_index, 'type', MS_BITMAP);
			
			eval("\$real_size = $size;");
			$_ms_layer->SetPropertyToLabel($_class_index, 'size', $real_size);
			
			eval("\$real_position = $position;");
			$_ms_layer->SetPropertyToLabel($_class_index, 'position', $real_position);
			
			$_ms_layer->SetPropertyToLabel($_class_index, 'force', ($force == true) ? true : false);
			$_ms_layer->SetPropertyToLabel($_class_index, 'partials', ($partials == true) ? true : false);
			
			eval("\$color_RGB = array($R,$G,$B);");
			$_ms_layer->SetColorToLabel($_class_index, $color_RGB);
		}
	}	
	
	$msMap->Save();
	
	$msMap->SetExtent();
	$data = $msMap->DrawMap();
	$data['legend'] = $msMap->BuildLegend();

	echo json_encode($data);
?>