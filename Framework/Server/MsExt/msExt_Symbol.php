<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 * @package MsExt___Core
 */
class msExt_Symbol extends msExt_MsObj
{

    /**
     * @access public
     */
    public function __construct($symbol)
    {
        $this->_inner_msObj = $symbol;
    }

    /**
	 * @access public
	 */
	public function Free()
    {
		$this->_inner_msObj->free();
	}

	/**
	 * @access public
	 * @return array
	 * @ReturnType array
	 */
	public function GetPatternArray()
    {
		return $this->_inner_msObj->getPatternArray();
	}

	/**
	 * @access public
	 * @return array
	 * @ReturnType array
	 */
	public function GetPointsArray()
    {
		return $this->_inner_msObj->getPointsArray();
	}

	/**
	 * @access public
	 * @param string path
	 * @ParamType path string
	 */
	public function SetImagePath($path)
    {
		$this->_inner_msObj->setImagePath($path);
	}

	/**
	 * @access public
	 * @param array int
	 * @ParamType int array
	 */
	public function SetPattern(array $int)
    {
		$this->_inner_msObj->setPattern($int);
	}

	/**
	 * @access public
	 * @param array points
	 * @ParamType points array
	 */
	public function SetPoints(array $points)
    {
		$this->_inner_msObj->setPoints($points);
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetAntialias()
    {
		return $this->_inner_msObj->antialias;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetCharacter()
    {
		return $this->_inner_msObj->character;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetFilled()
    {
		return $this->_inner_msObj->filled;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetFont()
    {
		return $this->_inner_msObj->font;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetImagepath()
    {
		return $this->_inner_msObj->imagepath;
	}

	/**
	 * @access public
	 * @return boolean
	 * @ReturnType boolean
	 */
	public function IsInMapfile()
    {
		return $this->_inner_msObj->inmapfile;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetPatternLength()
    {
		return $this->_inner_msObj->patternlength;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetPosition()
    {
		return $this->_inner_msObj->position;
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
	 * @return int
	 * @ReturnType int
	 */
	public function GetNumPoints()
    {
		return $this->_inner_msObj->numpoints;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetSizeX()
    {
		return $this->_inner_msObj->sizex;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetSizeY()
    {
		return $this->_inner_msObj->sizey;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetTransparent()
    {
		return $this->_inner_msObj->transparent;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetTransparentColor()
    {
		return $this->_inner_msObj->transparentcolor;
	}
}
?>