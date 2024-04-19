<?PHP
	// Load MapScript extension
	if (!extension_loaded("MapScript"))
			dl('php_mapscript.'.PHP_SHLIB_SUFFIX);
			
	$map_name = $_POST["map_name"];
	$legend = $_POST["legend"];
	$scale = $_POST["scale"];
	$size = $_POST["size"];
	if(!$size)
		$size = 'A4';
	
	$orientation = $_POST['orientation'];
	
	$pages = array(	'A3' => array(842,1190),
					'A4' => array(595,842),
					'A5' => array(421,595),
					'Carta' => array(612,792),
					'Legal' => array(612,1008) );

	$map = ms_newMapObj($map_name);
	
	
	if($scale)
		$map->scalebar->set('status',MS_EMBED);
	
	if($legend)
		$map->legend->set('status',MS_EMBED);
	
	$_width = 0;
	$_heigth = 0;
	
	if($orientation == 'p')
	{
		$_width = $pages[$size][0];
		$_heigth = $pages[$size][1];
	}
	else
	{
		$_width = $pages[$size][1];
		$_heigth = $pages[$size][0];
	}
	
	// Set map size
	$map->setSize($_width - 15, $_heigth - 40);
	if(isset($_POST["extent"]))
	{
		$extent_to_set = explode(" ",$_POST["extent"]); 
		$_set_extent = true;
		$map->setextent($extent_to_set[0],$extent_to_set[1],
		$extent_to_set[2],$extent_to_set[3]);
	}
	
	$image = $map->draw();
	$image_url=$image->saveWebImage();	
		
	$result = "$image_url";
	$data = array('result'=>$result, 'width' => $_width, 'heigth' => $_heigth, 'extent' => $_set_extent);
	
	echo json_encode($data);
?>