<?php

require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
class msExt_RectObj extends msExt_MsObj
{

    /**
     * @access public
     * @param double aMinx
     * @param double aMiny
     * @param double aMaxx
     * @param double aMaxy
     * @ParamType aMinx double
     * @ParamType aMiny double
     * @ParamType aMaxx double
     * @ParamType aMaxy double
     */
    public function __construct($minx = null, $miny = null, $maxx = null, $maxy = null)
    {
        $this->_inner_msObj = new rectObj();
        if(!is_null($minx) && !is_null($miny) && !is_null($maxx) && !is_null($maxy))
            $this->_inner_msObj->setextent($minx, $miny, $maxx, $maxy);
    }

    /**
     * @access public
     * @param double aMinx
     * @param double aMiny
     * @param double aMaxx
     * @param double aMaxy
     * @return void
     * @ParamType aMinx double
     * @ParamType aMiny double
     * @ParamType aMaxx double
     * @ParamType aMaxy double
     * @ReturnType void
     */
    public function SetExtent($minx, $miny, $maxx, $maxy)
    {
        $this->_inner_msObj->setextent($minx, $miny, $maxx, $maxy);
    }

    /**
     * @access public
     * @param int aWidth
     * @param int aHeight
     * @return double
     * @ParamType aWidth int
     * @ParamType aHeight int
     * @ReturnType double
     */
    public function Fit($width, $height)
    {
        $this->_inner_msObj->fit($width, $height);
    }

    /**
     * @access public
     * @param msExt_Projection in
     * @param msExt_Projection out
     * @return int
     * @ReturnType int
     */
    public function Project(msExt_Projection $in, msExt_Projection $out)
    {
        $this->_inner_msObj->project($in, $out);
    }

    /**
     * @access public
     * @return double
     * @ReturnType double
     */
    public function MinX()
    {
        return $this->_inner_msObj->minx;
    }

    /**
     * @access public
     * @return double
     * @ReturnType double
     */
    public function MinY()
    {
        return $this->_inner_msObj->miny;
    }

    /**
     * @access public
     * @return double
     * @ReturnType double
     */
    public function MaxX()
    {
        return $this->_inner_msObj->maxx;
    }

    /**
     * @access public
     * @return int
     * @ReturnType int
     */
    public function MaxY()
    {
        return $this->_inner_msObj->maxy;
    }

}

?>