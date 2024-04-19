<?php 
class DBManagerPgsql
{
   //*************   FUNCION CONECTAR  *************************//

    private $_link_id = NULL;
	private $user;
	private $passwd;
	private $server;
	private $db;
	private $port_num;
	private $failed;
	private $_query = 0;
	
	public function __construct() {
		;
	}
	
	/*************** Constructor de la clase ** @return conexion ********************************/
	
	public function conect($server, $port, $user, $pass, $db) {
		$conexion = "host=$server port=$port user=$user password=$pass dbname=$db";
		return $this->_link_id = @pg_connect ( $conexion );
	
	}
		/************************ Ejecutar una consulta en la Base de datos *************************/
	
	public function Execute_Query($sqlValue) {
		if ($sqlValue == "") {			
			return - 1;
		} else
			return $this->_query = pg_query ( $sqlValue );
	}


}
?>
