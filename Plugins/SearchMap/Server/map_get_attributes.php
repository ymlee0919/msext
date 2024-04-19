<?PHP
	session_start();
	
	// Load MapScript extension
	if (!extension_loaded("MapScript"))
			dl('php_mapscript.'.PHP_SHLIB_SUFFIX);
					
	extract($_REQUEST);
	
	$map = ms_newMapObj($map_name);
	
	$layer_name = $layer;
	
	$layer = $map->getLayerByName($layer_name);

	$status = $layer->open();	
	$status = $layer->whichShapes($map->extent);

	$list_attributes = array();
	$fields = array();
	
	while ($shape = $layer->nextShape())
	{		
		$fields = $shape->values;
		break;
	}		
	
	foreach(array_keys($fields) as $keys)
	{
		$list_attributes[count($list_attributes)] = array();
		$list_attributes[count($list_attributes) - 1]['name_attribute'] = $keys;
		$list_attributes[count($list_attributes) - 1]['type'] = (is_numeric($fields[$keys])) ? 'numeric' : 'string';
	}
	
	$status = $layer->close();			
	
	echo json_encode($list_attributes);
?>