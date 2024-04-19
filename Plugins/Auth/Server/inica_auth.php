<?PHP
	session_start();
	
	// Load MapScript extension
	if (!extension_loaded("MapScript"))
			dl('php_mapscript.'.PHP_SHLIB_SUFFIX);
	
	$_drawer_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.MapDrawer.php';
	include_once($_drawer_path);
	
	function AddLayer($Map, $LayerName, $TableName, $GeomType, $LayerColor, $OutLineColor, $Filter)
	{
		$_layer = @$Map->getLayerByName($LayerName);
		if(!$_layer)
		{
			$_str_connection = "dbname=dbinica user=postgres password=postgres host=localhost port=5432";
			$_data = "the_geom from $TableName USING Unique gid";
			
			// Layer creation
			$_layer = ms_newLayerObj($Map);
			$_layer->set('name',$LayerName);
			$_layer->set('connectiontype',MS_POSTGIS);
			$_layer->set('connection',$_str_connection);
			$_layer->set('data',$_data);
			$_layer->set('type',$GeomType);
			$_layer->set('template','ttt');
			$_layer->set('status',MS_ON);
			$_layer->setMetadata('table_name',$TableName);
			
			//Class creation
			$_class = ms_newClassObj($_layer);
			$_class->set('name',$LayerName);
			$_class->set('status',MS_ON);
			
			//Style creation
			$_style = ms_newStyleObj($_class);		
			$_style->color->setRGB($LayerColor[0], $LayerColor[1], $LayerColor[2]);	
			$_style->outlinecolor->setRGB($OutLineColor[0], $OutLineColor[1], $OutLineColor[2]);
		}
		
		// Filter
		$_layer->setFilter(null);
		
		if($Filter != null)
			$_layer->setFilter($Filter);
	}
	
	$map_name = $_POST["map_name"];
	$map = ms_newMapObj($map_name);
	$mMan = new MapManager($map);
	$extent_to_set = explode(" ",$_POST["extent"]);
	
	$_user = $_POST["user"];
	$_pass = $_POST["pass"];
	
	$result = array();
	
	$_conn = pg_connect("dbname=dbinica user=postgres password=postgres host=localhost port=5432");
	if($_conn)
	{
		$_register_function = "SELECT seguridad.fn_register_user('$_user', '$_pass') as user;";
		$_reg = pg_query($_conn, $_register_function);
		if($_reg)
		{
			$_user_id = pg_fetch_result($_reg, 0, 'user');
			if($_user_id == '<null>')
			{
				$result['success'] = false;
				$result['message'] = utf8_encode("Usuario o contraseña inválida...");
			}
			else
			{
				$_permition_function = "SELECT seguridad.fn_get_user_premition('$_user_id') as permition;";
				$_perm = pg_query($_conn, $_permition_function);
				
				if($_perm)
				{
					$_emp_id = pg_fetch_result($_perm, 0, 'permition');
					if($_emp_id == '<null>')
					{
						$result['success'] = false;
					}
					else
					{
						$_filter = null;
						
						if($_emp_id != 'admin')
						{
							// Set the filter
							$_filter = "empresa = '$_emp_id'";
						}
						
						AddLayer($map, 'Instalaciones', 'public.instalaciones', MS_LAYER_POINT, array(15,220,118), array(5,200,196), $_filter);
						AddLayer($map, 'Pozos', 'public.pozos', MS_LAYER_POINT, array(25,210,128), array(5,200,196), $_filter);
						AddLayer($map, 'Parcela canna', 'public.parcela_canna', MS_LAYER_POLYGON, array(204,255,255), array(204,255,255), $_filter);
						AddLayer($map, 'Parcelas de otros usos', 'public.parcelas_otros_usos', MS_LAYER_POLYGON, array(255,102,0), array(255,102,0), $_filter);
						AddLayer($map, 'Viales de unidades', 'public.viales_unidades', MS_LAYER_LINE, array(0,0,255), array(5,200,196), $_filter);
						
						$map->save($_POST["map_name"]);
						
						// Drawing the new map
						$mMan->UpdateReference(200, 150);
							
						$map->setextent($extent_to_set[0],$extent_to_set[1],$extent_to_set[2],$extent_to_set[3]);

						$image=$map->draw();
						$image_url=$image->saveWebImage();
						$extent_to_html = $map->extent->minx." ".$map->extent->miny." ".$map->extent->maxx." ".$map->extent->maxy;
						
						$reference = $map->drawReferenceMap();
						$reference_url= $reference->saveWebImage();
						
						$scale_bar = $map->drawScaleBar();
						$scale_bar_url = $scale_bar->saveWebImage();
						
						$scale = $map->scale;
						
						$res = "$image_url#$extent_to_html#$reference_url#$scale#$scale_bar_url";
						
						$result['success'] = true;
						$result['result'] = $res;
						
					}
				}
				else
				{
					$result['success'] = false;
					$result['message'] = 'Error al determinar permisos de usuario...';
				}
			}
		}
		else
		{
			$result['success'] = false;
			$result['message'] = utf8_encode('Usuario o contraseña no válida...');
		}
	}
	else
	{
		$result['success'] = false;
		$result['message'] = utf8_encode('Error de conexión con la base de datos...');
	}
	
	echo json_encode($result);
?>