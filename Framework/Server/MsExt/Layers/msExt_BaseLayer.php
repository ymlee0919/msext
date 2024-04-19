<?php
require_once(realpath(dirname(__FILE__)) . '/../msExt_Class.php');
require_once(realpath(dirname(__FILE__)) . '/../msExt_RectObj.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_Layer.php');

/**
 * @access public
 * @package MsExt___LayerControl
 */
abstract class msExt_BaseLayer extends msExt_Layer
{
    /**
     * @var
     */
    protected $_msLayer;

    /**
     * @var
     */
    protected $_msMap;

    /**
     * @access public
     * @param layerObj layer
     * @param mapObj map
     * @ParamType layerObj layer
     * @ParamType mapObj map
     */
    public function __construct($layer, $map)
    {
        $this->_msLayer = $layer;
        $this->_msMap = $map;
    }


    /**
	 * @access public
	 */
	public function Open()
    {
		$this->_msLayer->open();
	}

	/**
	 * @access public
	 */
	public function Close()
    {
		$this->_msLayer->close();
	}

	/**
	 * @access public
	 */
	public function Free()
    {
		$this->_msLayer->free();
	}

    /**
     * @access public
     * @param int index
     * @return msExt_Class
     * @ParamType index int
     * @ReturnType msExt_Class
     */
    public function GetClass($index)
    {
        if($this->_msLayer->numclasses <= $index)
            return null;
        return new msExt_Class($this->_msLayer->getclass($index));
    }

    /**
     * @access public
     * @param int index
     * @return msExt_Class
     * @ParamType index int
     * @ReturnType msExt_Class
     */
    public function RemoveClass($index)
    {
        if($this->_msLayer->numclasses <= $index)
            return null;
        return new msExt_Class($this->_msLayer->removeClass($index));
    }

    /**
     * @access public
     * @param string className
     * @param bool visible
     * @return msExt_Class
     * @ParamType className string
     * @ParamType visible bool
     * @ReturnType msExt_Class
     */
    public function AddClass($className, $visible)
    {
        $_status = ($visible) ? MS_ON : MS_OFF;

        $_classObj = new classObj($this->_msLayer);
        $_classObj->set('name', $className);
        $_classObj->set('status', $_status);

        return new msExt_Class($_classObj);
    }

    /**
     * @access public
     * @param int index
     * @return int
     * @ParamType index int
     * @ReturnType int
     */
    public function MoveClassUp($index)
    {
        if($this->_msLayer->numclasses <= $index)
            return -1;
        return $this->_msLayer->moveclassup($index);
    }

    /**
     * @access public
     * @param int index
     * @return int
     * @ParamType index int
     * @ReturnType int
     */
    public function MoveClassDown($index)
    {
        if($this->_msLayer->numclasses <= $index)
            return -1;
        return $this->_msLayer->moveclassdown($index);
    }

    /**
     * @access public
     * @return string
     * @ReturnType string
     */
    public function GetFilterString()
    {
        return $this->_msLayer->getFilterString();
    }

    /**
     * @access public
     * @param string key
     * @return string
     * @ParamType key string
     * @ReturnType string
     */
    public function GetMetaData($key)
    {
        return $this->_msLayer->getMetaData($key);
    }

    /**
     * @access public
     * @param string key
     * @param string value
     * @ParamType key string
     * @ParamType value string
     */
    public function SetMetaData($key, $value)
    {
        $this->_msLayer->setMetaData($key, $value);
    }

    /**
     * @access public
     * @param string key
     * @ParamType key string
     */
    public function RemoveMetaData($key)
    {
        $this->_msLayer->removeMetaData($key);
    }

    /**
     * @access public
     * @param string wktProjection
     * @ParamType wktProjection string
     */
    public function SetWKTProjection($wktProjection)
    {
        $this->_msLayer->setWKTProjection($wktProjection);
    }

    /**
     * @access public
     * @param msExt_Point point
     * @return msExt_QByPoint
     * @ParamType point msExt_Point
     * @ReturnType msExt_QByPoint
     */
    public function QueryByPoint(msExt_Point $point)
    {
        // TODO: Implement QueryByPoint() method.
    }

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
    public function QueryByCircle(msExt_Point $point, $radio, $selectionType)
    {
        // TODO: Implement QueryByCircle() method.
    }

    /**
     * @access public
     * @param msExt_RectObj rect
     * @return msExt_QByRect
     * @ParamType rect msExt_RectObj
     * @ReturnType msExt_QByRect
     */
    public function QueryByRect(msExt_RectObj $rect)
    {
        // TODO: Implement QueryByRect() method.
    }

    /**
     * @access public
     * @param msExt_Shape shape
     * @return msExt_Shape
     * @ParamType shape msExt_Shape
     * @ReturnType msExt_Shape
     */
    public function QueryByShape(msExt_Shape $shape)
    {
        // TODO: Implement QueryByShape() method.
    }

    /**
     * @access public
     */
    public function Show()
    {
        $this->_msLayer->set('status', MS_ON);
    }

    /**
     * @access public
     */
    public function Hide()
    {
        $this->_msLayer->set('status', MS_OFF);
    }

    /**
     * @access public
     * @return bool
     */
    public function isVisible()
    {
        return $this->_msLayer->isVisible();
    }

    /**
     * @access public
     * @param string newName
     * @ParamType newName string
     */
    public function Rename($newName)
    {
        $this->_msLayer->set('name', $newName);
    }

    /**
     * @access public
     * @param string connectionType
     * @ParamType connectionType string
     */
    public function SetConnectionType($connectionType)
    {
        $this->_msLayer->setConnectionType($connectionType);
    }

    /**
     * @access public
     * @param string projection
     * @ParamType projection string
     */
    public function SetProjection($projection)
    {
        $this->_msLayer->setProjection($projection);
    }


    /**
     * @return layerObj
     */
    public function GetInnerMsObj()
    {
        return $this->_msLayer;
    }

    /**
     * @param $name string
     * @return mixed
     */
    public function __get($name)
    {
        switch($name)
        {
            case "metadata":
                return new msExt_HashTable($this->_msLayer->metadata);
            case "projection":
                return new msExt_Projection($this->_msLayer->projection);
            default :
                return $this->_msLayer->$name;
        }
    }
}
?>