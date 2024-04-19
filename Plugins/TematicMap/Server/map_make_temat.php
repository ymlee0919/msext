<?PHP
	session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();

	$_colors = $_POST["colors"];
	$_colors_array = substr($_colors,1,strlen($_colors) - 2);
	$_colors_array = str_replace('\\','',$_colors_array);

	$_nombres = $_POST["nombres"];
	$_nombres_array = substr($_nombres,1,strlen($_nombres) - 2);
	$_nombres_array = str_replace('\\','',$_nombres_array);

	eval("\$color_values = array($_colors_array);");
	eval("\$nombre_values = array($_nombres_array);");

	if(isset($_REQUEST["layer"]) && isset($_REQUEST["field"]))
	{
		$field = $_REQUEST["field"];
		$msext_layer = $msMap->GetLayer($_REQUEST["layer"]);
		
		if($msext_layer)
		{
			$cant_class = $msext_layer->getMetadata('cant_class_temat');
			if($cant_class)
				while($cant_class--)
					$msext_layer->DeleteClass(0);
		}

		// Create layer classes
		$cont = 0;		
		for($i = 0; $i< count($color_values); $i++)
		{
			$utf_value = $nombre_values[$i];

			$value = ($msext_layer->GetType() == MS_POSTGIS) ? $utf_value : utf8_decode($utf_value);

			$cant_up = $msext_layer->getNumClasses();			
			$cont += 1;

			//color
			$R = hexdec(substr($color_values[$i], 0, 2));
			$G = hexdec(substr($color_values[$i], 2, 2));
			$B = hexdec(substr($color_values[$i], 4, 2));

			eval("\$color_RGB = array($R,$G,$B);");

			$_class_index = $msext_layer->CreateClass($value, TRUE);
			$_style_index = $msext_layer->AddStyleToClass($_class_index);
			$msext_layer->SetColorToStyle($_class_index, $_style_index, $color_RGB);
			$msext_layer->SetBorderColorToStyle($_class_index, $_style_index, array(0,0,0));			
			$msext_layer->SetExpression($_class_index, "(\"[$field]\"='$value')");
			
			while($cant_up--)			
				$msext_layer->MoveClassUp($_class_index--);			
		}

		$msext_layer->SetMetadata(array('cant_class_temat' => $cont));

		$msMap->Save();
		$msMap->UpdateReference();
	}

	$msMap->SetExtent();
	$data = $msMap->DrawMap();
	$data['legend'] = $msMap->BuildLegend();

	echo json_encode($data);
?>