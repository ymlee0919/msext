<?PHP
	// Load MapScript extension
	if (!extension_loaded("MapScript"))
			dl('php_mapscript.'.PHP_SHLIB_SUFFIX);
	
	$message = "";
	
	$tables = array();
	$result = array();
	
	$_host = $_POST['host'];
	$_port = $_POST['port'];
	$_user = $_POST['user'];
	$_pass = $_POST['pass'];
	$_dbase = $_POST['dbase'];
	
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
	
	$_query = 'SELECT (f_table_schema || \'.\' || f_table_name) as table_name, "type" as geom_type, srid FROM geometry_columns ORDER BY f_table_schema, f_table_name;';
	$_res = @pg_query($_conn, $_query);
	if(!$_res)
	{
		$message = "No es posible cargar la información";
		$result['success'] = false;
		$result['message'] = $message;
		echo json_encode($result);
		
		return;
	}
	
	$tables = pg_fetch_all($_res);
	$result['success'] = true;
	$result['tables'] = $tables;
	echo json_encode($result);
?>