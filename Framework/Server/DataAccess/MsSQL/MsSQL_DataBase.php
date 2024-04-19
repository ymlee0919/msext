<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/MsSQL/MsSQL_Table.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/MsSQL/MsSQL_Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/MsSQL/MsSQL_ResultIterator.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/DataBase.php');

class MsSQL_DataBase extends DataBase
{
	/**
	 * @ParamType strConnection 
	 * Constructor of the class
	 */
	public function __construct($connectionParameters)
        {
		parent::__construct($connectionParameters);

                $host = $connectionParameters['host'];
                $user = $connectionParameters['user'];
                $pass = $connectionParameters['pass'];
                $dbase = $connectionParameters['dbase'];

                $this->_conn = mssql_connect($host,$user,$pass);

                if($this->_conn === false)
                        $this->_conn = null;
                else
                   mssql_select_db($dbase,$this->_conn);
	}

	/**
	 * Execute a function given the parameters
	 */
	public function ExecuteFunction()
        {
                $_fn_result = null;
                
                return $_fn_result;
	}

	/**
	 * Release the connection to the database
	 */
	public function Free()
        {
		if(!is_null($this->_conn))
                        mssql_close($this->_conn);
	}

	/**
	 * @ReturnType DataAccess.Table
	 * @ParamType tableName 
	 * Get a table from the database
	 */
	public function GetTable($tableName)
        {
                return new MsSQL_Table($tableName, $this->_conn);
	}

	/**
	 * Begin a transaction
	 */
	public function BeginTransaction()
        {
                $res = mssql_query($this->_conn,'BEGIN');

                if($res)
                        return true;
                else
                        return false;
	}

	/**
	 * Commit the transaction
	 */
	public function Commit()
     {
		$res = mssql_query($this->_conn,'COMMIT');

                if($res)
                        return true;
                else
                        return false;
	}

	/**
	 * Rollback the transaction
	 */
	public function Rollback()
     {
		$res = mssql_query($this->_conn,'ROLLBACK');

                if($res)
                        return true;
                else
                        return false;
	}

	/**
	 * @ReturnType DataAccess.Selection
	 * @ParamType statement 
	 * Perform a selection given an SQL statement
	 */
	public function Select($statement, $limit = null, $offset = null)
     {
                $_result = mssql_query($statement, $this->_conn);
                if(!$_result)
                        return null;
                $_selection  = new MsSQL_Selection($statement, $this->_conn, $_result);
                $_selection->SetRange($offset, $limit);
                
		return $_selection;
	}

	/**
	 * @ReturnType DataAccess.ResultIterator
	 * @ParamType statement 
	 * Get an iterator from the given SQL statement
	 */
	public function GetQueryIterator($statement)
        {
		// Not yet implemented
	}
}
?>