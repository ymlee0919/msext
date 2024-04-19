<?PHP

session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();
		
	if(isset($_REQUEST['layer']))
	{
		$img_point = ms_newpointObj();
		$img_point->setXY($_REQUEST["mapa_x"],$_REQUEST["mapa_y"]);
		
		$qx = 0;
		$qy = 0;
		list($qx,$qy) = msExt_Map::Img2Map($msMap->GetInnerMap()->width,$msMap->GetInnerMap()->height,$img_point, msExt_Map::StrToRectOBJ($_SESSION['MSEXT_MAP_EXTENT']));
		
		$qpoint = ms_newPointObj();
	    $qpoint->setXY($qx,$qy);
		
		$result = array();
		
		$_layer = $msMap->GetLayer($_REQUEST['layer']);
		$_type = $_layer->GetType();
		$_gid = -1;
		
		$_qlayer_iterator = $_layer->QueryByPoint($qpoint);
		$_qlayer_iterator->Open();
		if($_qlayer_iterator->Next())
		{
			$_gid = $_qlayer_iterator->GetCurrentShapeIndex();
			
			$_shape = $_qlayer_iterator->GetCurrentShape();
			$_data = $_shape->values;
			$_keys = array_keys($_data);
			foreach($_keys as $key)
				$_values[$key] = ($_type != MS_POSTGIS) ? utf8_encode($_data[$key]) : $_data[$key];

			$result[0] = $_values;
		}
		else
		{
			$result[0] = array();
			$result[0]['Capa'] = $_REQUEST["layer"];
			$result[0]['Coordenada X'] = $qx;
			$result[0]['Coordenada Y'] = $qy;
			$result[0]['Resultados'] = "0";
		}
		
		$_qlayer_iterator->Close();
		
	}

	$data = array('shapeindex'=>$_gid, 'result'=>$result);
	echo json_encode($data);
?>