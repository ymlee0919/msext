<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
class msExt_ScaleBar extends msExt_MsObj
{
    /**
     * @param $scaleBarObj
     */
    public function __construct($scaleBarObj)
    {
		$this->_inner_msObj = $scaleBarObj;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetHeight() {
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
	 * @return int
	 * @ReturnType int
	 */
	public function GetStyle() {
		return $this->_inner_msObj->style;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetIntervals() {
		return $this->_inner_msObj->intervals;
	}

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetColor() {
		return new msExt_Color($this->_inner_msObj->color);
	}


    /**
     * @param $r int Red component of the color
     * @param $g int Green component of the color
     * @param $b int Blue component of the color
     */
    public function SetColor($r, $g, $b) {
        $this->_inner_msObj->color->setRGB($r, $g, $b);
    }

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetBackgroundColor() {
        return new msExt_Color($this->_inner_msObj->backgroundcolor);
	}

    /**
     * @param $r int Red component of the color
     * @param $g int Green component of the color
     * @param $b int Blue component of the color
     */
    public function SetBackgroundColor($r, $g, $b) {
        $this->_inner_msObj->backgroundcolor->setRGB($r, $g, $b);
    }

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetOutlineColor() {
        return new msExt_Color($this->_inner_msObj->outlineColor);
	}

    /**
     * @param $r int Red component of the color
     * @param $g int Green component of the color
     * @param $b int Blue component of the color
     */
    public function SetOutlineColor($r, $g, $b) {
        $this->_inner_msObj->outlinecolor->setRGB($r, $g, $b);
    }

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetUnits() {
		return $this->_inner_msObj->units;
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
	 * @return bool
	 * @ReturnType bool
	 */
	public function IsTransparent()
    {
        $_image_color = $this->_inner_msObj->imagecolor;
        return ($_image_color->red == -1 && $_image_color->green == -1 &&  $_image_color->blue == -1);
	}

	/**
	 * @access public
	 * @return msExt_Label
	 * @ReturnType msExt_Label
	 */
	public function GetLabel() {
		return new msExt_Label($this->label);
	}

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetImageColor() {
        return new msExt_Color($this->_inner_msObj->imagecolor);
	}

    /**
     * @param $r int Red component of the color
     * @param $g int Green component of the color
     * @param $b int Blue component of the color
     */
    public function SetImageColor($r, $g, $b) {
        $this->_inner_msObj->imagecolor->setRGB($r, $g, $b);
    }

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetAlign() {
		return $this->_inner_msObj->align;
	}
}
?>