<?PHP
	session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();
	
	$_str_connection = "dbname=datosfg user=postgres password=postgres host=localhost port=5432";
	$_conn = @pg_connect($_str_connection);
	$map_extent = explode(" ",$_SESSION['MSEXT_MAP_EXTENT']);
	$minx = $map_extent[0];
	$miny = $map_extent[1];
	$maxx = $map_extent[2];
	$maxy = $map_extent[3];
	
	$_query = "SELECT superponible.testing_geometry($minx, $miny, $maxx, $maxy );";
	$_res = pg_query($_conn, $_query);
	if($_res)
	{
		$view_id = pg_fetch_result($_res, 'testing_geometry');
		$msextLayer = $msMap->GetOrCreateLayer('Ocultacion');
		$_str_data = "the_geom FROM superponible.result_storage WHERE view_id = $view_id USING SRID=4267001 USING Unique gid";
		
		$msextLayer->SetProperties(array( 'connectiontype' => MS_POSTGIS,
									'connection' => $_str_connection,
									'data' => $_str_data,
									'type' => MS_SHAPE_POLYGON,
									'template' => 'ttt',
									'transparency' => 100));
	}
	
	$_query = "CREATE OR REPLACE VIEW superponible.resultados AS
				 SELECT nextval('superponible.gid_serial'::regclass)::integer AS gid,
					'Bueno'::character varying AS varchar,
					force_collection(
						force_2d(
							st_intersection(
								st_intersection(ST_BuildArea(suelo.wkb_geometry), ST_BuildArea(vegetacion.wkb_geometry)),
								setsrid(
									st_makebox2d(st_makepoint($minx, $miny),
									st_makepoint($maxx, $maxy))::geometry,
								find_srid('', 'mfg_25000.tgsuelo', 'wkb_geometry'))))) 
					AS the_geom
				   FROM ( SELECT  tgsuelo.wkb_geometry
				           FROM mfg_25000.tgsuelo
				          WHERE (tgsuelo.prf = 1 OR tgsuelo.prf = 2)
						AND ST_Intersects (tgsuelo.wkb_geometry, setsrid(
										st_makebox2d(
											st_makepoint($minx, $miny),
											st_makepoint($maxx, $maxy))::geometry,
										find_srid('', 'mfg_25000.tgsuelo', 'wkb_geometry')) )
					) suelo,
					( SELECT tgvegetacion.wkb_geometry
				           FROM mfg_25000.tgvegetacion
				          WHERE (cte IN ( SELECT regexp_split_to_table('1980,1981,1990', ',')::bigint AS cte))
						AND ST_Intersects (tgvegetacion.wkb_geometry, setsrid(
										st_makebox2d(
											st_makepoint($minx, $miny),
											st_makepoint($maxx, $maxy))::geometry,
											find_srid('', 'mfg_25000.tgvegetacion', 'wkb_geometry')) )
					) vegetacion
				  WHERE ST_Intersects(suelo.wkb_geometry, vegetacion.wkb_geometry);";
	$_res = pg_query($_conn, $_query);
	
	$msMap->SetExtent();
	$data = $msMap->DrawMap();
	
	echo json_encode($data);
?>