<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_ObjectDrawer.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
class msExt_Color extends msExt_MsObj
{

	/**
	 * @access public
	 * @param colorObj color
	 * @ParamType color colorObj
	 */
	public function __construct($color)
    {
        $this->_inner_msObj = $color;
	}

	/**
	 * @access public
	 * @param int red
	 * @param int green
	 * @param int blue
	 * @return void
	 * @ParamType red int
	 * @ParamType green int
	 * @ParamType blue int
	 * @ReturnType void
	 */
	public function SetRGB($red, $green, $blue)
    {
		$this->_inner_msObj->setRGB($red, $green, $blue);
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetRed() {
		return $this->_inner_msObj->red;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetGreen() {
		return $this->_inner_msObj->green;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetBlue() {
		return $this->_inner_msObj->blue;
	}
}
?>