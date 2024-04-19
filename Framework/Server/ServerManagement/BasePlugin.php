<?PHP

//------------------------------------------------
// Abstract class to define a Plugin
//------------------------------------------------
abstract class Plugin
{

    // Array to store errors reported by the user
    protected $_error_list;
    // Array to store the information of the drawed map
    protected $_map_data;
    // Flag to know if the map was drawed
    protected $_map_drawed;

    // Constructor of the object
    public function __construct()
    {
        $this->_error_list = array();
        $this->_map_data = null;
        $this->_map_drawed = false;
    }

    // Generic function to validate passed parameters  to a function
    public function Validate($FunctionName, &$Params)
    {
        $_validation_fn = "Validate$FunctionName";
        if (!method_exists($this, $_validation_fn))
        {
            $this->RegisterError('Error de implementaci�n', "Funci�n de validaci�n: '$_validation_fn' no implementada");
            return false;
        }

        return $this->$_validation_fn($Params);
    }

    // Function to regiter an error
    protected function RegisterError($ErrorType, $ErrorDescription)
    {
        array_push($this->_error_list, array('error' => utf8_encode($ErrorType), 'description' => utf8_encode($ErrorDescription)));
    }

    // Function to get the error list
    public function GetErrorList()
    {
        return $this->_error_list;
    }

    // Function to draw the map
    public function DrawMap()
    {
        if ($this->_map_drawed === true)
            return;

        $this->_map_data = array();
        // Code to draw the map and push data into the _map_data field

        $_map_panel = MapPanel::GetInstance();
        $_map_panel->Draw();
        $this->_map_data['MapPanel'] = $_map_panel->GetDrawingResult();

        // End of drawing
        $this->_map_drawed = true;
    }

    // Function to get the result of the drawing
    public function GetDrawingResult()
    {
        return $this->_map_data;
    }

}

?>