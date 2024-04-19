<?PHP
	session_start();	

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	// Layer propertys
	$_layer_data = $_POST["shape"];	
	$_layer_name = $_REQUEST['shape_name'];
	$_layer_color = $_REQUEST['shape_color'];
	$_layer_outline_color = $_REQUEST['shape_outline'];	
	$_layer_tranparency = $_REQUEST['shape_transparency'];		

	$_shape_file = ms_newShapefileObj($_SESSION['APP_PATH'].'/Map/Shapes/public/'.$_layer_data.'.shp',-1);	
	switch ($_shape_file->type) {
	case 1:
		$_layer_type = MS_LAYER_POINT;
		break;
	case 3:
		$_layer_type = MS_LAYER_LINE;
		break;	
	default:
		$_layer_type = MS_LAYER_POLYGON;
		break;
	}	
	$_shape_file->free();
	
	///--------------------------------------------------------------------
	/// Creation
	///--------------------------------------------------------------------
	$msMap = new msExt_Map();
	$msextLayer = $msMap->CreateLayer($_layer_name, true);
	$msextLayer->SetProperties(array('data' => 'public/'.$_layer_data,
									'type' => $_layer_type,
									'template' => 'ttt',
									'transparency' => $_layer_tranparency));	
	
	$_class_id = $msextLayer->CreateClass($_layer_name, true);
	$_style_id = $msextLayer->AddStyleToClass($_class_id);
	
	// Layer color
	$_r = hexdec(substr($_layer_color,0,2));
	$_g = hexdec(substr($_layer_color,2,2));
	$_b = hexdec(substr($_layer_color,4,2));
	$msextLayer->SetColorToStyle($_class_id, $_style_id, array($_r,$_g,$_b));
	
	// Layer outline color
	$_r = hexdec(substr($_layer_outline_color,0,2));
	$_g = hexdec(substr($_layer_outline_color,2,2));
	$_b = hexdec(substr($_layer_outline_color,4,2));
	$msextLayer->SetBorderColorToStyle($_class_id, $_style_id, array($_r,$_g,$_b));
	
	$msMap->Save();
	$msMap->UpdateReference();
	$msMap->SetExtent();
	$data = $msMap->DrawMap();
	echo json_encode($data);	
?>