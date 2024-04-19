<?php
require_once(realpath(dirname(__FILE__)) . '/../DataAccess/ResultIterator.php');

abstract class Selection
{
	/**
	 * @AttributeType resource
	 * Instance or handle of the connection
	 */
	protected $_conn;
        /**
	 * SQL Statement of the query
	 */
	protected $_sql_statement;
	/**
	 * Handler to the result of the query execution
	 */
	protected $_result;
        /**
	 * Offset of the query statement
	 */
        protected $_offset;
        /**
	 * Count of items to retrive
	 */
        protected $_limit;

        /**
	 * @ParamType sqlStatement SQL statement of the query
         * @ParamType connection Data base connection
         * @ParamType resultResource Handler of the resource
	 * Constructor of the class
	 */
	public function __construct($sqlStatement, $connection, $resultResource)
        {
		$this->_sql_statement = $sqlStatement;
                $this->_conn = $connection;
                $this->_result = $resultResource;
	}

	/**
	 * @ReturnType int
	 * Return the count of rows returned by the query
	 */
	public abstract function GetNumRows();

        /**
         * @ParamType field Name or index of the field
	 * @ReturnType string
	 * Return the type of the field
	 */
	public abstract function GetFieldType($field);

	/**
	 * Get the list of the name of the fields returned by the query
	 */
	public abstract function GetFieldsList();

	/**
	 * Release the result of the query
	 */
	public abstract function Free();

	/**
	 * @ReturnType DataAccess.ResultIterator
	 * Return an iterator of the result of the query
	 */
	public abstract function GetIterator();

        /**
         * @ParamType rowIndex Index of the row
         * @ReturnType array
	 * Return the a row as an array
	 */
	public abstract function GetRow($rowIndex);

	/**
	 * Return a matrix with all the rows returned by the query
	 */
	public abstract function GetAll();

        /**
         * @ReturnType string
	 * Return the sql statement of the query
	 */
	public function getSqlStatement()
        {
		return $this->_sql_statement;
	}

        /**
         * @ReturnType result
	 * Return the handle of the result of the query
	 */
	public function getResult()
        {
		return $this->_result;
	}

        /**
	 * @ParamType string errorType
         * @ParamType string description
	 * Registen an error
	 */
        protected function RegisterError($errorType, $description)
        {
                ErrorManager::RegisterError($errorType, $description);
        }
}
?>