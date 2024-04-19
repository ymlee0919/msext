<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 */
class msExt_Point extends msExt_MsObj {

	/**
	 * @access public
	 * @param double x
	 * @param double y
	 * @param double z
	 * @param double m
	 * @ParamType x double
	 * @ParamType y double
	 * @ParamType z double
	 * @ParamType m double
	 */
	public function __construct($x, $y, $z = null, $m = null)
    {
		$this->_inner_msObj = new pointObj();
        if(!is_null($z))
        {
            if(!is_null($m))
                $this->_inner_msObj->setXYZ($x, $y, $z, $m);
            else
                $this->_inner_msObj->setXY($x, $y, $m);
        }
        else
            $this->_inner_msObj->setXY($x, $y);
	}

	/**
	 * @access public
	 * @param msExt_Point p1
	 * @param msExt_Point p2
	 * @return double
	 * @ParamType p1 msExt_Point
	 * @ParamType p2 msExt_Point
	 * @ReturnType double
	 */
	public function DistanceToLine(msExt_Point $p1, msExt_Point $p2)
    {
        return $this->_inner_msObj->distanceToLine($p1->_inner_msObj, $p2->_inner_msObj);
	}

	/**
	 * @access public
	 * @param msExt_Point point
	 * @return double
	 * @ParamType point msExt_Point
	 * @ReturnType double
	 */
	public function DistanceToPoint(msExt_Point $point)
    {
        return $this->_inner_msObj->distanceToPoint($point->_inner_msObj);
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return double
	 * @ParamType shape msExt_Shape
	 * @ReturnType double
	 */
	public function DistanceToShape(msExt_Shape $shape)
    {
        return $this->_inner_msObj->distanceToShape($shape->_inner_msObj);
	}

	/**
	 * @access public
	 * @param msExt_Projection in
	 * @param msExt_Projection out
	 * @return void
	 * @ParamType in 
	 * @ParamType out 
	 * @ReturnType void
	 */
	public function Project(msExt_Projection $in,msExt_Projection  $out)
    {
		$this->_inner_msObj->project($in->GetInnerMsObject(), $out->GetInnerMsObject());
	}

	/**
	 * @access public
	 * @param double x
	 * @param double y
	 * @param double m
	 * @return void
	 * @ParamType x double
	 * @ParamType y double
	 * @ParamType m double
	 * @ReturnType void
	 */
	public function SetXY($x, $y, $m = null)
    {
		if(is_null($m))
            $this->_inner_msObj->setXY($x, $y);
        else
            $this->_inner_msObj->setXY($x, $y, $m);
	}

	/**
	 * @access public
	 * @param double x
	 * @param double y
	 * @param double z
	 * @param double m
	 * @ParamType x double
	 * @ParamType y double
	 * @ParamType z double
	 * @ParamType m double
	 */
	public function SetXYZ($x, $y, $z, $m = null)
    {
        if(is_null($m))
            $this->_inner_msObj->setXYZ($x, $y, $z);
        else
            $this->_inner_msObj->setXYZ($x, $y, $z, $m);
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetX()
    {
		return $this->_inner_msObj->x;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetY()
    {
        return $this->_inner_msObj->y;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetZ()
    {
        return $this->_inner_msObj->z;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetM()
    {
        return $this->_inner_msObj->m;
	}
}
?>