<?php

abstract class ConnectionsStorage
{
     protected $connections_config;

     public function __construct()
     {
          $this->connections_config = array();
     }
     
     public final function GetConnectionParams($ConnectionName)
     {
          return $this->connections_config[$ConnectionName];
     }
}

?>
