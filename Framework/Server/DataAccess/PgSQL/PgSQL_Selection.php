<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/PgSQL/PgSQL_ResultIterator.php');

class PgSQL_Selection extends Selection {

     /**
      * @ParamType sqlStatement SQL statement of the query
      * @ParamType connection Data base connection
      * @ParamType resultResource Handler of the resource
      * Constructor of the class
      */
     public function __construct($sqlStatement, $connection, $resultResource) {
          parent::__construct($sqlStatement, $connection, $resultResource);
     }

     /**
      * @ReturnType int
      * Return the count of rows returned by the query
      */
     public function GetNumRows() {
          $_num_rows = (!is_null($this->_result)) ? @pg_num_rows($this->_result) : -1;
          return $_num_rows;
     }

     /**
      * @ParamType field Name or index of the field
      * @ReturnType string
      * Return the type of the field
      */
     public function GetFieldType($field) {
          if (is_null($this->_result)) return null;

          $_type = '';
          $_index = -1;

          if (is_integer($field))
               $_index = $field;
          else
               $_index = pg_field_num($this->_result, $field);

          settype($_index, 'integer');
          $_type = pg_field_type($this->_result, $_index);

          return $_type;
     }

     /**
      * Get the list of the name of the fields returned by the query
      */
     public function GetFieldsList() {
          if (is_null($this->_result)) return null;

          // Get the number of fields
          $_fields_count = @pg_num_fields($this->_result);

          $_fields = array();
          $_field_name = '';

          for ($i = 0; $i < $_fields_count; $i++) {
               $_field_name = pg_field_name($this->_result, $i);
               array_push($_fields, $_field_name);
          }

          return $_fields;
     }

     /**
      * Release the result of the query
      */
     public function Free() {
          if (is_null($this->_result)) return;

          pg_free_result($this->_result);
          $this->_result = null;
     }

     /**
      * @ReturnType DataAccess.ResultIterator
      * Return an iterator of the result of the query
      */
     public function GetIterator() {
          return new PgSQL_ResultIterator($this);
     }

     /**
      * @ParamType rowIndex Index of the row
      * @ReturnType array
      * Return the a row as an array
      */
     public function GetRow($rowIndex) {
          if (!is_integer($rowIndex)) return null;

          $_index = $rowIndex;
          settype($_index, 'integer');

          $_array = pg_fetch_array($this->_result, $_index);
          return $_array;
     }

     /**
      * Return a matrix with all the rows returned by the query
      */
     public function GetAll() {
          if (is_null($this->_result))
               return null;

          $_matrix = array();
          $_matrix = pg_fetch_all($this->_result);

          return $_matrix;
     }
}
?>