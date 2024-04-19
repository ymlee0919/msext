<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
class msExt_WebObj extends msExt_MsObj {

	/**
	 * @access public
	 * @param webObj
	 * @return msExt_WebObj
	 * @ParamType webObj 
	 * @ReturnType msExt_WebObj
	 */
	public function __construct($webObj)
    {
		$this->_inner_msObj = $webObj;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetImagepath() {
		return $this->_inner_msObj->imagepath;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetImageurl() {
		return $this->_inner_msObj->imageurl;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetEmpty() {
		return $this->_inner_msObj->empty;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetError() {
		return $this->_inner_msObj->error;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMinscaledenom() {
		return $this->_inner_msObj->minscaledenom;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetMaxscaledenom() {
		return $this->_inner_msObj->maxscaledenom;
	}

	/**
	 * @access public
	 * @return RectObj
	 * @ReturnType MapServerExt.RectObj
	 */
	public function GetExtent() {
		return $this->_inner_msObj->extent;
	}

	/**
	 * @access public
	 * @return hashTableObj
	 * @ReturnType hashTableObj
	 */
	public function GetMetadata() {
		return $this->_inner_msObj->metadata;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetLegendformat() {
		return $this->_inner_msObj->legendformat;
	}
}
?>