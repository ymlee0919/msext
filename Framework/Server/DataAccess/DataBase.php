<?php
require_once(realpath(dirname(__FILE__)) . '/../DataAccess/Table.php');
require_once(realpath(dirname(__FILE__)) . '/../DataAccess/Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../DataAccess/ResultIterator.php');

//require_once(realpath(dirname(__FILE__)) . '/../ServerManagement/ErrorManager.php');

abstract class DataBase
{
	/**
	 * @AttributeType string
	 * Connection string
	 */
	protected $_connection_params;
	/**
	 * @AttributeType resource
	 * Instance or handle of the connection
	 */
	protected $_conn;
        /**
	 * @AttributeType Array
	 * Array that register errors
	 */
        protected $_error_list;

	/**
	 * @ParamType array connectionParameters
	 * Constructor of the class
	 */
	public function __construct($connectionParameters)
        {
		$this->_connection_params = $connectionParameters;
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

	/**
	 * Execute a function given the parameters
	 */
	public abstract function ExecuteFunction();

	/**
	 * Release the connection to the database
	 */
	public abstract function Free();


    /**
     * @param $tableName String Name of the table
     * @return Table
     */
    public abstract function GetTable($tableName);

	/**
	 * Begin a transaction
	 */
	public abstract function BeginTransaction();

	/**
	 * Commit the transaction
	 */
	public abstract function Commit();

    public abstract function SetClientEncoding($Encoding);

	/**
	 * Rollback the transaction
	 */
	public abstract function Rollback();


    /**
     * @param $statement String Statement of selection
     * @param null $limit int Count of items to select
     * @param null $offset int Offset to return
     * @return Selection
     */
    public abstract function Select($statement, $limit = null, $offset = null);


    /**
     * @param $statement String Selection statement to iterate
     * @return mixed
     */
    public abstract function GetQueryIterator($statement);
}
?>