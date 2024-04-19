<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/PgSQL/PgSQL_Table.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/PgSQL/PgSQL_Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/PgSQL/PgSQL_ResultIterator.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/DataBase.php');

class PgSQL_DataBase extends DataBase {

     /**
      * @ParamType strConnection 
      * Constructor of the class
      */
     public function __construct($connectionParameters) {
          parent::__construct($connectionParameters);

          $host = $connectionParameters['host'];
          $port = $connectionParameters['port'];
          $user = $connectionParameters['user'];
          $pass = $connectionParameters['pass'];
          $dbase = $connectionParameters['dbase'];

          $_str_conn = "host=$host port=$port dbname=$dbase user=$user password=$pass";

          $this->_conn = pg_connect($_str_conn);
//          pg_set_client_encoding($this->_conn, 'WIN1252');

          if ($this->_conn === false)
               $this->_conn = null;
     }

    public function SetClientEncoding($Encoding)
    {
        pg_setclientencoding($Encoding);
    }

     /**
      * Execute a function given the parameters
      */
     public function ExecuteFunction() {
          $_args = func_get_args();
          // If the count of arguments is 0, return without execute
          if (count($_args) == 0)
               return;

          // The name of the function is the first parameter
          $_fn = $_args[0];
          $_fn_name = $_args[0];

          // Get the name of the function
          // because it can be "public.foo" or "funct_n"
          $_fn_tokens = explode('.', $_fn_name);
          if (count($_fn_tokens) > 2) {
               $_error = "The name of the function [" . $_fn . "] is not valid";
               $this->RegisterError('Invalid Function Name', $_error);
               return null;
          }

          // The name of the function is allways the last token
          $_function_name = $_fn_tokens[count($_fn_tokens) - 1];
          // Build the full function name
          $_fn_name = ( count($_fn_tokens) == 1 ) ? "public." . $_fn_name : "$_fn_name";

          // The rest of the parameters are the parameters of the function
          $_param_list = '';
          for ($i = 1; $i < count($_args); $i++)
               $_param_list .= (strlen($_param_list) == 0) ? strval($_args[$i]) : ", " . strval($_args[$i]);

          // Building the sql statement of the function
          $_str_query = "SELECT $_fn_name( $_param_list );";

          // Perform the query
          $_request = pg_query($this->_conn, $_str_query);

//          var_dump($_str_query);
          $_fn_result = 0;
          if ($_request === false) {
               $_fn_result = null;
               //$_error = pg_last_error($this->_conn);
               //$this->RegisterError('Function Error', $_error);
          } else {
               $_fn_result = pg_fetch_result($_request, 0, $_function_name);
               pg_free_result($_request);
          }

          return $_fn_result;
     }

     /**
      * Release the connection to the database
      */
     public function Free() {
          if (!is_null($this->_conn))
               pg_close($this->_conn);

          $this->_conn = null;
     }

     /**
      * @ReturnType DataAccess.Table
      * @ParamType tableName 
      * Get a table from the database
      */
     public function GetTable($tableName) {
          return new PgSQL_Table($tableName, $this->_conn);
     }

     /**
      * Begin a transaction
      */
     public function BeginTransaction() {
          $res = pg_query($this->_conn, 'BEGIN');

          if ($res) return true;
          else return false;
     }

     /**
      * Commit the transaction
      */
     public function Commit() {
          $res = pg_query($this->_conn, 'COMMIT');

          if ($res) return true;
          else return false;
     }

     /**
      * Rollback the transaction
      */
     public function Rollback() {
          $res = pg_query($this->_conn, 'ROLLBACK');

          if ($res) return true;
          else return false;
     }

     /**
      * @ReturnType DataAccess.Selection
      * @Param string SQL statement
      * @Param integer Count of items to select
      * @Param offset Offset of the selection
      * Perform a selection given an SQL statement
      */
     public function Select($statement, $limit = null, $offset = null) {
          $range = "";

          if ($offset != null || $limit != null) {
               $offset = (is_null($offset)) ? 0 : intval($offset);
               $limit = (is_null($limit)) ? 0 : intval($limit);
               $range = "OFFSET $offset LIMIT $limit";
          }

          $statement = "$statement $range;";
          $_result = pg_query($this->_conn, $statement);
          
//          var_dump($statement);
          
          if (!$_result) return null;
          return new PgSQL_Selection($statement, $this->_conn, $_result);
     }

     /**
      * @ReturnType DataAccess.ResultIterator
      * @ParamType statement 
      * Get an iterator from the given SQL statement
      */
     public function GetQueryIterator($statement) {
          $_result = pg_query($this->_conn, $statement);
          if (!$_result) return null;
          $_selection = new PgSQL_Selection($statement, $this->_conn, $_result);
          return new PgSQL_ResultIterator($_selection);
     }
}
?>