<?php
abstract class Table
{
	/**
	 * @AttributeType resource
	 * Instance or handle of the connection
	 */
	protected $_conn;
        /**
	 * Name of the table
	 */
	protected $tableName;

        /**
	 * @ParamType Name of the table
	 * Constructor of the class
	 */
	public function __construct($tableName, $connection)
        {
		$this->tableName = $tableName;
                $this->_conn = $connection;
	}

	/**
	 * @ParamType valuesList array
	 * @ParamType condition 
	 * Update a table
	 */
	public abstract function Update($valuesList, $condition);

	/**
	 * Insert into the table a list of parameters
	 */
	public abstract function Insert();

	/**
	 * @ParamType values 
	 * Insert an array of the type array[key] = value where key is the name of the column and 'value' is the values of the column
	 */
	public abstract function InsertValues($values);

	/**
	 * @ParamType condition 
	 * Delete the rows of a table by a given SQL where statement
	 */
	public abstract function DeleteWhere($condition);

	/**
	 * Clean the table
	 */
	public abstract function Clean();

	/**
	 * Return the count of rows of the table
	 */
	public abstract function GetRowsCount();

        /**
         * @ReturnType array
	 * Return an array with the name of all fields
	 */
	public abstract function GetFields();

        /**
	 * @ParamType array Array of [key]=>value pair
         * @ReturnType integer
	 * Indicates if a table have in a column 'key' the espacified 'value'
	 */
        public abstract function Contains($Key_Values);

        /**
	 * @Param fieldName Name of the field to retrive
	 * @Param conditions Array of conditions of type [field] => value
	 * @Param OrderBy The name or array of names of the field(s) to order [Optional]
	 * @Param OrderType The way to order ASC | DESC [Optional]
         * @Return mixed Return the requested value
	 * Return the first value of a field of the table given a condition order by other field
	 */
        public abstract function GetValueBy($fieldName, $conditions, $OrderBy = null, $OrderType = null);

        /**
	 * @Param fieldName Name of the field to retrive
	 * @Param whereCondition SQL statement of condition
	 * @Param OrderBy The name or array of names of the field(s) to order [Optional]
	 * @Param OrderType The way to order ASC | DESC [Optional]
         * @Return mixed Return the requested value
	 * Return the first value of a field of the table given a condition order by other field
	 */
        public abstract function GetValueWhere($fieldName, $whereCondition, $OrderBy = null, $OrderType = null);

        /**
	 * @Param fieldName Name of the field to retrive
	 * @Param whereCondition SQL statement of condition
         * @Return mixed Return the requested value
	 * Return the first value of a field of the table given a condition order by the same field
	 */
        public abstract function GetFirstValue($fieldName ,$whereCondition = null);

        /**
	 * @Param fieldName Name of the field to retrive
	 * @Param whereCondition SQL statement of condition
         * @Return mixed Return the requested value
	 * Return the last value of a field of the table given a condition order by the same field
	 */
        public abstract function GetLastValue($fieldName ,$whereCondition = null);

        /**
         * @Return Array
	 * Return all the fields of the table into an array
	 */
	public abstract function GetAll();

        /**
	 * @Param fieldName Name of the field to retrive
	 * @Param whereCondition SQL statement of condition
         * @Return mixed Return the requested value
	 * Return the last value of a field of the table given a condition order by the same field
	 */
        public abstract function GetRange($Limit ,$OffSet = null, $whereCondition = null);

        /**
         * @Return Type string
	 * Return the name of the table
	 */
	public function getTableName()
        {
		return $this->tableName;
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