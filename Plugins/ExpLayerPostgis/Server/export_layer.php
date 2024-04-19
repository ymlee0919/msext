<?PHP
	// Load MapScript extension
	if (!extension_loaded("MapScript"))
			dl('php_mapscript.'.PHP_SHLIB_SUFFIX);
	
	//$_drawer_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.MapDrawer.php';
	//include_once($_drawer_path);
	
	$message = "";
	
	$tables = array();
	$result = array();
	$list_attributes = array();
	$list_value = array();
	$list_type = array();
	$cont=0;
	
	$_host = $_POST['host'];
	$_port = $_POST['port'];
	$_user = $_POST['user'];
	$_pass = $_POST['pass'];
	$_dbase = $_POST['dbase'];
	$_schema = $_POST['schema'];
	$_table = $_POST['table'];
	//$_projection = $_POST['projection'];
	$_projection = 2085;
	
	$_str_connection = "dbname=$_dbase user=$_user password=$_pass host=$_host port=$_port";
	$_conn = @pg_connect($_str_connection);
	
	if(!$_conn)
	{
		$message = "No es posible establecer conexión";
		
		$result['success'] = false;
		$result['message'] = $message;
		echo json_encode($result);
		
		return;
	}
	
	$qtable = pg_query("select count(*) from geometry_columns where f_table_name='$_table'");
	$sys = pg_fetch_array($qtable);
	
	if($sys[0] == 1)
	{
		$qdrop = pg_query('DROP TABLE '.$_table.';');
		$qdelete = pg_query("DELETE FROM geometry_columns where f_table_name= '$_table';");
	}
		
	$map_name = $_POST["map_name"];
	$map = ms_newMapObj($map_name);

	$qlayer = $map->getLayerByName($_POST["layer"]);
	
	$qlayer->open();
	
	$qlayer->whichshapes($map->extent);
	
	$shape = $qlayer->nextShape();
	$fields = $shape->values;
	$fields_keys = array_keys($fields);

	foreach($fields_keys as $keys)
	{
		$_type = (is_numeric($fields[$keys])) ? ' double precision' : ' character varying';
		$temp = $keys.' '.$_type;
		array_push($list_attributes, $temp);
		array_push($list_type, $_type);
	}
	
	$query_cadena =  implode( ',', $list_attributes);
	
	if($qlayer->type == MS_LAYER_POINT)
	$_layer_type = 'POINT';
	else if($qlayer->type == MS_LAYER_LINE)
	$_layer_type = 'MULTILINESTRING';
	else if($qlayer->type == MS_LAYER_POLYGON)
	$_layer_type = 'MULTIPOLYGON';
	
	$qcreate = 'CREATE TABLE '.$_table.' ( gid serial NOT NULL, '.$query_cadena.',
				CONSTRAINT '.$_table.'_pkey PRIMARY KEY (gid)
				)
				WITH (OIDS=FALSE);
				ALTER TABLE '.$_table.' OWNER TO postgres;';
	
	
	$query = pg_query($qcreate);
	
	$qselect = "SELECT AddGeometryColumn('$_schema', '$_table','the_geom',$_projection,'$_layer_type',2)";
	$query = pg_query($qselect);
	$gid = 0;

	do
	{
		$_row_values = array();
		$fields = $shape->values;
		
		for($i=0; $i<count($fields);$i++)
		{
			$_row_values[$i] = ( $fields [ $fields_keys[$i] ]);
			
			if($_row_values[$i] == '')
			$_row_values[$i] = 'null';
			else
			$_row_values[$i] = "'$_row_values[$i]'";
			
			 if($list_type[$i] == ' double precision')
			 $_row_values[$i] = floatval($_row_values[$i]);
		}
	
		$_fields = implode(',',$fields_keys);
		$_fields = strtolower($_fields);

		$_values = implode(',',$_row_values);
		
		/*$qinsert = 'INSERT INTO '.$_table.' (gid, '.$_fields.')
					VALUES ('.$gid.', '.$_values.');';
		*/
		$text = $shape->toWkt();
		$qinsert = "INSERT INTO $_table (gid, $_fields, the_geom)
					VALUES ($gid, $_values, GeomFromText('$text',2085))";
				
		echo $qinsert;
		die();
		//$query = pg_query($qinsert);
		
		$gid++;
		
	}while($shape = $qlayer->nextShape());

	$qlayer->close();
	
	$result['success'] = true;
	$result['_fields'] = $_fields;
	$result['_values'] = $_values;
	$result['_row_values'] = $_row_values;
	$result['list_type'] = $list_type;
	
	
	echo json_encode($result);
?>