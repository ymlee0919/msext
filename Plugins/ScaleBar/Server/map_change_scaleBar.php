<?PHP
	session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();

	$position = $_POST["position"];
	$units = $_POST["units"];
	$intervals = $_POST["intervals"];
	$transparent = $_POST["transparent"];
	$color = $_POST["color"];
	$color_b = $_POST["color_b"];
	$width = $_POST["width"];
	$height = $_POST["height"];	
	
	//color
	$R = hexdec(substr($color, 0, 2));
	$G = hexdec(substr($color, 2, 2));
	$B = hexdec(substr($color, 4, 2));
	
	//color de borde
	$RB = hexdec(substr($color_b, 0, 2));
	$GB = hexdec(substr($color_b, 2, 2));
	$BB = hexdec(substr($color_b, 4, 2));

	$msMap->SetPropertyToScaleBar('intervals', $intervals);
	$msMap->SetPropertyToScaleBar('height', $height);
	$msMap->SetPropertyToScaleBar('width', $width);
	$msMap->SetPropertyToScaleBar('transparent', ($transparent == true) ? true : false);
	
	eval("\$real_units = $units;");
	$msMap->SetPropertyToScaleBar('units', $real_units);
	
	eval("\$real_position = $position;");
	$msMap->SetPropertyToScaleBar('position', $real_position);

	eval("\$color_RGB = array($R,$G,$B);");
	$msMap->SetColorToScaleBar($color_RGB);
	
	eval("\$bordercolor_RGB = array($RB,$GB,$BB);");
	$msMap->SetBorderColorToScaleBar($bordercolor_RGB);
	
	$msMap->Save();
	
	$msMap->SetExtent();
	$data = $msMap->DrawMap();

	echo json_encode($data);
?>