<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/MsSQL/MsSQL_Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/ResultIterator.php');

class MsSQL_ResultIterator extends ResultIterator
{
        /**
	 * @AttributeType integer
	 * Count of rows returned by the query
	 */
        private $_current_item;
        /**
	 * @AttributeType integer
	 * Count of rows returned by the query
	 */
        private $_current_index;
         /**
	 * @ParamType Selection Selection object to iterate over it
         * Constructor of the class
	 */
	public function __construct($selectionObj)
        {
                parent::__construct($selectionObj);
                $this->_current_index = -1;
                $this->_current_item = null;
                
                mssql_data_seek($this->_result,0);
	}

	/**
	 * @ReturnType boolean
	 * Indicate if there are more rows to iterate
	 */
	public function Next()
        {
                if(is_null($this->_current_item))
                        return false;
                
                $this->_current_index++;
		return ($this->_current_item = mssql_fetch_array($this->_result));
	}

	/**
	 * Reset the iterator
	 */
	public function Reset()
        {
                $this->_current_index = -1;
		mssql_data_seek($this->_result,0);
	}

	/**
	 * @ReturnType array
	 * Get the current row as an array
	 */
	public function GetCurrent()
        {

		if($this->_current_index == -1)
                        return null;

                return $this->_current_item;
	}
}
?>