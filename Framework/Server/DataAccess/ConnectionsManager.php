<?php
require_once(realpath(dirname(__FILE__)) . '/../DataAccess/ConnectionsStorage.php');
require_once(realpath(dirname(__FILE__)) . '/../DataAccess/DataBase.php');

final class ConnectionsManager
{

     /**
      * @ParamType connectionName
      * @ReturnType DataBase
      * Get the connection to a database given the name of the connection
      */
     public static function GetDatabase($connectionName)
     {
          if(isset($_SESSION[$connectionName]))
               $_connection_data = $_SESSION[$connectionName];
          else
          {
               // Get current active subsystem
               $_subsystem = $_SESSION['CUS'];
               // Buid the path to include the config storage class
               $_config_path = $_SESSION['APP_PATH'] . "/Systems/$_subsystem/Config/Server/db_config.php";
               // Validate that the file exists
               if(!is_file( $_config_path ) )
               {
                    ErrorManager::RegisterError('IO Error', "Not connections defined for '$_subsystem' system");
                    return null;
               }

               // Load the file
               require_once($_config_path);
               // Build the name of the class
               $_class_name = $_subsystem . "Connections";
               // Validate that the class exists
               if (!class_exists($_class_name, false))
               {
                    ErrorManager::RegisterError('Class Error', "Not connections class defined for '$_subsystem' system");
                    return null;
               }

               // Create the instance of the class
               $_connections_storage = new $_class_name();
               // Validate that the class is an instance of ConnectionsStorage
               if (!is_subclass_of($_connections_storage, 'ConnectionsStorage'))
               {
                    ErrorManager::RegisterError('ConnectionsStorage Error', 'Invalid class of connections storage');
                    return null;
               }

               // Get the connection data
               $_connection_data = $_connections_storage->GetConnectionParams($connectionName);
               $_SESSION[$connectionName] = $_connection_data;
          }
          
          if(is_null($_connection_data))
          {
               ErrorManager::RegisterError('Connection error', "The connection '$connectionName' does not exists for the sistem '$_subsystem'");
               return null;
          }

          return self::GetConnectionOfType($_connection_data['type'], $_connection_data);
     }

     /**
      * @ReturnType DataBase
      * Get the connection to database of security
      */
     public static function GetSecurityDatabase()
     {
          $connectionName = 'security';
          
          if(isset($_SESSION[$connectionName]))
               $_connection_data = $_SESSION[$connectionName];
          else
          {
               // Load the file
               require_once(realpath(dirname(__FILE__)) . '../../../../App/Config/db_access.php');

               // Create the instance of the class
               $_connections_storage = SecurityConnections::GetInstance();

               // Get the connection data
               $_connection_data = $_connections_storage->GetConnectionParams($connectionName);
               $_SESSION[$connectionName] = $_connection_data;
          }

          return self::GetConnectionOfType($_connection_data['type'], $_connection_data);
     }

     /**
      * @ParamType connectionType string Type of the connection
      * @ParamType strConnection string Connection string
      * @ReturnType DataBase
      * Get the connection to a database given the type and the connection string
      */
     public static function GetConnectionOfType($connectionType, $connectionData)
     {
          // Create the data base connection according to the type of connection
          switch (strtolower($connectionType))
          {
               case 'pgsql':
               case 'postgresql':
               case 'postgres':
                    ConnectionsManager::LoadApi('PgSQL');
                    return new PgSQL_DataBase($connectionData);
                    break;
               case 'mysql':
               case 'my_sql':
               case 'my sql':
                    ConnectionsManager::LoadApi('MySQL');
                    return new MySQL_DataBase($connectionData);
                    break;
               case 'mssql':
               case 'ms_sql':
               case 'ms sql':
               case 'sqlserver':
               case 'sql_server':
               case 'sql server':
                    ConnectionsManager::LoadApi('MsSQL');
                    return new MsSQL_DataBase($connectionData);
                    break;
               case 'access':
                    ConnectionsManager::LoadApi('ODBC');
                    return new ODBC_DataBase($connectionData);
                    break;
          }

          return null;
     }

     /**
      * @ParamType connectionType
      * Load the files of the api
      */
     private static function LoadApi($connectionType)
     {
          require_once(realpath(dirname(__FILE__)) . "/../DataAccess/$connectionType/$connectionType" . "_DataBase.php");
          require_once(realpath(dirname(__FILE__)) . "/../DataAccess/$connectionType/$connectionType" . "_Table.php");
          require_once(realpath(dirname(__FILE__)) . "/../DataAccess/$connectionType/$connectionType" . "_Selection.php");
          require_once(realpath(dirname(__FILE__)) . "/../DataAccess/$connectionType/$connectionType" . "_ResultIterator.php");
     }

}

?>