<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/MySQL/MySQL_Table.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/MySQL/MySQL_Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/MySQL/MySQL_ResultIterator.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/DataBase.php');

class MySQL_DataBase extends DataBase
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

                $this->_conn = mysqli_connect($host,$user,$pass, $dbase);

                if($this->_conn === false)
                        $this->_conn = null;
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
                        mysqli_close($this->_conn);
	}

	/**
	 * @ReturnType DataAccess.Table
	 * @ParamType tableName 
	 * Get a table from the database
	 */
	public function GetTable($tableName)
        {
                return new MySQL_Table($tableName, $this->_conn);
	}

	/**
	 * Begin a transaction
	 */
	public function BeginTransaction()
        {
                $res = mysqli_query($this->_conn,'BEGIN');

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
		$res = mysqli_query($this->_conn,'COMMIT');

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
		$res = mysqli_query($this->_conn,'ROLLBACK');

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
                $range = "";
                
                if($offset != null || $limit != null)
                {
                        $offset = (is_null($offset)) ? 0 : intval($offset);
                        $limit = (is_null($limit)) ? 0 : intval($limit);
                        $range = "LIMIT $offset, $limit";
                }

                $statement = "$statement $range";
                $_result = mysqli_query($this->_conn, $statement);
                if(!$_result)
                        return null;

		return new MySQL_Selection($statement, $this->_conn, $_result);
	}

	/**
	 * @ReturnType DataAccess.ResultIterator
	 * @ParamType statement 
	 * Get an iterator from the given SQL statement
	 */
	public function GetQueryIterator($statement)
        {
		$_result = mysqli_query($this->_conn, $statement);
                if(!$_result)
                        return null;
                $_selection = new MySQL_Selection($statement, $this->_conn, $_result);

		return new MySQL_ResultIterator($_selection);
	}
}
?>