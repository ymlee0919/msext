<?php 
include('DBManagerPgsql.class.php');
class Model {
	private $id;
	
	public function __construct() {
		$this->id = new DBManagerPgsql ( );
		$this->id->conect ( 'localhost', '5432', 'postgres', 'postgres', 'riesgosig');
	}
	
	public function Insert_Data_From_Table_($table, $fields, $values) {

		if ($table != "" && $values != "") {	
			if ($fields != "") {
			$result = $this->id->Execute_Query ( "INSERT INTO " . $table . " (" . $fields . ") VALUES (" . $values . ")" );												
				return $result;
			} else {
				$result = $this->id->Execute_Query ( "INSERT INTO " . $table . " VALUES (" . $values . ")" );
				return $result;
			}
		} else {
			$this->error = "No ha especificado bien la tabla o los valores a insertar!!!";
			return false;
		}
	}
		
	/*************************** Seleccionar datos  *******************************/
	
	public function Select_Data_From_Table($table, $fields, $conditions) {
		if ($table != "" && $fields != "") {
			if ($conditions != "") {
				$query_select = "SELECT " . $fields . " FROM " . $table . " WHERE " . $conditions;
				echo "SELECT " . $fields . " FROM " . $table . " WHERE " . $conditions;	
				return $this->id->Execute_Query ( $query_select );
			} else {
				$query_select = "SELECT " . $fields . " FROM " . $table;
				//print_r($query_select);die();
				return $this->id->Execute_Query ( $query_select );
			}
		} else
			$this->id->error = "Para Seleccionar Datos debe especificar la Tabla y los  valores que desea insertar ...";
		return false;
	
	}
	
	/*************************** Actualizar campos de la base de datos  *******************************/
	
	public function Update_Data_Table($table, $fields_change, $conditions) {
		if (empty ( $table ) && empty ( $fields_change )) {
			$this->id->error = "No se puede ejecutar esta accion porque debe especificar la tabla y los campos que va a cambiar";
			return false;
		} else {
			if (empty ( $conditions ))
				$query_update = "UPDATE " . $table . " SET " . $fields_change; else
				$query_update = "UPDATE " . $table . " SET " . $fields_change . " WHERE " . $conditions;
			
			return $this->id->Execute_Query ( $query_update );
		}
	}
	
	/*************************** Eliminar campos de la base de datos  *******************************/
	public function Delete_Data_From_Table($table, $conditions) {
		if (empty ( $table )) {
			$this->id->error = "No se puede ejecutar esta accion porque debe especificar la tabla y los campos que va a cambiar";
			return false;
		} else {
			if (empty ( $conditions ))
				$query_delete = "DELETE FROM " . $table; else
				$query_delete = "DELETE FROM " . $table . " WHERE " . $conditions;
			
			return $this->id->Execute_Query ( $query_delete );
		}
	}
	
	/*************************** Cantidad de filas afectadas en una consulta *******************************/
	
	public function Get_Num_Fields_Affects($query) {
		return $this->id->Amount_Rows_Affect ( $query );
	}
	
	/*************************** get_file_array *******************************/
	public function get_file_array($query_id) {
		return $this->id->get_file_array ( $query_id );
	}
	
	/*************************** Liberar el Resultado *******************************/
	public function _free_result($query_id) {
		return $this->id->_free_result ( $query_id );
	}
	
	function _microtime_float() {
		return $this->id->_microtime_float ();
	}

}

?>