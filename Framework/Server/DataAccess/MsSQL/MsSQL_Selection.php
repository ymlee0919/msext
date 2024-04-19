<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/MsSQL/MsSQL_ResultIterator.php');

class MsSQL_Selection extends Selection
{
        protected $_limit = 0;

        protected $_offset = 0;
        /**
	 * @ParamType sqlStatement SQL statement of the query
         * @ParamType connection Data base connection
         * @ParamType resultResource Handler of the resource
	 * Constructor of the class
	 */
	public function __construct($sqlStatement, $connection, $resultResource)
        {
		parent::__construct($sqlStatement, $connection, $resultResource);

                $this->_limit = null;
                $this->_offset = null;
	}

	/**
	 * @ReturnType int
	 * Return the count of rows returned by the query
	 */
	public function GetNumRows()
        {
                $_num_rows = (!is_null($this->_result)) ? mssql_num_rows($this->_result) : -1;
                if(!is_null($this->_limit))
                        return min($_num_rows, $this->_limit);
                return $_num_rows;
	}

        /**
         * @Param offSet OffSet of the selection
         * @Param limit Count of the selection
	 * Set the range of the selection
	 */
        public function SetRange($offSet, $limit)
        {
                $this->_limit = $limit;
                $this->_offset = (is_null($offSet))? 0 : $offSet;
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
                while ($finfo = mssql_fetch_field($this->_result))
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

		mssql_free_result($this->_result);
                $this->_result = null;
	}

	/**
	 * @ReturnType DataAccess.ResultIterator
	 * Return an iterator of the result of the query
	 */
	public function GetIterator()
        {
		return new MsSQL_ResultIterator($this);
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

                $_offset = (!is_null($this->_offset)) ? $this->_offset : 0;

                if(!is_null($this->_limit))
                {
                        if($_limit < $_index)
                                $_index = $_offset + $_limit;
                        else
                                $_index += $_offset;
                }

                settype($_index, 'integer');

                mssql_data_seek($this->_result,$rowIndex);

                $_array = mssql_fetch_array($this->_result, $_index);

                mssql_data_seek($this->_result,0);
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

                if(!is_null($this->_offset))
                        if($this->_offset > 0)
                                mssql_data_seek($this->_result, $this->_offset);

                if(is_null($this->_limit))
                        while($_row = mssql_fetch_array($this->_result))
                                array_push($_matrix, $_row);
                else
                {
                        $_rows_count = $this->_limit;
                        while(($_row = mssql_fetch_array($this->_result)) && $_rows_count-- )
                                array_push($_matrix, $_row);
                }
                
                return $_matrix;
	}
}
?>