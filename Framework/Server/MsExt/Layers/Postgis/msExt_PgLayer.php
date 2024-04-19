<?php
require_once(realpath(dirname(__FILE__)) . '/../msExt_Layer.php');

/**
 * @access public
 * @package MsExt___LayerControl
 */
class msExt_PgLayer extends msExt_Layer {
	/**
	 * @var msExt_PgBaseLayer
	 */
	protected $_main_layer;
	/**
	 * @var msExt_HighlightLayer
	 */
	protected $_highlight_layer;

    /**
     * @var mapObj
     */
    protected $_map;


    /**
     * @param $layer msExt_BaseLayer
     * @param $map msExt_Map
     */
    public function __construct($layer, $map)
    {
        $this->_main_layer = $layer;
        $this->_map = $map;
        $this->_highlight_layer = null;
    }

	/**
	 * @access public
	 * @param string sld
	 * @ParamType sld string
     * @param string layerName
     * @ParamType layerName string
	 */
	public function applySLD($sld, $layerName = null)
    {
        if(is_null($layerName))
		    $this->_main_layer->GetInnerMsObj()->applySLD($sld);
        else
            $this->_main_layer->GetInnerMsObj()->applySLD($sld, $layerName);
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function generateSLD()
    {
		return $this->_main_layer->GetInnerMsObj()->generateSLD();
	}

	/**
	 * @access public
	 * @param string connection
	 * @ParamType connection string
	 */
	public function setConnection($connection)
    {
        $this->_main_layer->GetInnerMsObj()->connection = $connection;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function getConnection() {
		return $this->connection;
	}

	/**
	 * @access public
	 * @param string data
	 * @ParamType data string
	 */
	public function setData($data) {
		$this->data = $data;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function getData() {
		return $this->data;
	}

    /**
     * @access public
     */
    public function Open()
    {
        $this->_main_layer->Open();
    }

    /**
     * @access public
     */
    public function Close()
    {
        $this->_main_layer->Close();
    }

    /**
     * @access public
     */
    public function Free()
    {
        $this->_main_layer->Free();
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
        return $this->_main_layer->GetClass($index);
    }

    /**
     * @access public
     * @param int index
     * @ParamType index int
     * @return msExt_Class
     */
    public function RemoveClass($index)
    {
        return $this->_main_layer->RemoveClass($index);
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
        return $this->_main_layer->AddClass($className, $visible);
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
        return $this->_main_layer->MoveClassUp($index);
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
        return $this->_main_layer->MoveClassDown($index);
    }

    /**
     * @access public
     * @return string
     * @ReturnType string
     */
    public function GetFilterString()
    {
        return $this->_main_layer->GetFilterString();
    }

    /**
     * @access public
     * @param string filter
     * @ParamType filter string
     */
    public function SetFilter($filter)
    {
        $this->_main_layer->SetFilter($filter);
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
        return $this->_main_layer->GetMetaData($key);
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
        $this->_main_layer->SetMetaData($key, $value);
    }

    /**
     * @access public
     * @param string key
     * @ParamType key string
     */
    public function RemoveMetaData($key)
    {
        $this->_main_layer->RemoveMetaData($key);
    }

    /**
     * @access public
     * @param string wktProjection
     * @ParamType wktProjection string
     */
    public function SetWKTProjection($wktProjection)
    {
        $this->_main_layer->SetWKTProjection($wktProjection);
        if(!is_null($this->_highlight_layer))
            $this->_highlight_layer->SetWKTProjection($wktProjection);
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
        $this->_main_layer->Show();
        if(!is_null($this->_highlight_layer))
            $this->_highlight_layer->Show();
    }

    /**
     * @access public
     */
    public function Hide()
    {
        $this->_main_layer->Hide();
        if(!is_null($this->_highlight_layer))
            $this->_highlight_layer->Hide();
    }

    /**
     * @access public
     * @param string newName
     * @ParamType newName string
     */
    public function Rename($newName)
    {
        $this->_main_layer->SetProperty("name",$newName);
        if(!is_null($this->_highlight_layer))
            $this->_highlight_layer->Rename($newName);
    }


    /**
     * @access public
     * @param string connectionType
     * @ParamType connectionType string
     */
    public function SetConnectionType($connectionType)
    {
        $this->_main_layer->SetConnectionType($connectionType);
        if(!is_null($this->_highlight_layer))
            $this->_highlight_layer->SetConnectionType($connectionType);
    }

    /**
     * @access public
     * @param string projection
     * @ParamType projection string
     */
    public function SetProjection($projection)
    {
        $this->_main_layer->SetProjection($projection);
        if(!is_null($this->_highlight_layer))
            $this->_highlight_layer->SetProjection($projection);
    }

    /**
     * @return mixed
     */
    public function GetInnerMsObj()
    {
        return $this->_main_layer->GetInnerMsObj();
    }


    /**
     * @param $name string
     * @return mixed
     */
    public function __get($name)
    {
        return $this->_main_layer->__get($name);
    }


    /**
     * @access public
     * @return msExt_RectObj
     * @ReturnType msExt_RectObj
     */
    public function GetExtent()
    {
        // TODO: Implement GetExtent() method.
    }

    /**
     * @access public
     * @return bool
     */
    public function isVisible()
    {
        // TODO: Implement isVisible() method.
    }

    /**
     * @access public
     * @param string newName
     * @ParamType newName string
     */
    public function Duplicate($newName)
    {
        // TODO: Implement Duplicate() method.
    }

    /**
     * @access public
     * @return int
     * @ReturnType int
     */
    public function GetType()
    {
        // TODO: Implement GetType() method.
    }

}
?>