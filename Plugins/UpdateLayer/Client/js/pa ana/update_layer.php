<?PHP
include('class/Model.class.php');

	$model = new Model( );

	$table = $_POST['layer'];
	if($table == 'centro_salud')
	{
	  $fields_change = "cant_camas = ".$_POST['cant_camas'].", nombre_centro = '".$_POST['nombre']."', defensa = '".$_POST['zona_defensa']."', id_tipo_centro_salud = ".$_POST['tipo_salud'].", observacio = '".$_POST['observaciones']."'";
	  $conditions = "gid=".$_POST['gid'];
	  
	}  

	$res = $model->Update_Data_Table($table, $fields_change, $conditions);
  
	$data = array('resp'=>1);
	echo json_encode($data);
 







?>