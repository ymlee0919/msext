<?PHP
	session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();
	
	$_leaf = $_REQUEST['leaf'];
	
	$_str_connection = "dbname=datosfg user=postgres password=postgres host=localhost port=5432";
	$_conn = @pg_connect($_str_connection);
	
	$_query = "SELECT superponible.build_tematic_map('$_leaf');";
	$_res = pg_query($_conn, $_query);
	
	if($_res)
	{
		$view_id = pg_fetch_result($_res, 'build_tematic_map');
		$msextLayer = $msMap->GetOrCreateLayer('Ocultacion');
		$_str_data = "the_geom FROM (SELECT * FROM superponible.result_storage WHERE view_id = $view_id) as data USING SRID=4267001 USING Unique gid";
		
		$msextLayer->SetProperties(array( 'connectiontype' => MS_POSTGIS,
									'connection' => $_str_connection,
									'data' => $_str_data,
									'type' => MS_SHAPE_POLYGON,
									'template' => 'ttt',
									'transparency' => 100));

		$_class_id = $msextLayer->CreateClass('Bueno', true);
		$_style_id = $msextLayer->AddStyleToClass($_class_id);
		
		// Layer color
		$msextLayer->SetColorToStyle($_class_id, $_style_id, array(0,0,255));
		// Layer outline color
		$msextLayer->SetBorderColorToStyle($_class_id, $_style_id, array(255,255,0));

		$msMap->Save();
	}
	
	pg_close($_conn);
	
	$msMap->SetExtent();
	$data = $msMap->DrawMap();
	$data['legend'] = $msMap->BuildLegend();
	
	echo json_encode($data);
?>