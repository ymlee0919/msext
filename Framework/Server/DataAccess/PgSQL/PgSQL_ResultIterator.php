<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/PgSQL/PgSQL_Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/ResultIterator.php');

class PgSQL_ResultIterator extends ResultIterator
{

     /**
      * @AttributeType integer
      * Count of rows returned by the query
      */
     private $_count;

     /**
      * @AttributeType integer
      * Count of rows returned by the query
      */
     private $_current_index;

     /**
      * @ParamType Selection Selection object to iterate over it
      * Constructor of the class
      */
     public function __construct($selectionObj) {
          parent::__construct($selectionObj);
          $this->_current_index = -1;
          $this->_count = pg_num_rows($this->_selection->getResult());
          if (!$this->_count)
               $this->_count = 0;
     }

     /**
      * @ReturnType boolean
      * Indicate if there are more rows to iterate
      */
     public function Next() {
          $this->_current_index++;
          return ($this->_current_index < $this->_count);
     }

     /**
      * Reset the iterator
      */
     public function Reset() {
          $this->_current_index = -1;
     }

     /**
      * @ReturnType array
      * Get the current row as an array
      */
     public function GetCurrent() {
          if ($this->_current_index < 0 || $this->_current_index >= $this->_count)
               return null;
          return $this->_selection->GetRow($this->_current_index);
     }

}

?>