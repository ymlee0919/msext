<?php
	session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);
	require_once('../../../Administration/Access/PostgresSQL/conection.php');

	$msMap = new msExt_Map();

	$instance = new Conectar();
	$connection = $instance->Conectar();
	
	$nombre = $_POST["leaf"];
	$color = $_POST["color"];
	
	//color
	$R = hexdec(substr($color, 0, 2));
	$G = hexdec(substr($color, 2, 2));
	$B = hexdec(substr($color, 4, 2));
	
	eval("\$color_RGB = array($R,$G,$B);");
	
	$query = "SELECT minx, miny, maxx, maxy FROM superponible.hojas WHERE nombre = '$nombre';";

	$result = @pg_query($query); 	
	$bounds =  array();	
			 
	if($result)
	{
	   if(@pg_num_rows($result) != 0)
	   {
			$bounds = @pg_fetch_all($result);			
			$msMap->CreateLayoutLayer($bounds[0][minx], $bounds[0][miny], $bounds[0][maxx], $bounds[0][maxy], $color_RGB);
			if($_POST["persist"] == true) 
				$msMap->Save();
			$msMap->ZoomRect($bounds[0][minx]." ".$bounds[0][miny]." ".$bounds[0][maxx]." ".$bounds[0][maxy]);
	   }
	}	
	
	$data = $msMap->DrawMap();

	echo json_encode($data);
?>