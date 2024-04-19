<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_Color.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_Style.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 * @package MsExt___Core
 */
class msExt_Label extends msExt_MsObj
{
	/**
	 * @access public
	 * @param labelObj labelObj
	 * @ParamType labelObj labelObj
	 */
	public function __construct($labelObj)
    {
		$this->_inner_msObj = $labelObj;
	}

	/**
	 * @access public
	 * @param int index
	 * @return int
	 * @ParamType index int
	 * @ReturnType int
	 */
	public function DeleteStyle($index)
    {
		$this->_inner_msObj->deleteStyle($index);
	}

	/**
	 * @access public
	 * @return void
	 * @ReturnType void
	 */
	public function Free()
    {
        $this->_inner_msObj->free();
	}

	/**
	 * @access public
	 * @param int labelbinding
	 * @return string
	 * @ParamType labelbinding int
	 * @ReturnType string
	 */
	public function GetBinding($labelbinding)
    {
		 return $this->_inner_msObj->getBinding($labelbinding);
	}

	/**
	 * @access public
	 * @param int index
	 * @return msExt_Style
	 * @ParamType index int
	 * @ReturnType msExt_Style
	 */
	public function GetStyle($index)
    {
        return new msExt_Style($this->_inner_msObj->getStyle($index));
	}

	/**
	 * @access public
	 * @param int index
	 * @return int
	 * @ParamType index int
	 * @ReturnType int
	 */
	public function MoveStyleDown($index)
    {
		return $this->_inner_msObj->moveStyleDown($index);
	}

	/**
	 * @access public
	 * @param int index
	 * @return int
	 * @ParamType index int
	 * @ReturnType int
	 */
	public function MoveStyleUp($index)
    {
        return $this->_inner_msObj->moveStyleUp($index);
	}

	/**
	 * @access public
	 * @param labelbinding
	 * @return int
	 * @ParamType labelbinding
	 * @ReturnType int
	 */
	public function RemoveBinding($labelbinding)
    {
		return $this->_inner_msObj->removeBinding($labelbinding);
	}

    /**
     * @access public
     * @param labelbinding
     * @param string value
     * @return int
     * @ParamType labelbinding
     * @ParamType value string
     * @ReturnType int
     */
    public function SetBinding($labelbinding, $value)
    {
        return $this->_inner_msObj->setBinding($labelbinding, $value);
    }

	/**
	 * @access public
	 * @param string snippet
	 * @return int
	 * @ParamType snippet string
	 * @ReturnType int
	 */
	public function UpdateFromString($snippet)
    {
		return $this->_inner_msObj->updateFromString($snippet);
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetAlign() {
		return $this->_inner_msObj->align;
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
	 * @return int
	 * @ReturnType int
	 */
	public function GetAngleMode() {
		return $this->_inner_msObj->anglemode;
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
	 * @return int
	 * @ReturnType int
	 */
	public function GetAutoMinFeatureSize() {
		return $this->_inner_msObj->autominfeaturesize;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetBuffer() {
		return $this->_inner_msObj->buffer;
	}

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetColor() {
		return $this->_inner_msObj->color;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetEncoding() {
		return $this->_inner_msObj->encoding;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetFont() {
		return $this->_inner_msObj->font;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetForce() {
		return $this->_inner_msObj->force;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMaxLength() {
		return $this->_inner_msObj->maxlength;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMaxSize() {
		return $this->_inner_msObj->maxsize;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMinDistance() {
		return $this->_inner_msObj->mindistance;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMinFeatureSize() {
		return $this->_inner_msObj->minfeaturesize;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMinLength() {
		return $this->_inner_msObj->minlength;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMinSize() {
		return $this->_inner_msObj->minsize;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetNumStyles() {
		return $this->_inner_msObj->numstyles;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetOffSetX() {
		return $this->_inner_msObj->offsetx;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetOffSetY() {
		return $this->_inner_msObj->offsety;
	}

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetOutlineColor() {
		return $this->_inner_msObj->outlinecolor;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetOutlineWidth() {
		return $this->_inner_msObj->outlinewidth;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetPartials() {
		return $this->_inner_msObj->partials;
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
	public function GetPriority() {
		return $this->_inner_msObj->priority;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetRepeatDistance() {
		return $this->_inner_msObj->repeatdistance;
	}

	/**
	 * @access public
	 * @return msExt_Color
	 * @ReturnType msExt_Color
	 */
	public function GetShadowColor() {
		return $this->_inner_msObj->shadowcolor;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetShadowSizeX() {
		return $this->_inner_msObj->shadowsizex;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetShadowSizeY() {
		return $this->_inner_msObj->shadowsizey;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetSize() {
		return $this->_inner_msObj->size;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetWrap() {
		return $this->_inner_msObj->wrap;
	}
}
?>