<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_RectObj.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');

/**
 * @access public
 * @package MsExt___Core
 */
class msExt_Shape extends msExt_MsObj
{

	/**
	 * @access public
	 * @param int geom
	 * @param string wkt_geom
	 * @ParamType geom int
	 * @ParamType wkt_geom string
	 */
	public function __construct($geom, $wkt_geom = null)
    {
        if(is_object($geom))
        {
            $_type = get_class($geom);
            if($_type == "shapeObj")
                $this->_inner_msObj = $geom;
        }
		elseif(!is_null($wkt_geom))
            $this->_inner_msObj = ms_shapeObjFromWkt($wkt_geom);
        else
            $this->_inner_msObj = new shapeObj($geom);
	}

	/**
	 * @access public
	 * @param msExt_Line line
	 * @ParamType line msExt_Line
	 */
	public function AddLine(msExt_Line $line)
    {
		$this->_inner_msObj->add($line->GetInnerMsObj());
	}

	/**
	 * @access public
	 * @return msExt_Shape
	 * @ReturnType msExt_Shape
	 */
	public function Boundary()
    {
		return $this->_inner_msObj->boundary();
	}

	/**
	 * @access public
	 * @param double width
	 * @return msExt_Shape
	 * @ParamType width double
	 * @ReturnType msExt_Shape
	 */
	public function Buffer($width)
    {
		return $this->_inner_msObj->buffer($width);
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return boolean
	 * @ParamType shape msExt_Shape
	 * @ReturnType boolean
	 */
	public function ContainsShape(msExt_Shape $shape)
    {
		return $this->_inner_msObj->containsShape($shape->_inner_msObj);
	}

	/**
	 * @access public
	 * @return msExt_Shape
	 * @ReturnType msExt_Shape
	 */
	public function ConvexHull()
    {
		return $this->_inner_msObj->convexhull();
	}

	/**
	 * @access public
	 * @param msExt_Point point
	 * @return boolean
	 * @ParamType point msExt_Point
	 * @ReturnType boolean
	 */
	public function ContainsPoint(msExt_Point $point)
    {
		return $this->_inner_msObj->contains($point->GetInnerMsObj());
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return boolean
	 * @ParamType shape msExt_Shape
	 * @ReturnType boolean
	 */
	public function Crosses(msExt_Shape $shape)
    {
		return $this->_inner_msObj->crosses($shape->_inner_msObj);
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return msExt_Shape
	 * @ParamType shape msExt_Shape
	 * @ReturnType msExt_Shape
	 */
	public function Difference(msExt_Shape $shape)
    {
		return $this->_inner_msObj->difference($shape->_inner_msObj);
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return boolean
	 * @ParamType shape msExt_Shape
	 * @ReturnType boolean
	 */
	public function Disjoint(msExt_Shape $shape)
    {
		return $this->_inner_msObj->disjoint($shape->_inner_msObj);
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return boolean
	 * @ParamType shape msExt_Shape
	 * @ReturnType boolean
	 */
	public function Equals(msExt_Shape $shape)
    {
		return $this->_inner_msObj->equals($shape->_inner_msObj);
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
	 * @return double
	 * @ReturnType double
	 */
	public function GetArea()
    {
		return $this->_inner_msObj->getArea();
	}


    /**
     * @access public
     * @return double
     * @ReturnType double
     */
    public function GetLength()
    {
        return $this->_inner_msObj->getLength();
    }

	/**
	 * @access public
	 * @return msExt_Point
	 * @ReturnType msExt_Point
	 */
	public function GetCentroid()
    {
		return $this->_inner_msObj->getCentroid();
	}

	/**
	 * @access public
	 * @param msExt_Layer layer
	 * @param string fieldname
	 * @return string
	 * @ParamType layer msExt_Layer
	 * @ParamType fieldname string
	 * @ReturnType string
	 */
	public function GetValue($layer, $fieldname)
    {
        /*
         * Tener en cuenta que layer aun no se esta tratando como un objeto de MsExt
         */
		return $this->_inner_msObj->getValue($layer, $fieldname);
	}

	/**
	 * @access public
	 * @param string fieldname
	 * @return string
	 * @ParamType fieldname string
	 * @ReturnType string
	 */
	public function GetInnerValue($fieldname)
    {
		return $this->_inner_msObj->values[$fieldname];
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return msExt_Shape
	 * @ParamType shape msExt_Shape
	 * @ReturnType msExt_Shape
	 */
	public function Intersection(msExt_Shape $shape)
    {
        $_result_shape = $this->_inner_msObj->intersection($shape->_inner_msObj);
        if(is_null($_result_shape))
            return null;
        return new msExt_Shape($_result_shape->type, $_result_shape->toWkt());
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return boolean
	 * @ParamType shape msExt_Shape
	 * @ReturnType boolean
	 */
	public function Intersects(msExt_Shape $shape)
    {
		return $this->_inner_msObj->intersects($shape->_inner_msObj);
	}

	/**
	 * @access public
	 * @param int index
	 * @return msExt_Line
	 * @ParamType index int
	 * @ReturnType msExt_Line
	 */
	public function GetLine($index)
    {
		$_line = $this->_inner_msObj->line($index);
        return new msExt_Line( array($_line->x, $_line->y, $_line->z, $_line->m) );
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return boolean
	 * @ParamType shape msExt_Shape
	 * @ReturnType boolean
	 */
	public function Overlaps(msExt_Shape $shape)
    {
		return $this->_inner_msObj->overlaps($shape->_inner_msObj);
	}

	/**
	 * @access public
	 * @param msExt_Projection in
	 * @param msExt_Projection out
	 * @return boolean
	 * @ParamType in msExt_Projection
	 * @ParamType out msExt_Projection
	 * @ReturnType boolean
	 */
	public function Project(msExt_Projection $in, msExt_Projection $out)
    {
		$this->_inner_msObj->project($in->GetInnerMsObject(), $out->GetInnerMsObject());
	}

	/**
	 * @access public
	 * @return boolean
	 * @ReturnType boolean
	 */
	public function SetBounds()
    {
		return $this->setBounds();
	}

	/**
	 * @access public
	 * @param double tolerance
	 * @return msExt_Shape
	 * @ParamType tolerance double
	 * @ReturnType msExt_Shape
	 */
	public function Simplify($tolerance)
    {
        $_result_shape = $this->_inner_msObj->simplify($tolerance);
        if(is_null($_result_shape))
            return null;
        return new msExt_Shape($_result_shape->type, $_result_shape->toWkt());
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return msExt_Shape
	 * @ParamType shape msExt_Shape
	 * @ReturnType msExt_Shape
	 */
	public function Symdifference(msExt_Shape $shape)
    {
        $_result_shape = $this->_inner_msObj->symdifference($shape->_inner_msObj);
        if(is_null($_result_shape))
            return null;
        return new msExt_Shape($_result_shape->type, $_result_shape->toWkt());
	}

	/**
	 * @access public
	 * @param double tolerance
	 * @return msExt_Shape
	 * @ParamType tolerance double
	 * @ReturnType msExt_Shape
	 */
	public function TopologySimplifyPreservingSimplify($tolerance)
    {
        $_result_shape = $this->_inner_msObj->topologySimplifyPreservingSimplify($tolerance);
        if(is_null($_result_shape))
            return null;
        return new msExt_Shape($_result_shape->type, $_result_shape->toWkt());
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return boolean
	 * @ParamType shape msExt_Shape
	 * @ReturnType boolean
	 */
	public function Touches(msExt_Shape $shape)
    {
		return $this->_inner_msObj->touches($shape->_inner_msObj);
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function ToWkt()
    {
		return $this->_inner_msObj->toWkt();
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return msExt_Shape
	 * @ParamType shape msExt_Shape
	 * @ReturnType msExt_Shape
	 */
	public function Union(msExt_Shape $shape)
    {
        $_result_shape = $this->_inner_msObj->union($shape->_inner_msObj);
        if(is_null($_result_shape))
            return null;
        return new msExt_Shape($_result_shape->type, $_result_shape->toWkt());
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return boolean
	 * @ParamType shape msExt_Shape
	 * @ReturnType boolean
	 */
	public function Within(msExt_Shape $shape)
    {
		return $this->_inner_msObj->within($shape->_inner_msObj);
	}

	/**
	 * @access public
	 * @return msExt_RectObj
	 * @ReturnType msExt_RectObj
	 */
	public function GetBounds()
    {
        return new msExt_RectObj($this->_inner_msObj->bounds->minx,
            $this->_inner_msObj->bounds->miny,
            $this->_inner_msObj->bounds->maxx,
            $this->_inner_msObj->bounds->maxy);
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetClassIndex()
    {
		return $this->_inner_msObj->classindex;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetIndex()
    {
		return $this->_inner_msObj->index;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetLinesCount()
    {
		return $this->_inner_msObj->numlines;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetValuesCount()
    {
		return $this->_inner_msObj->numvalues;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetTileIndex()
    {
		return $this->_inner_msObj->tileindex;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetText()
    {
		return $this->_inner_msObj->text;
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
	 * @return array
	 * @ReturnType array
	 */
	public function GetValues()
    {
		return $this->_inner_msObj->values;
	}
}
?>