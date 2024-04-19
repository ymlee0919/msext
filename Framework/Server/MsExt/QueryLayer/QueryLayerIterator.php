<?php
/**
 * @access public
 */
abstract class msExt_QueryLayerIterator
{
	/**
	 * @var
	 *
	 * Layer for query
	 */
	private $_qlayer;

	/**
	 * @var int
	 *
	 * Count of items as result of the query
	 */
	private $_items_count;

	/**
	 * @var int
	 *
	 * Index of the current iterated item of the query
	 */
	private $_current_item_index;



	/**
	 * @var boolean
     * @AttributeType boolean
	 */
	private $_success;

	/**
	 * 
	 * 
	 * Return the count of results of the query
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetResultCount()
    {
		return $this->_qlayer->getNumResults();
	}

	/**
	 * 
	 * 
	 * Open the layer for iterate
	 * @access public
	 * @return void
	 * @ReturnType void
	 */
	public function Open()
    {
		$this->_qlayer->open();
	}

	/**
	 * 
	 * 
	 * Close the iteration
	 * @access public
	 * @return void
	 * @ReturnType void
	 */
	public function Close()
    {
		$this->_qlayer->Close();
	}

	/**
	 * 
	 * 
	 * Return the current shape of the iteration
	 * @access public
	 * @return shapeObj
	 * @ReturnType shapeObj
	 */
	public function GetCurrentShape()
    {
		return new msExt_Shape($this->_qlayer->getShape($this->_qlayer->getResult($this->_current_item_index)));
	}

	/**
	 * 
	 * 
	 * Get the index of the current shape of the iteration
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetCurrentShapeIndex()
    {
		return $this->_qlayer->getResult($this->_current_item_index);
	}

	/**
	 * 
	 * 
	 * Move the cursor of the iteration to the next shape
	 * @access public
	 * @return bool
	 * @ReturnType bool
	 */
	public function Next()
    {
        if($this->_current_item_index < $this->_items_count)
        {
            $this->_current_item_index++;
            return true;
        }

        return false;
	}

	/**
	 * @access public
	 * @return boolean
	 * @ReturnType boolean
	 */
	public function Success()
    {
		return $this->_success;
	}
}
?>