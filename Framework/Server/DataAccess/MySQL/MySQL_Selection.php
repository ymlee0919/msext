<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/MySQL/MySQL_ResultIterator.php');

class MySQL_Selection extends Selection
{
        /**
	 * @ParamType sqlStatement SQL statement of the query
         * @ParamType connection Data base connection
         * @ParamType resultResource Handler of the resource
	 * Constructor of the class
	 */
	public function __construct($sqlStatement, $connection, $resultResource)
        {
		parent::__construct($sqlStatement, $connection, $resultResource);
	}

	/**
	 * @ReturnType int
	 * Return the count of rows returned by the query
	 */
	public function GetNumRows()
        {
                $_num_rows = (!is_null($this->_result)) ? mysqli_num_rows($this->_result) : -1;
                return $_num_rows;
	}

         /**
         * @ParamType field Name or index of the field
	 * @ReturnType string
	 * Return the type of the field
	 */
        public function GetFieldType($field)
        {
                /*if(is_null($this->_result))
                        return null;

                $_type = '';
                $_index = -1;

                if(is_numeric($field))
                        $_index = $field;
                else
                        $_index = pg_field_num($this->_result, $field);

                settype($_index, 'integer');
                $_type = @pg_field_type($this->_result, $_index);

                return $_type;*/

                // TODO : Implement it
        }

	/**
	 * Get the list of the name of the fields returned by the query
	 */
	public function GetFieldsList()
        {
		if(is_null($this->_result))
                        return null;

                // Build the array to be returned
                $_fields = array();
                // Iteration for each returned field and insert the name of the field
                while ($finfo = mysqli_fetch_field($this->_result))
                        array_push($_fields, $finfo->name);

                return $_fields;
	}

	/**
	 * Release the result of the query
	 */
	public function Free()
        {
                if(is_null($this->_result))
                        return;

		mysqli_free_result($this->_result);
                $this->_result = null;
	}

	/**
	 * @ReturnType DataAccess.ResultIterator
	 * Return an iterator of the result of the query
	 */
	public function GetIterator()
        {
		return new MySQL_ResultIterator($this);
	}

        /**
         * @ParamType rowIndex Index of the row
         * @ReturnType array
	 * Return the a row as an array
	 */
	public function GetRow($rowIndex)
        {
                if(!is_integer($rowIndex))
                        return null;

                $_index = $rowIndex;
                settype($_index, 'integer');

                mysqli_data_seek($this->_result,$rowIndex);

                $_array = mysqli_fetch_array($this->_result, $_index);

                mysqli_data_seek($this->_result,0);
                return $_array;
        }

	/**
	 * Return a matrix with all the rows returned by the query
	 */
	public function GetAll()
        {
                if(is_null($this->_result))
                        return null;

		$_matrix = array();

                while($_row = mysqli_fetch_array($this->_result))
                        array_push($_matrix, $_row);
                
                return $_matrix;
	}
}
?>