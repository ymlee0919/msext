<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/Table.php');

class PgSQL_Table extends Table {

     /**
      * @ParamType Name of the table
      * Constructor of the class
      */
     public function __construct($tableName, $connection) {
          parent::__construct($tableName, $connection);
     }

     /**
      * @ParamType valuesList array
      * @ParamType condition 
      * Update a table
      */
     public function Update($valuesList, $condition) {
          // Get the columns to update
          $_cols = array_keys($valuesList);
          // Get the values 
          $_values = array_values($valuesList);

          // Build the asigment statement
          $_tokens = array();
          for ($i = 0; $i < count($valuesList); $i++)
               array_push($_tokens, $_cols[$i] . ' = ' . $_values[$i]);
          $_asign_statement = implode(', ', $_tokens);

          // Build the condition statement
          $_where_statement = ($condition) ? " WHERE " . $condition : '';

          // Build sql statement
          $_sql_statement = 'UPDATE ' . $this->tableName . ' SET ' . $_asign_statement . $_where_statement;
//         echo "$_sql_statement<br>\n";

          $_request = pg_query($this->_conn, $_sql_statement);

          $_result = 0;
          if ($_request === false)
               return -1;

          $_result = pg_affected_rows($_request);
          pg_free_result($_request);

          return $_result;
     }

     /**
      * Insert into the table a list of parameters
      */
     public function Insert() {
          // Get the arguments of the insertion
          $_args = func_get_args();
          // Join the argument by a coma
          $_str_agrs_list = implode(', ', $_args);
          // Build the sql statement
          $_sql_statement = "INSERT INTO " . $this->tableName . " VALUES( " . $_str_agrs_list . ");";

          // Perform the insertion
          $_request = pg_query($this->_conn, $_sql_statement);

          if ($_request === false)
               return -1;

          $_result = pg_affected_rows($_request);
          pg_free_result($_request);

          return $_result;
     }

     /**
      * @ParamType values 
      * Insert an array of the type array[key] = value where:
      * 'key' is the name of the column and
      * 'value' is the values of the column
      */
     public function InsertValues($values) {
          // Get the names of the columns
          $_cols = array_keys($values);
          // Get the values of each column to insert
          $_vals = array_values($values);

          // Build the string of the list of columns
          $_str_columns_list = implode(', ', $_cols);
          // Build the string of the list of values
          $_str_values_list = implode(', ', $_vals);
          // Build the sql statement
          $_sql_statement = "INSERT INTO " . $this->tableName . "( " . $_str_columns_list . " ) VALUES( " . $_str_values_list . ");";

//         echo "$_sql_statement<br>\n";
//          var_dump($_sql_statement);
          // Perform the insertion
          $_request = pg_query($this->_conn, $_sql_statement);

          if ($_request === false)
               return -1;

          $_result = pg_affected_rows($_request);
          pg_free_result($_request);

          return $_result;
     }

     /**
      * @ParamType condition 
      * Delete the rows of a table by a given SQL where statement
      */
     public function DeleteWhere($condition) {
          $_sql_statement = "DELETE FROM " . $this->tableName . " WHERE " . $condition . ";";

          // Perform the delete action
          $_request = pg_query($this->_conn, $_sql_statement);

          if ($_request === false)
               return -1;

          $_result = pg_affected_rows($_request);
          pg_free_result($_request);

          return $_result;
     }

     /**
      * Clean the table
      */
     public function Clean() {
          $_sql_statement = "DELETE FROM " . $this->tableName . ";";

          // Perform the delete action
          $_request = pg_query($this->_conn, $_sql_statement);

          $_result = 0;
          if ($_request === false)
               return -1;

          $_result = pg_affected_rows($_request);
          pg_free_result($_request);

          return $_result;
     }

     /**
      * Return the count of rows of the table
      */
     public function GetRowsCount($whereCondition = null) {
          $_condition = (is_null($whereCondition)) ? '' : " WHERE $whereCondition";
          $_sql_query = "SELECT count(*) as rows_count FROM " . $this->tableName . " $_condition;";

          // Perform the delete action
          $_request = pg_query($this->_conn, $_sql_query);

          $_result = 0;
          if ($_request === false)
               return -1;

          $_result = pg_fetch_result($_request, 0, 'rows_count');
          settype($_result, 'integer');

          pg_free_result($_request);

          return $_result;
     }

     public function GetFields() {
          // Query to find the fields of the table
          $_str_query = "SELECT * FROM $this->tableName LIMIT 1;";

          $_request = pg_query($this->_conn, $_str_query);
          if ($_request === false)
               return null;

          // Build the array to be returned
          $_fields = array();
          // Get the count of tuples returned
          $_fields_count = pg_num_fields($_request);
          // Iteration for each returned row
          for ($i = 0; $i < $_fields_count; $i++) {
               $_col_name = pg_field_name($_request, $i);
               array_push($_fields, $_col_name);
          }

          pg_free_result($_request);
          return $_fields;
     }

     public function Contains($Key_Values) {
          // Create the array of conditions
          $_conditions = array();
          foreach ($Key_Values as $key => $value)
               array_push($_conditions, "$key = $value");
          // Create the where statement
          $_where_statement = implode(' AND ', $_conditions);

          $_str_query = "SELECT COUNT(*) as items_count FROM " . $this->tableName . " WHERE " . $_where_statement;

//          echo $_str_query . "<br>";
          // Perform the query
          $_request = pg_query($this->_conn, $_str_query);

          $_result = 0;
          if ($_request === false)
               return -1;

          $_obj_result = pg_fetch_object($_request);
          $_result = $_obj_result->items_count;
          settype($_result, 'integer');

          pg_free_result($_request);

          return $_result;
     }

     /**
      * @Param fieldName Name of the field to retrive
      * @Param conditions Array of conditions of type [field] => value
      * @Param OrderBy The name or array of names of the field(s) to order [Optional]
      * @Param OrderType The way to order ASC | DESC [Optional]
      * @Return mixed Return the requested value
      * Return the first value of a field of the table given a condition order by other field
      */
     public function GetValueBy($fieldName, $conditions, $OrderBy = null, $OrderType = null) {
          // Build the condition statement
          $_condition_statement = "";
          // Build the array with conditions
          $_conditions_array = array();
          foreach ($conditions as $key => $value) {
               $_statement = "$key = $value";
               array_push($_conditions_array, $_statement);
          }

          $_condition_statement = implode(" AND ", $_conditions_array);

          // Build the sorter criterion
          $_order_statement = "";

          if (!is_null($OrderBy)) {
               // If the order criterion is an array, then it's elements
               // are join by coma
               $_order_statement = "ORDER BY " . ( (is_array($OrderBy)) ? implode(', ', $OrderBy) : $OrderBy );

               if (!is_null($OrderType))
                    $_order_statement .= $OrderType;
          }

          // Build the SQL statement
          $_table = $this->tableName;
          $_sql_statement = "SELECT $fieldName FROM  $_table WHERE $_condition_statement $_order_statement LIMIT 1";
          $_request = pg_query($this->_conn, $_sql_statement);
          if (!$_request) return null;
          if(pg_num_rows($_request) == 0){
               pg_free_result($_request);
               return null;
          }

          $_result = pg_fetch_result($_request, 0, $fieldName);
          pg_free_result($_request);
          return $_result;
     }

     /**
      * @Param fieldName Name of the field to retrive
      * @Param whereCondition SQL statement of condition
      * @Param OrderBy The name or array of names of the field(s) to order [Optional]
      * @Param OrderType The way to order ASC | DESC [Optional]
      * @Return mixed Return the requested value
      * Return the first value of a field of the table given a condition order by other field
      */
     public function GetValueWhere($fieldName, $whereCondition, $OrderBy = null, $OrderType = null) {
          // Build the sorter criterion
          $_order_statement = "";

          if (!is_null($OrderBy)) {
               // If the order criterion is an array, then it's elements
               // are join by coma
               $_order_statement = "ORDER BY " . ( (is_array($OrderBy)) ? implode(', ', $OrderBy) : $OrderBy );

               if (!is_null($OrderType))
                    $_order_statement .= $OrderType;
          }

          // Build the SQL statement
          $_table = $this->tableName;
          $_str_query = "SELECT $fieldName FROM  $_table WHERE $whereCondition $_order_statement LIMIT 1";
          
//          var_dump($_str_query);
          
          $_request = pg_query($this->_conn, $_str_query);
          if (!$_request) return null;
          if(pg_num_rows($_request) == 0){
               pg_free_result($_request);
               return null;
          }

          $_result = pg_fetch_result($_request, 0, $fieldName);
          pg_free_result($_request);
          return $_result;
     }

     /**
      * @Param fieldName Name of the field to retrive
      * @Param whereCondition SQL statement of condition
      * @Return mixed Return the requested value
      * Return the first value of a field of the table given a condition order by the same field
      */
     public function GetFirstValue($fieldName, $whereCondition = null) {
          // Build the where statement
          $_where_statement = (!is_null($whereCondition)) ? "WHERE $whereCondition" : "";
          // Build the order statement
          $_order_statement = "ORDER BY $fieldName ASC";
          // Build the query
          $_table = $this->tableName;
          $_str_query = "SELECT $fieldName FROM $_table $_where_statement $_order_statement LIMIT 1;";

          $_request = pg_query($this->_conn, $_str_query);
          if (!$_request) return null;
          if(pg_num_rows($_request) == 0){
               pg_free_result($_request);
               return null;
          }

          $_result = pg_fetch_result($_request, 0, $fieldName);
          pg_free_result($_request);
          return $_result;
     }

     /**
      * @Param fieldName Name of the field to retrive
      * @Param whereCondition SQL statement of condition
      * @Return mixed Return the requested value
      * Return the last value of a field of the table given a condition order by the same field
      */
     public function GetLastValue($fieldName, $whereCondition = null) {
          // Build the where statement
          $_where_statement = (!is_null($whereCondition)) ? "WHERE $whereCondition" : "";
          // Build the order statement
          $_order_statement = "ORDER BY $fieldName DESC";
          // Build the query
          $_table = $this->tableName;
          $_str_query = "SELECT $fieldName FROM $_table $_where_statement $_order_statement LIMIT 1;";

          $_request = pg_query($this->_conn, $_str_query);
          if (!$_request) return null;
          if(pg_num_rows($_request) == 0){
               pg_free_result($_request);
               return null;
          }

          $_result = pg_fetch_result($_request, 0, $fieldName);
          pg_free_result($_request);
          return $_result;
     }

     /**
      * @Return Array
      * Return all the fields of the table into an array
      */
     public function GetAll($whereCondition = null, $orderBy = null) {
          // Build the where statement
          $_where_statement = (!is_null($whereCondition)) ? "WHERE $whereCondition" : "";
          // Build the order by statement
          $orderBy = (!is_null($orderBy)) ? "ORDER BY $orderBy" : "";
          // Build the query
          $_table = $this->tableName;
          $_str_query = "SELECT * FROM $_table $_where_statement $orderBy;";
          
//          var_dump($_str_query);

          $_request = pg_query($this->_conn, $_str_query);
          if (!$_request)
               return null;

          $_result = pg_fetch_all($_request);
          return $_result;
     }

     /**
      * @Param fieldName Name of the field to retrive
      * @Param whereCondition SQL statement of condition
      * @Return mixed Return the requested value
      * Return the last value of a field of the table given a condition order by the same field
      */
     public function GetRange($Limit, $OffSet = null, $whereCondition = null, $orderBy = null) {
          // Build the where statement
          $_where_statement = (!is_null($whereCondition)) ? "WHERE $whereCondition" : "";
          // Build the order by statement
          $orderBy = (!is_null($orderBy)) ? "ORDER BY $orderBy" : "";
          // Build the limit statement
          $_limit_statement = (!is_null($OffSet)) ? "OFFSET $OffSet LIMIT $Limit" : "LIMIT $Limit";
          // Build the query
          $_table = $this->tableName;
          $_str_query = "SELECT * FROM $_table $_where_statement $orderBy $_limit_statement ;"; 
          
//          var_dump($_str_query);

          $_request = pg_query($this->_conn, $_str_query);
          if (!$_request)
               return null;

          $_result = pg_fetch_all($_request);
          return $_result;
     }

}

?>