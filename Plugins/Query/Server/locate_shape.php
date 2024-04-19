<?PHP
	session_start();
	
	// Load MapScript extension
	if (!extension_loaded("MapScript"))
			dl('php_mapscript.'.PHP_SHLIB_SUFFIX);
	
	$_drawer_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.MapDrawer.php';
	include_once($_drawer_path);
	
	$map_name = $_POST["map_name"];
	$map = ms_newMapObj($map_name);
	$mMan = new MapManager($map);
				
	$qlayer = $map->getLayerByName($_POST["layer"]);
 
	 $qlayer->open();
	 $_shape = $qlayer->getShape(-1,$_POST["shapeIndex"]);
	 $_bound = $_shape->bounds;
	 $_centroid = $_shape->getCentroid();
	 $qlayer->close();
	 
	 $_x = $_centroid->x;
	 $_y = $_centroid->y;
	 
	 if($qlayer->type == MS_LAYER_POINT)
	 {
	  $extent_to_set = explode(" ",$_POST["extent"]);  
	  
	  $_xOffset = floatval($extent_to_set[2]) - floatval($extent_to_set[0]);
	  $_yOffset = floatval($extent_to_set[3]) - floatval($extent_to_set[1]); 
	  
	  $map->setExtent(
	   $_x - $_xOffset/2, 
	   $_y - $_yOffset/2, 
	   $_x + $_xOffset/2, 
	   $_y + $_yOffset/2);
	 }
	 else
	 { 
	  $xOffset = $_bound->maxx - $_bound->minx;
	  $yOffset = $_bound->maxy - $_bound->miny;
	  
	  $map->setextent($_x - $xOffset * 1.25,
	      $_y - $yOffset * 1.25,
	      $_x + $xOffset * 1.25,
	      $_y + $yOffset * 1.25);   
	 }		
	
	$data = $mMan->DrawMap();
	echo json_encode($data);
?>