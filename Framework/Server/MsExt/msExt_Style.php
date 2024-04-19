<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
class msExt_Style extends msExt_ObjectDrawer {

    /**
     * @access public
     * @param styleObj
     * @ParamType styleObj styleObj
     */
    public function __construct($styleObj)
    {
        $this->_inner_msObj = $styleObj;
    }

	/**
	 * @access public
	 * @param stylebinding
	 * @param string value
	 * @return int
	 * @ParamType stylebinding 
	 * @ParamType value string
	 * @ReturnType int
	 */
	public function SetBinding($stylebinding, $value)
    {
		return $this->_inner_msObj->SetBinding($stylebinding, $value);
	}

	/**
	 * @access public
	 * @param stylebinding
	 * @return string
	 * @ParamType stylebinding 
	 * @ReturnType string
	 */
	public function GetBinding($stylebinding)
    {
        return $this->_inner_msObj->GetBinding($stylebinding);
	}

	/**
	 * @access public
	 * @param stylebinding
	 * @return int
	 * @ParamType stylebinding 
	 * @ReturnType int
	 */
	public function RemoveBinding($stylebinding)
    {
        return $this->_inner_msObj->RemoveBinding($stylebinding);
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetSymbol() {
		return $this->_inner_msObj->symbol;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetSymbolName() {
		return $this->_inner_msObj->symbolName;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetSize() {
		return $this->_inner_msObj->size;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMinSize() {
		return $this->_inner_msObj->minSize;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMaxSize() {
		return $this->_inner_msObj->maxSize;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetOffSetX() {
		return $this->_inner_msObj->offSetX;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetOffSetY() {
		return $this->_inner_msObj->offSetY;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetAntialias() {
		return $this->_inner_msObj->antialias;
	}

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetBackgroundColor()
    {
        return new msExt_Color($this->_inner_msObj->backgroundColor);
	}


	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetWidth() {
		return $this->_inner_msObj->width;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMinWidth() {
		return $this->_inner_msObj->minWidth;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMaxWidth() {
		return $this->_inner_msObj->maxWidth;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetAngle() {
		return $this->_inner_msObj->angle;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetAngleItem() {
		return $this->_inner_msObj->angleItem;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetSizeItem() {
		return $this->_inner_msObj->sizeItem;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMaxvalue() {
		return $this->_inner_msObj->maxvalue;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMinvalue() {
		return $this->_inner_msObj->minvalue;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetOpacity() {
		return $this->_inner_msObj->opacity;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetRangeItem() {
		return $this->_inner_msObj->rangeitem;
	}
}
?>