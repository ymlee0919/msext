<?PHP 
	$message;
	if(is_uploaded_file($_FILES['shp_file']['tmp_name']) &&
		is_uploaded_file($_FILES['dbf_file']['tmp_name']) &&
		is_uploaded_file($_FILES['shx_file']['tmp_name']))
	{
		if(!move_uploaded_file($_FILES['shp_file']['tmp_name'], "../../../Map/data/".$_FILES['shp_file']['name'] ))
		{
			$message = "Shp";
		}
		
		if(!move_uploaded_file($_FILES['dbf_file']['tmp_name'], "../../../Map/data/".$_FILES['dbf_file']['name'] ))
		{
			$message = (count($message) == 0) ? "Dbf" : $message . ",Dbf" ;
		}
		
		if(!move_uploaded_file($_FILES['shx_file']['tmp_name'], "../../../Map/data/".$_FILES['shx_file']['name'] ))
		{
			$message = (count($message) == 0) ? "Shx" : $message . ",Shx" ;
		}
		
		if($message == "")
			echo '{success:true}';
		else
			echo '{success:false, failed:'.json_encode($message).'}';
	}
	else
	{
		if(!is_uploaded_file($_FILES['shp_file']['tmp_name']))
			$message = "Shp file";
		if(!is_uploaded_file($_FILES['dbf_file']['tmp_name']))
			$message = (count($message) == 0) ?  "Dbf file" : $message .", ". "Dbf file" ;			
		if(!is_uploaded_file($_FILES['shx_file']['tmp_name']))
			$message = (count($message) == 0) ? "Shx file" : $message .", ". "Shx file" ;

		if($message == "")
			echo '{success:true}';
		else
			echo '{success:false, failed:'.json_encode($message).'}';
	}	
?>