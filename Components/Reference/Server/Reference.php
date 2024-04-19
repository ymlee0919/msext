<?PHP

//------------------------------------------------------
// Class to define the MapPanel
//------------------------------------------------------
class Reference extends Component
{

    protected static $_instance = 0;

    // Constructor of the object
    protected function __construct()
    {
        parent::__construct();
    }

    public static function GetInstance()
    {
        if (self::$_instance == 0)
            self::$_instance = new Reference();

        self::$_instance->_map = self::$_instance->msMap->GetInnerMsObj();
        return self::$_instance;
    }

    protected function DrawComponent()
    {
        $_sub_name = $_SESSION['_map_name'];

        $reference_path = _PATH . "_ref_$_sub_name.png";
        $reference_url = _FULL_PATH . "_ref_$_sub_name.png";

        $reference = $this->_map->drawReferenceMap();
        $reference->saveImage($reference_path, $this->_map);
        $scale = $this->_map->scaledenom;

        $result = array();
        $result['image'] = $reference_url;
        $result['scale'] = round($scale);
        $result['extent'] = msExt_Map::RectOBJtoStr($this->_map->reference->extent);
        
        return $result;
    }

    public function OnLoadMap()
    {
        return $this->DrawComponent();
    }

    private function UpdateReferenceImage($ref_width, $ref_height)
    {
        if ($_SESSION['reference_refresh'] != 'disabled')
        {
            $map_layers = $this->_map->getAllLayerNames();
            $layers_update = array();
            $layers_param = array();

            //// Prepare the map for draw the reference image
            if ($_SESSION['reference_refresh'] == 'auto')
            {
                $layers_count = $this->_map->numlayers;

                for ($i = $layers_count - 1; $i >= 0; $i--)
                {
                    $_layer_name = $this->_map->getLayer($i)->name;
                    // Shut down only layer of label because the others are as the user demand
                    if (strpos($_layer_name, '_labeled_') !== false)
                        $this->_map->getLayer($i)->set('status', MS_OFF);
                    else
                        break;
                }
            }
            else
            {
                $layers_param = $_SESSION['reference_refresh_layers'];

                foreach ($map_layers as $_layer)
                {
                    $_current_layer = $this->_map->getLayerByName($_layer);
                    if ($_current_layer->status == MS_ON)
                    {
                        $_current_layer->set('status', MS_OFF);
                        $temp[0] = $_layer;
                        $temp[1] = 'show';
                        array_push($layers_update, $temp);
                    }
                    else
                    {
                        $temp[0] = $_layer;
                        $temp[1] = 'hide';
                        array_push($layers_update, $temp);
                    }
                }
                foreach ($layers_param as $_layer)
                {
                    $_current_layer = $this->_map->getLayerByName($_layer);
                    $_current_layer->set('status', MS_ON);
                }
            }

            $width = $this->_map->width;
            $height = $this->_map->height;
            $this->_map->setSize($ref_width, $ref_height);
            $_ref_path = $this->_map->reference->image;
            $image = $this->_map->draw();
            $image->saveImage($_ref_path);
            $this->_map->setSize($width, $height);

            if ($_SESSION['reference_refresh'] == 'auto')
            {
                for ($i = $layers_count - 1; $i >= 0; $i--)
                {
                    $_layer_name = $this->_map->getLayer($i)->name;

                    if (strpos($_layer_name, '_labeled_') !== false)
                        $this->_map->getLayer($i)->set('status', MS_ON);
                    else
                        break;
                }
            }
            else
            {
                $layers_param = $_SESSION['reference_refresh_layers'];

                for ($i = 0; $i < count($layers_update); $i++)
                {
                    $_current_layer = $this->_map->getLayerByName($layers_update[$i][0]);
                    if ($layers_update[$i][1] == 'hide')
                        $_current_layer->set('status', MS_OFF);
                    else
                        $_current_layer->set('status', MS_ON);
                }
            }
        }
    }

    // ZOOM POINT
    //------------------------------------------------------------------------------
    public function ValidateZoomPoint($params)
    {
        return true;
    }

    public function ZoomPoint($params)
    {
        $this->msMap->GotoPoint($params["mapa_x"], $params["mapa_y"], 1);

        return true;
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

    // CHANGE SLIDER SCALE
    //----------------------------------------------------------------------------
    public function ValidateChangeScale($params)
    {
        return true;
    }

    public function ChangeScale($params)
    {
        if (isset($params["percent"]))
            $this->msMap->ChangeReferenceScale($params["percent"]);
        return true;
    }

    // CHANGE THE WAY TO REFRESH THE REFERENCE
    //---------------------------------------------------------------------------------
    public function ValidateChangeRefreshWay($params)
    {
        return true;
    }

    public function UpdateReference()
    {
        $this->UpdateReferenceImage(230, 160);
    }

    public function ChangeRefreshWay($params)
    {
        $way = $params["way"];
        if ($way == 'auto')
        {
            $_SESSION['reference_refresh'] = 'auto';
            $this->UpdateReference();
        }
        else if ($way == 'manual')
        {
            $_SESSION['reference_refresh'] = 'manual';
            $_layers = $params["layers"];
            $_layers_array = substr($_layers, 1, strlen($_layers) - 2);
            $_layers_array = str_replace('\\', '', $_layers_array);

            eval("\$_layers_names = array($_layers_array);");
            $_SESSION['reference_refresh_layers'] = $_layers_names;
            $this->UpdateReference();
        }
        else
            $_SESSION['reference_refresh'] = 'disabled';

        $this->msMap->SetExtent();

        $_drawer = Drawer::GetInstance();
        $_drawer->DrawComponent('Reference');

        return $this->_object_drawed;
    }

}

?>