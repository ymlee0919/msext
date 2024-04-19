<?PHP

    //------------------------------------------------------
    // Class to define the MapPanel
    //------------------------------------------------------ 
    class MapPanel extends Component
    {

        // Instance of the MapPanel
        protected static $_instance = 0;
        // Flag to indicate if the map panel is resized
        private $onRezise;

        // Constructor of the object
        protected function __construct()
        {
            parent::__construct();
            $this->onRezise = false;
        }

        public static function GetInstance()
        {
            if (self::$_instance == 0)
                self::$_instance = new MapPanel();

            self::$_instance->_map = self::$_instance->msMap->GetInnerMsObj();
            return self::$_instance;
        }

        protected function DrawComponent()
        {
            $result = array();

            if ($this->onRezise)
            {
                $this->msMap->SetOriginalExtent();
                $_max_scale = $this->msMap->GetScale();
                $this->msMap->SetExtent();
                $result['max_scale'] = $_max_scale;
            }

            $_sub_name = $_SESSION['_map_name'];

            $image_name = _PATH . "_map_$_sub_name.png";
            $image_url = _FULL_PATH . "_map_$_sub_name.png";

            $image = $this->_map->draw();
            $image->saveImage($image_name, $this->_map);


            $extent_to_html = $this->_map->extent->minx . " " . $this->_map->extent->miny . " " . $this->_map->extent->maxx . " " . $this->_map->extent->maxy;

            $scale = $this->_map->scaledenom;

            $_SESSION['MSEXT_MAP_EXTENT'] = $extent_to_html;

            $result['image'] = $image_url;
            $result['extent'] = $extent_to_html;
            $result['scale'] = round($scale);

            return $result;
        }

        public function OnLoadMap()
        {
            $result = $this->DrawComponent();
            $result['map_extent'] = $this->msMap->GetOriginalExtent();

            return $result;
        }

        // ZOOM RECT
        //------------------------------------------------------------------------------
        public function ValidateZoomRect($params)
        {
            return true;
        }

        public function ZoomRect($params)
        {
            $this->msMap->ZoomRectangle($params["rect_zoom"]);
            return true;
        }

        // ZOOM POINT
        //------------------------------------------------------------------------------
        public function ValidateZoomPoint($params)
        {
            return true;
        }

        public function ZoomPoint($params)
        {
            $_factor = (isset($params["factor"])) ? $params["factor"] : 2;
            $this->msMap->ZoomPoint($params["mapa_x"], $params["mapa_y"], $_factor);
            return true;
        }

        // ZOOM ZOOM
        //------------------------------------------------------------------------------
        public function ValidateZoom($params)
        {
            return true;
        }

        public function Zoom($params)
        {
            $_option = $params["opt"];
            $_zoom_type = ($_option == 'acercar') ? 'In' : 'Out';
            $this->msMap->Zoom($_zoom_type);
            return true;
        }

        // PAN
        //-----------------------------------------------------------------------
        public function ValidatePan($params)
        {
            return true;
        }

        public function Pan($params)
        {
            $this->msMap->Pan($params["mapa_x"], $params["mapa_y"]);
            return true;
        }

        // FULL EXT
        //-------------------------------------------------------------------------
        public function ValidateFullExt($params)
        {
            return true;
        }

        public function FullExt($params)
        {
            $this->msMap->SetOriginalExtent();
            return true;
        }

        // CHANGE SCALE
        //-------------------------------------------------------------------------
        public function ValidateChangeScale($params)
        {
            return true;
        }

        public function ChangeScale($params)
        {
            $this->msMap->ChangeScale($params["scale"]);
            return true;
        }

        public function ValidateResizeMap($params)
        {
            return true;
        }

        public function ResizeMap($params)
        {
            $this->msMap->Resize($params["width"], $params["height"]);
            $this->msMap->Save();
            $this->onRezise = true;

            return true;
        }

    }

?>