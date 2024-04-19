<?PHP
session_start();
include('class/Model.class.php');
	
	// Load MapScript extension
	if (!extension_loaded("MapScript"))
			dl('php_mapscript.'.PHP_SHLIB_SUFFIX);

	$model = new Model( );
	$list_cadena = Array();
	$list_aux = Array();
	$list_field = Array();

	$map_name = $_POST["map_name"];
	$map = ms_newMapObj($map_name);
				
	$layer = $map->getLayerByName($_POST['layer']);
	
	$table = $layer->getMetaData("table_name");
	
	
	$cadena = str_ireplace('<__field_value/>','=',$_POST['info']);
	$list_cadena = split( "<__new_field>", $cadena);
    for($i=0;$i<count($list_cadena);$i++)
	{
	    $list_aux = split( "=", $list_cadena[$i]);
		$list_aux[1] = "'$list_aux[1]'";
		
		array_push($list_field, implode('=',$list_aux));
	}
   
	$fields_change = implode(',',$list_field);
	$conditions = 'gid = '.$_POST['gid'];
   
	IF($layer->connectiontype == MS_POSTGIS)
	{
		$_str_connection = $layer->connection;
		$_conn = @pg_connect($_str_connection);
		 
		$query = 'UPDATE '.$table.'  SET '.$fields_change.' WHERE '.$conditions;
		
		$res = @pg_query($query); 	
		if($res === FALSE )
		 $resp = pg_last_error(); 
		 else
		 $resp=1;
		 
	}
	ELSE 
	{		
		//$layer->open();
		//$_shape = $layer->getShape(-1,$_POST['gid']);
		//$_aux = str_replace('\/','/',$_SESSION['APP_PATH']);
		//$filename = $_aux.'/Map/data/'.$layer->data;
		//$shape_file = ms_newShapefileObj($filename, -2);
		//$_shape = $shape_file->getTransformed($map, $_POST['gid']);
		
		
		
		//$_shape = $shape_file->getShape(0);
		//$list_value = $_shape->values['VERSION'];
		//$_shape->values['VERSION'] = '1000';
		//$shape_file->addShape($_shape);
		//$shape_file->free();
		//$layer->close();
		
		$resp='Aun no actualiza los shape';
	}
   
	$data = array('result'=>$resp, 'shp'=>$_shape->values);
	echo json_encode($data);
?>