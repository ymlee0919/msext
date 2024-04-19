<?PHP
    require_once($_SESSION['FRAMEWORK_PATH'].'/msExt_LayerController.php');

    //------------------------------------------------------
    // Class to define the LayerControl
    //------------------------------------------------------ 
    class LayerControl extends Component
    {

        protected static $_instance = 0;
        private $_name_part;
        private $_drawed_count;

        // Constructor of the object
        protected function __construct()
        {
            parent::__construct();
            $this->_name_part = "";
            $this->_drawed_count = 0;
        }

        // PRIVATE FUNCTIONS
        //----------------------------------------------------------------------
        private function FreeLastImages()
        {
            if (isset($_SESSION["Last_Item_Name"]) && isset($_SESSION["Last_Items_Count"]))
            {
                if ($_SESSION["Last_Item_Name"] == -1 && $_SESSION["Last_Items_Count"] == -1)
                    return;

                $_last_name = $_SESSION["Last_Item_Name"];
                $_last_count = $_SESSION["Last_Items_Count"];

                $_app_path = $_SESSION['APP_PATH'];

                for ($i = 0; $i < $_last_count; $i++)
                {
                    $_file_name = $_app_path . "/Map/Generated/Icon/" . $i . $_last_name . "_icon.png";
                    @unlink($_file_name);
                }

                $_SESSION["Last_Item_Name"] = -1;
                $_SESSION["Last_Items_Count"] = -1;
            }
        }

        private function BuildTemporalName()
        {
            $_sessio_id = SID;
            $_md5 = md5($_sessio_id);
            $_sha = sha1($_sessio_id);
            $_time = date("d.m.H.i.s");

            $this->_name_part = '.' . substr($_md5, 0, 5) . '.' . substr($_sha, 0, 5) . '.' . $_time;
            if (!isset($_SESSION["Last_Item_Name"]))
                $_SESSION["Last_Item_Name"] = null;
            if (!isset($_SESSION["Last_Items_Count"]))
                $_SESSION["Last_Items_Count"] = null;

            $_SESSION["Last_Item_Name"] = $this->_name_part;
        }

        private function DrawLayer($_layer_name)
        {
            $data = array();
            $current_layer = $this->_map->getLayerByName($_layer_name);

            if ($current_layer->type != MS_LAYER_ANNOTATION && strpos($_layer_name, '__highlight_') === false)
            {
                $current_class = $current_layer->getClass(0);
                $current_obj = $current_class->createLegendIcon(16, 16);
                $_img_url = "../../Generated/Icon/" . $this->_drawed_count . $this->_name_part . "_icon.png";

                $current_obj->saveImage($_img_url, $this->_map);
                $thematics = $current_layer->getMetaData('THEMATICS');

                $_img_url = "Generated/Icon/" . $this->_drawed_count++ . $this->_name_part . "_icon.png";

                $data['id'] = 'LAYER_' . $_layer_name;
                $data['text'] = $_layer_name;
                if ($current_layer->isVisible() == MS_TRUE)
                    $data['checked'] = ($current_layer->status == MS_ON);
                $data['leaf'] = true;
                $data['icon'] = 'Map/' . $_img_url;
                $data['expanded'] = false;
                if (($current_layer->connectiontype == MS_POSTGIS))
                {
                    $data['attributes'] = array();
                    $data['attributes']['table_name'] = $current_layer->getMetaData('table_name');
                }
                //Opciones que se usan para evitar la comunicaci�n con el server
                //$data['cls'] = $thematics;
                $children = Array();
                $bool = false;

                if ($thematics)
                {
                    $bool = true;
                    $data['leaf'] = false;
                    $data['icon'] = "Components/LayerControl/Client/Icons/node_tematic_map.png";
                    $cont = 0;
                    while ($thematics--)
                    {
                        $child = Array();
                        $current_class = $current_layer->getClass($cont++);
                        $current_obj = $current_class->createLegendIcon(16, 16);
                        $_img_url = "../../Generated/Icon/" . $this->_drawed_count . $this->_name_part . "_icon.png";

                        $current_obj->saveImage($_img_url, $this->_map);

                        $_img_url = "Map/Generated/Icon/" . $this->_drawed_count++ . $this->_name_part . "_icon.png";

                        $child['id'] = 'CLASS_' . ($cont - 1) . '_' . $_layer_name;
                        $child['text'] = ($current_layer->connectiontype == MS_POSTGIS) ? $current_class->name : utf8_encode($current_class->name);
                        $child['leaf'] = true;
                        $child['icon'] = $_img_url;
                        
                        array_push($children, $child);
                    }
                }
                if ($bool)
                    $data['children'] = $children;
            }
            else $data = null;
            
            return $data;
        }

        private function DrawGroup($_group_name, $_layers_array)
        {
            $data = array();

            $data['id'] = 'GROUP_' . $_group_name;
            $data['text'] = $_group_name;
            $data['leaf'] = false;
            $data['expanded'] = false;
            $children = array();
            foreach ($_layers_array as $index => $_layer_name)
            {
                $_layer_data = $this->DrawLayer($_layer_name);
                if (count($_layer_data))
                    array_push($children, $_layer_data);
            }
            $data['children'] = $children;
            return $data;
        }

        protected function DrawComponent()
        {
            $_layer_controller = msExt_LayerController::GetInstance();
            $_layer_order = $_layer_controller->GetLayerOrder();
            $this->FreeLastImages();
            $this->BuildTemporalName();

            $data = array();
            foreach ($_layer_order as $group => $_layer_array)
            {
                if (gettype($group) == 'integer' && count($_layer_array) == 1)
                    $_layer_drawing = $this->DrawLayer($_layer_array);
                else
                    $_layer_drawing = $this->DrawGroup($group, $_layer_array);

                if(!is_null($_layer_drawing))
                    array_push($data, $_layer_drawing);
            }

            $_SESSION["Last_Items_Count"] = $this->_drawed_count;

            return $data;
        }

        public function OnLoadMap()
        {
            return $this->DrawComponent();
        }

        public static function GetInstance()
        {
            if (self::$_instance == 0)
                self::$_instance = new LayerControl();

            self::$_instance->_map = self::$_instance->msMap->GetInnerMsObj();
            return self::$_instance;
        }
        
        // Show all layers
        //-------------------------------------------
        public function ValidateShowAllLayers($params)
        {
            return true;
        }

        public function ShowAllLayers($params)
        {
            $this->msMap->ShowAllLayers();
            $this->msMap->Save();

            $this->UpdateReference();

            $this->msMap->SetExtent();

            return true;
        }

        public function ValidateSetLayerOrder(&$params)
        {
            $order = $params['order'];
            Validator::ToJSON($order,true);
            $params['order'] = $order;

            return true;
        }

        public function SetLayerOrder(&$params)
        {
            $_layer_controller = msExt_LayerController::GetInstance();
            $_layer_controller->SetLayerOrder($params['order']);
            $this->msMap->SaveAs(msExt_Map::GetTemporalMapName(),true);
            Reference::GetInstance()->UpdateReference();
            $this->msMap->SetExtent();
            return true;
        }

    }

?>