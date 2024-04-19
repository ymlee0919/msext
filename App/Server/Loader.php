<?PHP

//require_once('../../Administration/Access/access_users.php');
$_map_path = $_SESSION['FRAMEWORK_PATH'] . '/msExt_Map.php';
include_once($_map_path);

class Loader
{

    private $_map;
    private $msMap;
    private $_components;

    public function __construct()
    {
        $this->_components = array('MapPanel', 'Reference', 'ScaleBar', 'LayerControl');

        // Include the code of each component
        foreach ($this->_components as $item => $component)
        {
            $url = $_SESSION['APP_PATH'] . "/Components/$component/Server/$component.php";
            include_once($url);
        }
    }

    private function InitMap($source, $map_file_name)
    {
        /// Init the initial map of the app
        // Load mapfile of the aplicación
        $_map_file = $_SESSION['APP_PATH'] . '/Map/Maps/' . $source . '/' . $map_file_name;
        // Create the mapObj
        $this->_map = ms_newMapObj($_map_file);

        // Generate the new name of the map file
        $_map_file_name = $_SESSION['APP_PATH'] . '/Map/Generated/Map/' . msExt_Map::GetTemporalMapName();

        // Generate a new reference name
        $_ref_file_path = $_SESSION['APP_PATH'] . '/Map/Generated/Ref/' . msExt_Map::GetTemporalRefName();
        // Set the new reference path
        $this->_map->reference->set('image', $_ref_file_path);

        // Save the map with the new name
        $this->_map->save($_map_file_name);

        // Register in the session the name of the map
        $_SESSION['MSEXT_MAP_NAME'] = $_map_file_name;

        // Register in the session the extent of the map
        $_SESSION['MSEXT_MAP_EXTENT'] = 0;
    }

    private function RestrictDomain($map_name)
    {
        // Delete layers out of domain
        //$_user_manager = new AccessUsers();
        //$_accesible_layers = $_user_manager->getAccesibleLayersOfMap($map_name);
        // Get the name of all layers
        $_all_layers = $msMap->GetAllLayerNames();
        // Iterate each layer
        foreach ($_all_layers as $_current_layer)
        {
            // Get the name of the layer
            $_layer_name = $_current_layer;
            // If it is a labeled layer, get the owner layer
            if (strpos($_current_layer, '_labeled_') !== false)
                $_layer_name = str_replace('_labeled_', '', $_current_layer);

            $_current_ms_layer = $msMap->GetLayer($_current_layer);
            // If user have not access to this layer, is erased
            if (array_search($_layer_name, $_accesible_layers) === false)
                $_current_ms_layer->Delete();
            // If have access, set restrictions
            //else
            /* {
              $str_restrictions = $_user_manager->getLayerRestrictions($map_name, $_current_layer);
              if(!is_null($str_restrictions))
              $_current_ms_layer->SetFilter($str_restrictions);
              } */
        }
    }

    private function OnLoadComponents()
    {
        $result = array();

        foreach ($this->_components as $component)
        {
            $_comp = $component::GetInstance();
            $result[$component] = $_comp->OnLoadMap();
        }

        return $result;
    }

    public function ValidateLoadMap($Params)
    {
        return true;
    }

    public function LoadMap($Params)
    {
        $map_file = $Params["map_name"];
        $width = $Params["width"];
        $height = $Params["height"];
        $source = $Params["source"];

        // Get the real source of the mapfile
        if ($source == 'User')
        {
            //$_user_manager = new AccessUsers();
            //$source = $_user_manager->getCurrentUser();
            $source = 'Us-0001';
        }

        // Init the map
        $this->InitMap($source, $map_file);

        /// Load the current map
        $this->msMap = msExt_Map::GetInstance();
        // Resize the new map
        $this->msMap->Resize($width, $height);

        // Restrict the domain of the map
        //$this->RestrictDomain($map_file);
        // Save the map initialiced and with the domain restrictions
        $this->msMap->Save();

        // Update the reference for draw the reference image
        $reference = Reference::GetInstance();
        $reference->UpdateReference();

        // Set the original extent to the map, now it is ready for drawing
        $this->msMap->SetOriginalExtent();

        $result = $this->OnLoadComponents();

        return $result;
    }

}

?>