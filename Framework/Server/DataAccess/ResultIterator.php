<?php

require_once(realpath(dirname(__FILE__)) . '/../DataAccess/Selection.php');

abstract class ResultIterator
{
	/**
	 * Handler to the result of the query
	 */
	protected $_selection;

        /**
	 * @ParamType Selection Selection object to iterate over it
         * Constructor of the class
	 */
	public function __construct($selectionObj)
        {
		$this->_selection = $selectionObj;
	}

	/**
	 * @ReturnType boolean
	 * Indicate if there are more rows to iterate
	 */
	public abstract function Next();

	/**
	 * Reset the iterator
	 */
	public abstract function Reset();

	/**
	 * @ReturnType array
	 * Get the current row as an array
	 */
	public abstract function GetCurrent();

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