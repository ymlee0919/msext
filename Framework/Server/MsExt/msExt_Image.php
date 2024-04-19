<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
class msExt_Image extends msExt_MsObj {
    /**
     * @access public
     * @param imageObj
     * @return msExt_Image
     * @ParamType imageObj
     * @ReturnType msExt_Image
     */
    public function __construct($imageObj)
    {
        $this->_inner_msObj = $imageObj;
    }
    
	/**
	 * @access public
	 * @param string filename
	 * @param MapObj oMap
	 * @return int
	 * @ParamType filename string
	 * @ParamType oMap MapObj
	 * @ReturnType int
	 */
	public function SaveImage($filename = null, $Map = null)
    {
		if(!is_null($filename))
        {
            if(!is_null($Map))
                return $this->_inner_msObj->saveImage($filename, $Map);
            else
                return $this->_inner_msObj->saveImage($filename);
        }
        else
            return $this->_inner_msObj->saveImage();
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function SaveWebImage()
    {
		return $this->_inner_msObj->saveWebImage();
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
	public function GetHeight() {
		return $this->_inner_msObj->height;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetImagePath() {
		return $this->_inner_msObj->imagePath;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetImageURL() {
		return $this->_inner_msObj->imageURL;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetResolution() {
		return $this->_inner_msObj->resolution;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetResolutionFactor() {
		return $this->_inner_msObj->resolutionfactor;
	}
}
?>