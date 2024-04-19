<?php
//------------------------------------------------------------------------------------
// INCLUDE BASE CLASS FOR LAYERS
require_once(realpath(dirname(__FILE__)) . '/Layers/msExt_Layer.php');
require_once(realpath(dirname(__FILE__)) . '/Layers/msExt_BaseLayer.php');
require_once(realpath(dirname(__FILE__)) . '/Layers/msExt_HighlightLayer.php');
require_once(realpath(dirname(__FILE__)) . '/Layers/msExt_VectorLayer.php');
require_once(realpath(dirname(__FILE__)) . '/Layers/msExt_RasterLayer.php');

//------------------------------------------------------------------------------------
// INCLUDE LAYERS DEFINITIONS
//------------------------------------------------------------------------------------
// Postgis Layers
require_once(realpath(dirname(__FILE__)) . '/Layers/Postgis/msExt_PgBaseLayer.php');
require_once(realpath(dirname(__FILE__)) . '/Layers/Postgis/msExt_PgLayer.php');
//------------------------------------------------------------------------------------
// Custom Layers
require_once(realpath(dirname(__FILE__)) . '/Layers/Custom/msExt_CustomBaseLayer.php');
require_once(realpath(dirname(__FILE__)) . '/Layers/Custom/msExt_CustomLayer.php');
/**
 * @access public
 */
class msExt_LayerController {
	/**
	 * @AttributeType mapObj
	 * 
	 * 
	 * Map
	 */
	private $_map;
	/**
	 * @AttributeType array
	 * 
	 * 
	 * Array of layer drawing order
	 */
	private $_drawing_order;
	/**
	 * @AttributeType array
	 * 
	 * 
	 * Array to order the layers
	 */
	private $_layers_order;

    /**
     * @var msExt_LayerController
     */
    private static $_instance = null;

	/**
	 * 
	 * 
	 * 
	 * Constructor of the class
	 * @access public
	 * @param mapObj _map
	 * @return msExt_LayerController
	 * @ParamType _map mapObj
	 * @ReturnType msExt_LayerController
	 */
	private function __construct()
    {
        $this->_map = msExt_Map::GetInstance()->GetInnerMsObj();
        $this->_drawing_order = array();
        $this->BuildLayerOrder();
	}

    /**
     *
     */
    private function BuildLayerOrder()
    {
        $this->_layers_order = array();
        $_layers_count = $this->_map->numlayers;
        for($i = $_layers_count - 1; $i >= 0; $i--)
        {
            $_layer = $this->_map->getLayer($i);
            $this->AddLayer($_layer->name, $_layer->group);
        }
    }

    /**
     * Get the unique instance of the object
     *
     *@return msExt_LayerController
     */
    public static function GetInstance()
    {
        if(!self::$_instance)
            self::$_instance = new msExt_LayerController();

        self::$_instance->BuildLayerOrder();
        return self::$_instance;
    }

	/**
	 * @access public
	 * @param string _layer_name Name of the layer
	 * @param string _group_name Name of the group
	 * @ParamType string _layer_name Name of the layer
	 * @ParamType string _group_name Name of the group
	 */
	public function AddLayer($_layer_name, $_group_name)
    {
        if ($_group_name == '')
            array_push($this->_layers_order, $_layer_name);
        else
        {
            if (!array_key_exists($_group_name, $this->_layers_order))
                $this->_layers_order[$_group_name] = array();
            array_push($this->_layers_order[$_group_name], $_layer_name);
        }
	}

    //----------------------------------------------------------------------
    // LAYER ORDER
    //----------------------------------------------------------------------

	/**
	 * @access public
	 */
	public function GetLayerOrder()
    {
        return $this->_layers_order;
	}


    /**
     * @param $layerOrder array
     * @return bool
     */
    public function SetLayerOrder($layerOrder)
    {
        // Get all layers names
        $_current_layers = $this->_map->getAllLayerNames();

        // Get the map name
        $_map_name = $_SESSION['MSEXT_MAP_NAME'];
        // Build the map
        $_clone_map = ms_newMapObj($_map_name);

        // Remove all layers of the current map
        while($this->_map->numlayers)
            $this->_map->removeLayer(0);

        $this->_layers_order = array();

        $group_name = "";
        $layer_name = "";
        $map_layer = null;

        // Insert each layer given the order
        for($i = count($layerOrder) - 1; $i >= 0; $i--)
        {
            $item = $layerOrder[$i];
            if($item['type'] == 'LAYER')
            {
                $layer_name = $item['name'];
                // Verify that the layer exists
                if(array_search($layer_name,$_current_layers) === FALSE)
                    continue;

                $map_layer = $_clone_map->getLayerByName($layer_name);
                $map_layer->set('group', null);
                $this->_map->insertLayer($map_layer);
                $map_layer = null;

                // Insert highlight layer if exists
                if(array_search("__highlight_$layer_name",$_current_layers) !== FALSE)
                    $this->_map->insertLayer($_clone_map->getLayerByName("__highlight_$layer_name"));
            }
            elseif($item['type'] == 'GROUP')
            {
                $group_name = $item['name'];
                $_layers = $item['layers'];
                if(count($_layers) == 0)
                    continue;
                // Create the Group
                //if(array_search($group_name,array_keys($this->_layers_order)) === FALSE)
                    $this->_layers_order[$group_name] = array();
                // Iterate for each layer
                for($j = count($_layers) - 1; $j >= 0; $j--)
                {
                    $layer = $_layers[$j];
                    // Push the layer into the group
                    $layer_name = $layer['name'];
                    if(array_search($layer_name,$_current_layers) === FALSE)
                        continue;
                    $map_layer = $_clone_map->getLayerByName($layer_name);
                    $map_layer->set('group', $group_name);
                    $this->_map->insertLayer($map_layer);
                    $map_layer = null;

                    // Insert highlight layer if exists
                    if(array_search("__highlight_$layer_name",$_current_layers) !== FALSE)
                        $this->_map->insertLayer($_clone_map->getLayerByName("__highlight_$layer_name"));

                }
            }
        }

        $this->BuildLayerOrder();

        return true;
    }

    //----------------------------------------------------------------------
    // LAYER CREATION
    //----------------------------------------------------------------------


    /**
     * @param $layerName string
     * @param $strConnection string
     * @param $strData string
     * @param $isVisible bool
     * @param $type int
     * @return msExt_PgLayer
     */
    public function CreatePgLayer($layerName, $strConnection, $strData, $isVisible, $type)
    {
        $_status = ($isVisible) ? MS_ON : MS_OFF;

        $_layer = ms_newLayerObj($this->_map);
        $_layer->set('name', $layerName);
        $_layer->set('status', $_status);
        $_layer->set('data', $strData);
        $_layer->set('connection', $strConnection);
        $_layer->setConnectionType(MS_POSTGIS);
        $_layer->set('type', $type);

        $_base_layer = new msExt_PgBaseLayer($_layer,$this->_map);
        $_pg_layer = new msExt_PgLayer($_base_layer, msExt_Map::GetInstance());

        return $_pg_layer;
    }


    /**
     * @param $layerName string
     * @param $type int
     * @param $isVisible bool
     * @return msExt_CustomLayer
     */
    public function CreateCustomLayer($layerName, $type, $isVisible)
    {
        $_status = ($isVisible) ? MS_ON : MS_OFF;

        $_layer = ms_newLayerObj($this->_map);
        $_layer->set('name', $layerName);
        $_layer->set('status', $_status);
        $_layer->set('type', $type);

        $_base_layer = new msExt_CustomBaseLayer($_layer,$this->_map);
        $_pg_layer = new msExt_CustomLayer($_base_layer, msExt_Map::GetInstance());

        return $_pg_layer;
    }
}
?>