<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
class msExt_Legend extends msExt_MsObj
{

	/**
	 * @access public
	 * @param legendObj
	 * @return msExt_Legend
	 * @ParamType legendObj 
	 * @ReturnType msExt_Legend
	 */
	public function __construct($legendObj)
    {
		$this->_inner_msObj = $legendObj;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetHeight()
    {
		return $this->_inner_msObj->height;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetWidth() {
		return $this->_inner_msObj->width;
	}

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType MapServerExt.ColorObj
	 */
	public function GetOutlineColor() {
        return new msExt_Color($this->_inner_msObj->outlinecolor);
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetStatus() {
		return $this->_inner_msObj->status;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetPosition() {
		return $this->_inner_msObj->position;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetTransparent() {
		return $this->_inner_msObj->transparent;
	}

	/**
	 * @access public
	 * @return msExt_Label
	 * @ReturnType labelObj
	 */
	public function GetLabel()
    {
		return new msExt_Label($this->_inner_msObj->label);
	}

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetImageColor() {
        return new msExt_Color($this->_inner_msObj->imagecolor);
	}
}
?>