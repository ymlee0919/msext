<?PHP

//------------------------------------------------------
// Class to define the ScaleBar
//------------------------------------------------------ 
class ScaleBar extends Component
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
            self::$_instance = new ScaleBar();

        self::$_instance->_map = self::$_instance->msMap->GetInnerMsObj();
        return self::$_instance;
    }

    protected function DrawComponent()
    {
        $_sub_name = $_SESSION['_map_name'];

        $scale_bar_name = _PATH . "_scb_$_sub_name.png";
        $scale_bar_url = _FULL_PATH . "_scb_$_sub_name.png";

        $scale_bar = $this->_map->drawScaleBar();
        $scale_bar->saveImage($scale_bar_name, $this->_map);

        $result = array();
        $result['img_width'] = $scale_bar->width;
        $result['img_heigth'] = $scale_bar->height;
        $result['image'] = $scale_bar_url;

        return $result;
    }

    public function OnLoadMap()
    {
        $result = $this->DrawComponent();
        $_scaleBar = $this->msMap->GetScaleBar()->GetInnerMsObj();

        $unitsScaleBar = array(MS_FEET => 'MS_FEET', MS_INCHES => 'MS_INCHES', MS_KILOMETERS => 'MS_KILOMETERS', MS_METERS => 'MS_METERS', MS_MILES => 'MS_MILES');
        $positionsScaleBar = array(MS_UL => 'MS_UL', MS_UR => 'MS_UR', MS_UC => 'MS_UC', MS_LL => 'MS_LL', MS_LR => 'MS_LR', MS_LC => 'MS_LC');

        $result['position'] = $positionsScaleBar[$_scaleBar->position];
        $result['units'] = $unitsScaleBar[$_scaleBar->units];
        $result['intervals'] = $_scaleBar->intervals;
        //$result['transparent'] = $_scaleBar->opacity;

        $Hex_R = dechex($_scaleBar->color->red);
        $Hex_G = dechex($_scaleBar->color->green);
        $Hex_B = dechex($_scaleBar->color->blue);
        $result['color'] = ((strlen($Hex_R) == 1) ? '0' . $Hex_R : $Hex_R) . '' . ((strlen($Hex_G) == 1) ? '0' . $Hex_G : $Hex_G) . '' . ((strlen($Hex_B) == 1) ? '0' . $Hex_B : $Hex_B);

        $Hex_R = dechex($_scaleBar->outlinecolor->red);
        $Hex_G = dechex($_scaleBar->outlinecolor->green);
        $Hex_B = dechex($_scaleBar->outlinecolor->blue);
        $result['outlinecolor'] = ((strlen($Hex_R) == 1) ? '0' . $Hex_R : $Hex_R) . '' . ((strlen($Hex_G) == 1) ? '0' . $Hex_G : $Hex_G) . '' . ((strlen($Hex_B) == 1) ? '0' . $Hex_B : $Hex_B);
        $result['transparent'] = $this->msMap->GetScaleBar()->IsTransparent();
        $result['width'] = $_scaleBar->width;
        $result['height'] = $_scaleBar->height;

        return $result;
    }

    // CHANGE SCALE BAR CONFIG
    //------------------------------------------------------------------------
    public function ValidateChange($params)
    {
        return true;
    }

    public function Change($params)
    {
        $position = $params["position"];
        $units = $params["units"];
        $intervals = $params["intervals"];
        $transparent = $params["transparent"];
        $color = $params["color"];
        $outlinecolor = $params["outlinecolor"];
        $width = $params["width"];
        $height = $params["height"];

        //color
        $R = hexdec(substr($color, 0, 2));
        $G = hexdec(substr($color, 2, 2));
        $B = hexdec(substr($color, 4, 2));

        //color de borde
        $RB = hexdec(substr($outlinecolor, 0, 2));
        $GB = hexdec(substr($outlinecolor, 2, 2));
        $BB = hexdec(substr($outlinecolor, 4, 2));

        eval("\$real_units = $units;");
        eval("\$real_position = $position;");

        $_scale_bar = $this->msMap->GetScaleBar();
        $_scale_bar->SetProperties(array('intervals' => $intervals,
            'height' => $height,
            'width' => $width,
            'units' => $real_units,
            'position' => $real_position));

        $_scale_bar->SetColor($R,$G,$B);
        $_scale_bar->SetOutlineColor($RB,$GB,$BB);
        
        if($transparent)
        {
            $R = -1;
            $G = -1;
            $B = -1;
        }
        else
        {
            $R = 255;
            $G = 255;
            $B = 255;
        }
        
        $_scale_bar->SetImageColor($R,$G,$B);
        $_scale_bar->SetBackgroundColor($R,$G,$B);

        $this->msMap->Save();

        $this->msMap->SetExtent();

        $_drawer = Drawer::GetInstance();
        $_drawer->ChangeCurrentName();

        $this->Draw();

        $_scale_bar_img = $this->_map->drawScaleBar();
        $_width = $_scale_bar_img->width;
        $_height = $_scale_bar_img->height;

        $this->_object_drawed['width'] = $_width;
        $this->_object_drawed['height'] = $_height;

        return $this->_object_drawed;
    }

}

?>