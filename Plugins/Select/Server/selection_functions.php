<?PHP
session_start();

	$_map_path = $_SESSION['FRAMEWORK_PATH'].'/MsExt.Map.php';
	include_once($_map_path);

	$msMap = new msExt_Map();
	$data = array();

	if(isset($_REQUEST['layer']))
	{
		$_layer = $msMap->GetLayer($_REQUEST['layer']);

		$_qlayer_iterator = null;
		// Define the Query Layer Iterator
		if(isset($_REQUEST['query_rect']))
		{
			$query_rect =  msExt_Map::StrToRectOBJ($_REQUEST["query_rect"]);
			$_qlayer_iterator = $_layer->QueryByRect($query_rect);
		}
		elseif(isset($_REQUEST['polygon']))
		{
			$polygon = $_REQUEST["polygon"];
			$_shp_polygon = ms_shapeObjFromWkt($polygon);
			$_qlayer_iterator = $_layer->QueryByShape($_shp_polygon);
		}
		elseif(isset($_REQUEST["mapa_x"]) && isset($_REQUEST["mapa_y"]))
		{
			$img_point = ms_newpointObj();
			$img_point->setXY($_REQUEST["mapa_x"],$_REQUEST["mapa_y"]);

			$qx = 0;
			$qy = 0;
			list($qx,$qy) = msExt_Map::Img2Map($msMap->GetInnerMap()->width,$msMap->GetInnerMap()->height,$img_point, msExt_Map::StrToRectOBJ($_SESSION['MSEXT_MAP_EXTENT']));

			$qpoint = ms_newPointObj();
		    $qpoint->setXY($qx,$qy);

			if(isset($_REQUEST["radius"]))
			{
				if($_REQUEST["radius"] != 0)
				{
					$radius = $_REQUEST["radius"];
					$_qlayer_iterator = $_layer->QueryByCircle($img_point, $radius, MS_MULTIPLE);
				}
				else
					$_qlayer_iterator = $_layer->QueryByPoint($img_point);
			}
			else
				$_qlayer_iterator = $_layer->QueryByPoint($qpoint);
		}

		$_shape_list = array();
		$_action = "none";

		if(!is_null($_qlayer_iterator))
		{
			$_selection_count = $_qlayer_iterator->GetResultCount();
			if($_selection_count == 0)
			{
				if($_layer->HaveHighlightedLayer())
				{
					$_action = 'clear';
					$_layer->UnderHighlightLayer();
				}
			}
			else
			{
				$_action = "add";
				$_qlayer_iterator->Open();
				$_hlayer = $_layer->CreateHighlightedLayer();

				while($_qlayer_iterator->Next())
				{
					array_push($_shape_list, $_qlayer_iterator->GetCurrentShapeIndex());
					$_hlayer->AppendFeature($_qlayer_iterator->GetCurrentFeature());
				}
				$_qlayer_iterator->Close();
			}
		}

		// If any change, save and redraw the map
		if($_action != "none")
		{
			$msMap->Save();
			$msMap->UpdateReference();
			$msMap->SetExtent();

			$result = $msMap->DrawMap();
			$result['action'] = $_action;
			$result['list'] = $_shape_list;
			$data = $result;
		}
		else
			$data = array('action' => 'none');
	}

	echo json_encode($data);
?>