<?PHP

//------------------------------------------------
// Abstract class to define a Component
//------------------------------------------------
abstract class Component
{
    // Array to store errors reported by the user
    protected $_error_list;
    // Array to store the information of the drawed map
    protected $_component_data;
    // Flag to know if the map was drawed
    protected $_object_drawed;
    // MsExt_Map object
    protected $msMap;
    // MapServer Map Object
    protected $_map;

    // Constructor of the object
    protected function __construct()
    {
        $this->_error_list = array();
        $this->_component_data = null;
        $this->_object_drawed = false;

        $this->msMap = msExt_Map::GetInstance();
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
        array_push($this->_error_list, array('error' => utf8_encode($ErrorType), 'desc' => utf8_encode($ErrorDescription)));
    }

    // Function to get the error list
    public function GetErrorList()
    {
        return $this->_error_list;
    }

    // Generic to draw the map
    public function Draw()
    {
        if ($this->_object_drawed === true)
            return;

        $this->_component_data = array();
        $this->_object_drawed = $this->DrawComponent();
    }

    public function UpdateReference()
    {
        $_reference = Reference::GetInstance();
        $_reference->UpdateReference();
    }

    /*
     * Function to draw the component
     */

    abstract protected function DrawComponent();

    /*
     * This is executed when a map is loaded
     */

    abstract public function OnLoadMap();

    // Function to get the result of the drawing
    public function GetDrawingResult()
    {
        return $this->_object_drawed;
    }

}

?>