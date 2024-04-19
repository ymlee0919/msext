<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_Label.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_Image.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
class msExt_Class extends msExt_MsObj
{

    /**
     * @access public
     * @param classObj
     * @ParamType classObj
     */
    public function __construct($classObj)
    {
        $this->_inner_msObj = $classObj;
    }

    /**
     * @param msExt_Style $style
     * @return msExt_Style
     */
    public function AddStyle($style = null)
    {
        $_style = null;
        if(is_null($style))
            $_style = new styleObj($this->_inner_msObj);
        else
            $_style = new styleObj($this->_inner_msObj, $style->GetInnerMsObj());

        return new msExt_Style($_style);
    }

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetExpressionString()
    {
		return $this->_inner_msObj->getExpressionString();
	}

	/**
	 * @access public
	 * @param int index
	 * @return msExt_Label
	 * @ParamType index int
	 * @ReturnType msExt_Label
	 */
	public function GetLabel($index)
    {
		return new msExt_Label($this->_inner_msObj->getLabel($index));
	}

	/**
	 * @access public
	 * @param string name
	 * @return int
	 * @ParamType name string
	 * @ReturnType int
	 */
	public function GetMetaData($name)
    {
		return $this->_inner_msObj->getMetaData($name);
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
	 * @return string
	 * @ReturnType string
	 */
	public function GetTextString()
    {
		return $this->_inner_msObj->getTextString();
	}

	/**
	 * @access public
	 * @param int index
	 * @return int
	 * @ParamType index int
	 * @ReturnType int
	 */
	public function moveStyleDown($index)
    {
		return $this->_inner_msObj->movestyledown($index);
	}

	/**
	 * @access public
	 * @param int index
	 * @return int
	 * @ParamType index int
	 * @ReturnType int
	 */
	public function moveStyleUp($index)
    {
		return $this->_inner_msObj->movestyleup($index);
	}

	/**
	 * @access public
	 * @param int index
	 * @return msExt_Label
	 * @ParamType index int
	 * @ReturnType msExt_Label
	 */
	public function removeLabel($index)
    {
		return new msExt_Label($this->_inner_msObj->removeLabel($index));
	}

	/**
	 * @access public
	 * @param string name
	 * @return int
	 * @ParamType name string
	 * @ReturnType int
	 */
	public function removeMetaData($name)
    {
		return $this->_inner_msObj->removeMetaData($name);
	}

	/**
	 * @access public
	 * @param string expression
	 * @return int
	 * @ParamType expression string
	 * @ReturnType int
	 */
	public function setExpression($expression)
    {
		return $this->_inner_msObj->setExpression($expression);
	}

	/**
	 * @access public
	 * @param string name
	 * @param string value
	 * @return int
	 * @ParamType name string
	 * @ParamType value string
	 * @ReturnType int
	 */
	public function setMetaData($name, $value)
    {
		return $this->_inner_msObj->setMetaData($name, $value);
	}

	/**
	 * @access public
	 * @param string text
	 * @return int
	 * @ParamType text string
	 * @ReturnType int
	 */
	public function setText($text)
    {
		return $this->_inner_msObj->settext($text);
	}

	/**
	 * @access public
	 * @param msExt_Label label
	 * @return int
	 * @ParamType msExt_Label
	 * @ReturnType int
	 */
	public function addLabel($label)
    {
		return $this->_inner_msObj->addLabel($label->getInnerMsObj());
	}

	/**
	 * @access public
	 * @param int width
	 * @param int height
	 * @return msExt_Image
	 * @ParamType width int
	 * @ParamType height int
	 * @ReturnType msExt_Image
	 */
	public function createLegendIcon($width, $height)
    {
		return new msExt_Image($this->_inner_msObj->createLegendIcon($width, $height));
	}

	/**
	 * @access public
	 * @param int index
	 * @return int
	 * @ParamType index int
	 * @ReturnType int
	 */
	public function deleteStyle($index)
    {
		return $this->_inner_msObj->deletestyle($index);
	}

	/**
	 * @access public
	 * @param int width
	 * @param int height
	 * @param msExt_Image im
	 * @param int dstX
	 * @param int dstY
	 * @return int
	 * @ParamType width int
	 * @ParamType height int
	 * @ParamType im msExt_Image
	 * @ParamType dstX int
	 * @ParamType dstY int
	 * @ReturnType int
	 */
	public function drawLegendIcon($width, $height, $im, $dstX, $dstY)
    {
		return $this->_inner_msObj->drawLegendIcon($width, $height, $im->GetInnerMsObj(), $dstX, $dstY);
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetName()
    {
		return $this->_inner_msObj->name;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetTitle()
    {
		return $this->_inner_msObj->title;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetType()
    {
		return $this->_inner_msObj->type;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetStatus()
    {
		return $this->_inner_msObj->status;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMinScaleDenom()
    {
		return $this->_inner_msObj->minscaledenom;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMaxScaleDenom()
    {
		return $this->_inner_msObj->maxscaledenom;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetNumStyles()
    {
		return $this->_inner_msObj->numstyles;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetGroup()
    {
		return $this->_inner_msObj->group;
	}
}
?>