<?PHP
	session_start();
	
	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	///--------------------------------------------------------------------
	/// Request tratment
	///--------------------------------------------------------------------
	// Connection data
	$_host = $_REQUEST['host'];
	$_port = $_REQUEST['port'];
	$_user = $_REQUEST['user'];
	$_pass = $_REQUEST['pass'];
	$_dbase = $_REQUEST['dbase'];
	
	// Layer data
	$_table_name = $_REQUEST['table_name'];
	$_layer_name = $_REQUEST['layer_name'];
	$_layer_color = $_REQUEST['layer_color'];
	$_layer_outline_color = $_REQUEST['layer_outline_color'];
	$_layer_type = $_REQUEST['layer_type'];
	$_layer_tranparency = $_REQUEST['layer_transparency'];
	$_srid = $_REQUEST['srid'];
	
	// Layer type
	$_lType = "";
	if( strpos($_layer_type,'POLYGON') )
		$_lType = MS_SHAPE_POLYGON;
	elseif( strpos($_layer_type,'LINE') )
		$_lType = MS_SHAPE_LINE;
	elseif( strpos($_layer_type,'POINT') )
		$_lType = MS_SHAPE_POINT;
	
	// Building data source
	$_str_connection = "dbname=$_dbase user=$_user password=$_pass host=$_host port=$_port";
	$_conn = @pg_connect($_str_connection);
	
	$_query = "SELECT f_geometry_column FROM geometry_columns WHERE(f_table_schema || '.' || f_table_name) = '$_table_name';";
	$_res = pg_query($_conn, $_query);
	$_geom_field = pg_fetch_result($_res,0,'f_geometry_column');
	
	$_data = "$_geom_field from $_table_name USING SRID=$_srid USING Unique gid";
	
	///--------------------------------------------------------------------
	/// Creation
	///--------------------------------------------------------------------
	$msMap = new msExt_Map();
	$msextLayer = $msMap->CreateLayer($_layer_name, true);
	$msextLayer->SetProperties(array( 'connectiontype' => MS_POSTGIS,
									'connection' => $_str_connection,
									'data' => $_data,
									'type' => $_lType,
									'template' => 'ttt',
									'transparency' => $_layer_tranparency));
	$msextLayer->SetMetadata(array('table_name' => $_table_name));
	
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
	$data['legend'] = $msMap->BuildLegend();
	
	echo json_encode($data);
?>