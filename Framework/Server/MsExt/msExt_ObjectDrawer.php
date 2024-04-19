<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_Color.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
abstract class msExt_ObjectDrawer extends msExt_MsObj
{

	/**
	 * 
	 * 
	 * Set the color to the object
	 * @access public
	 * @param int red
	 * @param int green
	 * @param int blue
	 * @ParamType red int
	 * @ParamType green int
	 * @ParamType blue int
	 */
	public function SetColor($red, $green, $blue)
    {
        $this->_inner_msObj->color->setRGB($red, $green, $blue);
	}

	/**
	 * 
	 * 
	 * Set the color to the object
	 * @access public
	 * @param int red
	 * @param int green
	 * @param int blue
	 * @ParamType red int
	 * @ParamType green int
	 * @ParamType blue int
	 */
	public function SetOutlineColor($red, $green, $blue)
    {
        $this->_inner_msObj->outlinecolor->setRGB($red, $green, $blue);
	}

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetColor()
    {
		return new msExt_Color($this->_inner_msObj->color);
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetOutlineColor()
    {
        return new msExt_Color($this->_inner_msObj->outlinecolor);
	}
}
?>