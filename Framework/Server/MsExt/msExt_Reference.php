<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_Color.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_RectObj.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 * @package MsExt___Core
 */
class msExt_Reference extends msExt_ObjectDrawer
{
    /**
     * @AttributeType mapObj
     * Instance of the map that the reference belong to
     */
    private $_map;

    public function __construct(msExt_Map $map)
    {
        $this->_map = $map->GetInnerMsObj();
        $this->_inner_msObj = $this->_map->reference;
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
	 * @param string snippet
	 * @ParamType snippet string
	 */
	public function UpdateFromString($snippet)
    {
		$this->_inner_msObj->updateFromString($snippet);
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetHeight()
    {
		return $this->_inner_msObj->height;
	}

	/**
	 * @access public
	 * @return msExt_RectObj
	 * @ReturnType msExt_RectObj
	 */
	public function GetExtent()
    {
		return $this->_inner_msObj->extent;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetImage()
    {
		return $this->_inner_msObj->image;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMarker()
    {
		return $this->_inner_msObj->marker;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetMarkerName()
    {
		return $this->_inner_msObj->markername;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMarkerSize()
    {
		return $this->_inner_msObj->markersize;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMaxBoxSize()
    {
		return $this->_inner_msObj->maxboxsize;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetMinBoxSize()
    {
		return $this->_inner_msObj->minboxsize;
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
}
?>