<?PHP
	// Load MapScript extension
	if (!extension_loaded("MapScript"))
			dl('php_mapscript.'.PHP_SHLIB_SUFFIX);

	function img2map($width,$height,$point,$ext) 
	{
		// valid point required
		if ($point->x && $point->y)
		{
			// find degrees per pixel
			$dpp_x = ($ext->maxx - $ext->minx)/$width; 
			$dpp_y = ($ext->maxy - $ext->miny)/$height;
			// calculate map coordinates
			$p[0] = $ext->minx + $dpp_x*$point->x;
			$p[1] = $ext->maxy - $dpp_y*$point->y;
		}
		return $p;
	}
	
	//$map_name = "../" . $HTTP_POST_VARS["map_name"];
	$map_name = $HTTP_POST_VARS["map_name"];
	$map = ms_newMapObj($map_name);
	
	$extent_to_set = explode(" ",$HTTP_POST_VARS["extent"]); 
		
	$my_point = ms_newpointObj();
	$my_point->setXY($HTTP_POST_VARS["mapa_x"],$HTTP_POST_VARS["mapa_y"]);
	
	$qx = 0;
	$qy = 0;
	
	$old_extent = ms_newRectObj();
	$extent = $extent_to_set;
	$old_extent->setextent($extent[0],$extent[1],$extent[2],$extent[3]);
	
	list($qx,$qy) = img2map($map->width,$map->height,$my_point,$old_extent);
	
	$qpoint = ms_newPointObj();
    $qpoint->setXY($qx,$qy);
	
	$qlayer = $map->getLayerByName($HTTP_POST_VARS["layer"]);
	
	$_list = $qlayer->getMetaData('field_list');
	$_field_list = explode(',',$_list);
	
	$units = array(MS_INCHES => 0.0254, MS_FEET => 0.3048, MS_MILES => 1609.344, MS_METERS => 1, MS_KILOMETERS => 1000, MS_DD => 102983.4);
	
	$radius = 10;
	//$map->set('units',MS_METERS);
	//$qlayer->set("toleranceunits",MS_METERS);
	$res = @$qlayer->queryByPoint($qpoint, MS_SINGLE, ($radius / $units[$map->units]));
	
	$result = array();
	$_gid = -1;
	$cont=0;
	
	if($res == MS_SUCCESS)
	{
		$numResults = $qlayer->getNumResults();
		
		if ($numResults != 0) 
		{
			$_query_result = $qlayer->getResult(0);
			$_gid = $_query_result->shapeindex;
			
			$qlayer->open();
			$_shape = $qlayer->getShape(-1,$_query_result->shapeindex);
			$_data = $_shape->values;
			$_keys = array_keys($_data);
			
			foreach($_keys as $key)
			{
			   if(array_search($key,$_field_list) !== false)
				{			   
				 $_values[$key] = ($_data[$key]);				
				 $cont++;
				}
			}			
			$result[0] = $_values;
			$qlayer->close();
		}
	}
	else
	{
		$result[0] = array();
		$result[0]['Capa'] = $HTTP_POST_VARS["layer"];
		$result[0]['Coordenada X'] = $qx;
		$result[0]['Coordenada Y'] = $qy;
		$result[0]['Resultados'] = "0";
	}
	
	$data = array('shapeindex'=>$_gid, 'result'=>$result, 'cant_field'=>$cont);
	
	echo json_encode($data);
?>