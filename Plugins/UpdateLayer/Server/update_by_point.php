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
	
	//$map_name = "../" . $_POST["map_name"];
	$map_name = $_POST["map_name"];
	$map = ms_newMapObj($map_name);
	
	$extent_to_set = explode(" ",$_POST["extent"]); 
		
	$my_point = ms_newpointObj();
	$my_point->setXY($_POST["mapa_x"],$_POST["mapa_y"]);
	
	$qx = 0;
	$qy = 0;
	
	$old_extent = ms_newRectObj();
	$extent = $extent_to_set;
	$old_extent->setextent($extent[0],$extent[1],$extent[2],$extent[3]);
	
	list($qx,$qy) = img2map($map->width,$map->height,$my_point,$old_extent);
	
	$qpoint = ms_newPointObj();
    $qpoint->setXY($qx,$qy);
	
	$qlayer = $map->getLayerByName($_POST["layer"]);
	$units = array(MS_INCHES => 0.0254, MS_FEET => 0.3048, MS_MILES => 1609.344, MS_METERS => 1, MS_KILOMETERS => 1000, MS_DD => 102983.4);
	
	$radius = 10;
	//$map->set('units',MS_METERS);
	//$qlayer->set("toleranceunits",MS_METERS);
	$res = @$qlayer->queryByPoint($qpoint, MS_SINGLE, ($radius / $units[$map->units]));
	
	$result = array();
	$_gid = -1;
	
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
			 	 $_values[$key] = ($_data[$key]);				
				 $cont++;				
			}			
			$result[0] = $_values;
			$qlayer->close();
		}
	}
	else
	{
		$result[0] = array();
		$result[0]['Resultados'] = "0";
	}
	
	$data = array('shapeindex'=>$_gid, 'result'=>$result, 'cant_field'=>$cont);
	
	echo json_encode($data);
?>