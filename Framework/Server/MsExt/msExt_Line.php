<?php
/**
 * @access public
 */
class msExt_Line extends msExt_MsObj
{

	/**
	 * @access public
	 * @param array points
	 * @ParamType points array
	 */
	public function __construct(array $points = null)
    {
        $this->_inner_msObj = new lineObj();

        if(!is_null($points))
            foreach($points as $point)
                $this->AddPoint($point);
	}

	/**
	 * @access public
	 * @param msExt_Point point
	 * @return void
	 * @ParamType point msExt_Point
	 * @ReturnType void
	 */
	public function AddPoint(msExt_Point $point)
    {
		$this->_inner_msObj->addPoint($point->_inner_msObj);
	}

	/**
	 * @access public
	 * @param doube x
	 * @param double y
	 * @param double m
	 * @return void
	 * @ParamType x doube
	 * @ParamType y double
	 * @ParamType m double
	 * @ReturnType void
	 */
	public function AddXY(doube $x, $y, $m = null)
    {
        if(is_null($m))
		    $this->_inner_msObj->addXY($x, $y);
        else
            $this->_inner_msObj->addXY($x, $y, $m);
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
	public function AddXYZ($x, $y, $z, $m = null)
    {
        if(is_null($m))
            $this->_inner_msObj->addXY($x, $y, $z);
        else
            $this->_inner_msObj->addXY($x, $y, $z, $m);
	}

	/**
	 * @access public
	 * @param int index
	 * @return msExt_Point
	 * @ParamType index int
	 * @ReturnType msExt_Point
	 */
	public function GetAt($index)
    {
		$_point = $this->_inner_msObj->point($index);
        return new msExt_Point($_point->x, $_point->y, $_point->z, $_point->m);
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetPointsCount()
    {
		return $this->_inner_msObj->numpoints;
	}

	/**
	 * @access public
	 * @param msExt_Projection in
	 * @param msExt_Projection out
	 * @ParamType in
	 * @ParamType in
	 */
	public function Project(msExt_Projection $in, msExt_Projection $out)
    {
		$this->_inner_msObj->project($in->GetInnerMsObject(), $out->GetInnerMsObject());
	}
}
?>