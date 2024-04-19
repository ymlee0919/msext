<?php
require_once(realpath(dirname(__FILE__)) . '/../msExt_Class.php');
require_once(realpath(dirname(__FILE__)) . '/../msExt_RectObj.php');
require_once(realpath(dirname(__FILE__)) . '/../QueryLayer/msExt_QByPoint.php');
require_once(realpath(dirname(__FILE__)) . '/../QueryLayer/msExt_QByCircle.php');
require_once(realpath(dirname(__FILE__)) . '/../QueryLayer/msExt_QByRect.php');

/**
 * @access public
 * @package MsExt___LayerControl
 */
abstract class msExt_Layer
{
	/**
	 * @access public
	 */
	public abstract function Open();

	/**
	 * @access public
	 */
	public abstract function Close();

	/**
	 * @access public
	 */
	public abstract function Free();

	/**
	 * @access public
	 * @param int index
	 * @return msExt_Class
	 * @ParamType index int
	 * @ReturnType msExt_Class
	 */
	public abstract function GetClass($index);

	/**
	 * @access public
	 * @param int index
	 * @ParamType index int
     * @ReturnType msExt_Class
	 */
	public abstract function RemoveClass($index);

	/**
	 * @access public
	 * @param string className
	 * @param bool visible
	 * @return msExt_Class
	 * @ParamType className string
	 * @ParamType visible bool
	 * @ReturnType msExt_Class
	 */
	public abstract function AddClass($className, $visible);

    /**
     * @access public
     * @param int index
     * @return int
     * @ParamType index int
     * @ReturnType int
     */
	public abstract function MoveClassUp($index);

    /**
     * @access public
     * @param int index
     * @return int
     * @ParamType index int
     * @ReturnType int
     */
	public abstract function MoveClassDown($index);

	/**
	 * @access public
	 * @return msExt_RectObj
	 * @ReturnType msExt_RectObj
	 */
	public abstract function GetExtent();

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public abstract function GetFilterString();

	/**
	 * @access public
	 * @param string filter
	 * @ParamType filter string
	 */
	public abstract function SetFilter($filter);

	/**
	 * @access public
	 * @param string key
	 * @return string
	 * @ParamType key string
	 * @ReturnType string
	 */
	public abstract function GetMetaData($key);

	/**
	 * @access public
	 * @param string key
	 * @param string value
	 * @ParamType key string
	 * @ParamType value string
	 */
	public abstract function SetMetaData($key, $value);

	/**
	 * @access public
	 * @param string key
	 * @ParamType key string
	 */
	public abstract function RemoveMetaData($key);

	/**
	 * @access public
	 * @param string wktProjection
	 * @ParamType wktProjection string
	 */
	public abstract function SetWKTProjection($wktProjection);

	/**
	 * @access public
	 * @param msExt_Point point
	 * @return msExt_QByPoint
	 * @ParamType point msExt_Point
	 * @ReturnType msExt_QByPoint
	 */
	public abstract function QueryByPoint(msExt_Point $point);

	/**
	 * @access public
	 * @param msExt_Point point
	 * @param double radio
	 * @param int selectionType
	 * @return msExt_QByCircle
	 * @ParamType point msExt_Point
	 * @ParamType radio double
	 * @ParamType selectionType int
	 * @ReturnType msExt_QByCircle
	 */
	public abstract function QueryByCircle(msExt_Point $point, $radio, $selectionType);

	/**
	 * @access public
	 * @param msExt_RectObj rect
	 * @return msExt_QByRect
	 * @ParamType rect msExt_RectObj
	 * @ReturnType msExt_QByRect
	 */
	public abstract function QueryByRect(msExt_RectObj $rect);

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return msExt_Shape
	 * @ParamType shape msExt_Shape
	 * @ReturnType msExt_Shape
	 */
	public abstract function QueryByShape(msExt_Shape $shape);

	/**
	 * @access public
	 */
	public abstract function Show();

	/**
	 * @access public
	 */
	public abstract function Hide();

	/**
	 * @access public
     * @return bool
	 */
	public abstract function isVisible();

	/**
	 * @access public
	 * @param string newName
	 * @ParamType newName string
	 */
	public abstract function Rename($newName);

	/**
	 * @access public
	 * @param string newName
	 * @ParamType newName string
	 */
	public abstract function Duplicate($newName);

	/**
	 * @access public
	 * @param string connectionType
	 * @ParamType connectionType string
	 */
	public abstract function SetConnectionType($connectionType);

	/**
	 * @access public
	 * @param string projection
	 * @ParamType projection string
	 */
	public abstract function SetProjection($projection);

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public abstract function GetType();


    /**
     * @return mixed
     */
    public abstract function GetInnerMsObj();


    /**
     * @param $property string The name of the property to set
     * @param $value mixed The value of the property
     */
    public function SetProperty($property, $value)
    {
        if(gettype($value) == 'object')
        {
            $_type = get_class($value);
            if(substr($_type,0,5) == 'msExt')
                $value = $value->GetInnerMsObj();
        }
        $this->GetInnerMsObj()->set($property, $value);
    }

    /**
     * @param $properties array Array of key value properties to set
     */
    public function SetProperties($properties)
    {
        foreach($properties as $property => $value)
            $this->SetProperty($property, $value);
    }


    /**
     * @param $name string
     * @return mixed
     */
    public abstract function __get($name);


}
?>