<?PHP
session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();
		
	if(isset($_REQUEST['layer']))
	{
		$query_rect =  msExt_Map::StrToRectOBJ($_REQUEST["query_rect"]);
		
		$result = array();
		$data = array();
		
		$_layer = $msMap->GetLayer($_REQUEST['layer']);
		$_type = $_layer->GetType();

		$_qlayer_iterator = $_layer->QueryByRect($query_rect);
		$_qlayer_iterator->Open();
		
		while($_qlayer_iterator->Next())
		{
			$_shape = $_qlayer_iterator->GetCurrentShape();
			$_data = $_shape->values;
			$_keys = array_keys($_data);
			foreach($_keys as $key)
				$_values[$key] = ($_type != MS_POSTGIS) ? utf8_encode($_data[$key]) : $_data[$key];

			$_fields = $_values;
			$_fields['length'] = $_shape->getLength();
			$_fields['area'] = $_shape->getArea();
			$_fields['shapeindex'] = $_qlayer_iterator->GetCurrentShapeIndex();
			array_push($data,$_fields);
		}
		
		$_qlayer_iterator->Close();
		
		if(count($data) > 0)
		{
			$count = count($data);
			$columns = implode(',',array_keys($_shape->values));
			$columns = $columns.',length,area,shapeindex';
			$result = array('count' => $count, 'columns' => $columns, 'data' => $data);
		}
		else
		{
			$result = array('count' => 0);
		}
	}

	echo json_encode($result);
?>