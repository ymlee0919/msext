<?PHP

define("_PATH", "../../Generated/Img/");
define("_FULL_PATH", "Map/Generated/Img/");

// Class to manage the drawing of the components
class Drawer
{
    // Components of the application
    private $_components;
    // Result of the drawing
    private $_drawing_result;
    // Single instance for all the application
    private static $_instance = 0;

    private function __construct()
    {
        $this->_components = array('MapPanel', 'Reference', 'ScaleBar', 'LayerControl');

        // Include the code of each component
        foreach ($this->_components as $component)
        {
            $url = $_SESSION['APP_PATH'] . "/Components/$component/Server/$component.php";
            include_once($url);
        }

        $this->_drawing_result = 0;
    }

    public static function GetInstance()
    {
        if (self::$_instance == 0)
            self::$_instance = new Drawer();

        return self::$_instance;
    }

    private function DeleteGeneratedImages()
    {
        if ($_SESSION['_map_name'])
        {
            $_map_prev_name = $_SESSION['_map_name'];

            $image_url = $_SESSION['APP_PATH'] . '/' . _FULL_PATH . "_map_$_map_prev_name.png";
            $reference_url = $_SESSION['APP_PATH'] . '/' . _FULL_PATH . "_ref_$_map_prev_name.png";
            $scale_bar_url = $_SESSION['APP_PATH'] . '/' . _FULL_PATH . "_scb_$_map_prev_name.png";

            if (file_exists($image_url))
                unlink($image_url);
            if (file_exists($reference_url))
                unlink($reference_url);
            if (file_exists($scale_bar_url))
                unlink($scale_bar_url);
        }
    }

    public function ChangeCurrentName()
    {
        $_current_name = session_id() . '_' . date("d.m.y.H.i.s");
        $this->DeleteGeneratedImages();

        $_SESSION['_map_name'] = $_current_name;
    }

    public function DrawComponent($ComponentName)
    {
        if ($this->_drawing_result != 0)
            return;
        $this->ChangeCurrentName();
        $this->_drawing_result = array();

        $_cmp = $ComponentName::GetInstance();
        $_cmp->Draw();
        $this->_drawing_result = $_cmp->GetDrawingResult();
    }

    public function Draw()
    {
        if ($this->_drawing_result != 0)
            return;

        $this->ChangeCurrentName();

        $this->_drawing_result = array();

        foreach ($this->_components as $component)
        {
            $_cmp = $component::GetInstance();
            $_cmp->Draw();
            $this->_drawing_result[$component] = $_cmp->GetDrawingResult();
        }
    }

    public function GetDrawingResult()
    {
        return $this->_drawing_result;
    }

}

?>