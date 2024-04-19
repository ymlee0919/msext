<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 * @package MsExt___Core
 */
class msExt_Projection
{
	private $_msProjection;

	/**
	 * @access public
	 * @param string str_projection
	 * @ParamType str_projection string
	 */
	public function __construct($str_projection)
    {
		$this->_msProjection = new projectionObj($str_projection);
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetUnits()
    {
		$this->_msProjection->getUnits();
	}

    /**
     * @access public
     */
    public function GetInnerMsObject()
    {
        return $this->_msProjection;
    }

}
?>