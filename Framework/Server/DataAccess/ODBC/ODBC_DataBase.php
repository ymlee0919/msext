<?php

require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/ODBC/ODBC_Table.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/ODBC/ODBC_Selection.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/ODBC/ODBC_ResultIterator.php');
require_once(realpath(dirname(__FILE__)) . '/../../DataAccess/DataBase.php');

class ODBC_DataBase extends DataBase
{
	/**
	 * @ParamType strConnection 
	 * Constructor of the class
	 */
	public function __construct($connectionParameters)
     {
		parent::__construct($connectionParameters);

                $driver  =  $connectionParameters['driver'];
                $location  =  $connectionParameters['location'];
                $user = $connectionParameters['user'];
                $pass = $connectionParameters['pass'];

                $this->_conn = odbc_connect(sprintf($driver,$location),$user,$pass);
                if($this->_conn === false)
                        $this->_conn = null;
	}

	/**
	 * Execute a function given the parameters
	 */
	public function ExecuteFunction()
        {
                $_args = func_get_args();
                // If the count of arguments is 0, return without execute
                if(count($_args) == 0)
                        return;

                // The name of the function is the first parameter
                $_fn = $_args[0];
                $_fn_name = $_args[0];
                
                // Get the name of the function
                // because it can be "public.foo" or "funct_n"
                $_fn_tokens = explode('.', $_fn_name);
                if(count($_fn_tokens) > 2)
                {
                        $_error = "The name of the function [". $_fn ."] is not valid";
                        $this->RegisterError('Invalid Function Name', $_error);
                        return null;
                }

                // The name of the function is allways the last token
                $_function_name =  $_fn_tokens[count($_fn_tokens) - 1];
                // Build the full function name
                $_fn_name = ( count($_fn_tokens) == 1 ) ? "public." . $_fn_name : "$_fn_name";

                // The rest of the parameters are the parameters of the function
                $_param_list = '';
                for($i = 1; $i < count($_args); $i++)
                        $_param_list .= (strlen($_param_list) == 0) ? strval($_args[$i]) : ", " . strval($_args[$i]);

                // Building the sql statement of the function
                $_str_query = "SELECT $_fn_name( $_param_list );";
                // Perform the query
                $_request = @odbc_exec($this->_conn, $_str_query);

                $_fn_result = 0;
                if($_request === false)
                        return null;

                $_fn_result = odbc_result($_request, 0, $_function_name);
                odbc_free_result($_request);
                
                return $_fn_result;
	}

	/**
	 * Release the connection to the database
	 */
	public function Free()
        {
		if(!is_null($this->_conn))
                        odbc_close($this->_conn);
	}

	/**
	 * @ReturnType DataAccess.Table
	 * @ParamType tableName 
	 * Get a table from the database
	 */
	public function GetTable($tableName)
        {
                return new ODBC_Table($tableName, $this->_conn);
	}

	/**
	 * Begin a transaction
	 */
	public function BeginTransaction()
        {
                $res = odbc_exec($this->_conn,'BEGIN;');

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
		$res = odbc_exec($this->_conn,'COMMIT;');

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
		$res = odbc_exec($this->_conn,'ROLLBACK;');

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
                $_result = odbc_exec($this->_conn, $statement);
                if(!$_result)
                    return null;

                $_selection = new ODBC_Selection($statement, $this->_conn, $_result);
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