<?PHP	
	if (!extension_loaded("MapScript"))
		dl('php_mapscript.'.PHP_SHLIB_SUFFIX);
	
	chdir('../../../Map/Shapes/public');
	$directory = dir(getcwd());
	$current_dir = getcwd();
		
	$_public_shapes = array();
	
	while (false !== ($entrada = $directory->read()))
	{
		if(is_file($entrada) && substr($entrada, strlen($entrada) - 4) == ".shp" )
		{			
			$shape_name = substr($entrada, 0, strlen($entrada) - 4);			
			array_push($_public_shapes, array('shape'=>$shape_name));
		}
	}
	
	$directory->close();
	
	$_result = array('count'=>count($_public_shapes), 'shapes'=>$_public_shapes);
	echo json_encode($_result);
?>