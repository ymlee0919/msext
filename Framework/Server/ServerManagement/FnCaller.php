<?PHP

include_once('BasePlugin.php');
include_once('BaseComponent.php');
include_once('Drawer.php');

define("_PATH", "../../Generated/Img/");
define("_FULL_PATH", "Map/Generated/Img/");

class FnCaller
{

    // Field to indicate if the execution of the function was successfull
    private $_success;
    // Array to store the result of the function
    private $_result;
    // Field to store the error list
    private $_error_list;

    // Constructor of the object
    public function __construct()
    {
        $this->_success = true;
        $this->_result = array();
        $this->_error_list = array();
    }

    // Function to register an error
    private function RegisterError($ErrorType, $ErrorMsg)
    {
        array_push($this->_error_list, array('error' => utf8_encode($ErrorType),
            'desc' => utf8_encode($ErrorMsg))
        );
        $this->_success = false;
    }

    // Function to perform a user request
    public function Execute($StrFn, $Params)
    {
        $_params = $Params;
        // fn structure: Action.[Components|Plugins].Name.File.Class.Function
        $_function = $StrFn;
        $_fn_parts = explode(".", $_function);

        // Take each part of the function
        $_action = $_fn_parts[0];
        $_item = $_fn_parts[1];
        $_name = $_fn_parts[2];
        $_file = $_fn_parts[3] . ".php";
        $_class = $_fn_parts[4];
        $_fn = $_fn_parts[5];


        if ($_item == 'App')
        {
            // Build the url to load the file
            $_url = "../../$_item/Server/$_file";
            // Validate that the file exist
            if (!file_exists($_url) || !is_readable($_url))
            {
                $this->RegisterError('IO Error', 'Error cargando fichero');
                return false;
            }
            include_once($_url);
            return $this->ExecuteAppFunction($_class, $_fn, $Params, $_action);
        }
        else
        {
            // Build the url to load the file
            $_url = "../../$_item/$_name/Server/$_file";
            //die($_url);
            // Validate that the file exist
            if (!file_exists($_url) || !is_readable($_url))
            {
                $this->RegisterError('IO Error', 'Error cargando fichero');
                return false;
            }
            // Include the file
            include_once($_url);
            if ($_item == 'Plugins')
                return $this->ExecutePluginFunction($_name, $_class, $_fn, $Params, $_action);
            elseif ($_item == 'Components')
                return $this->ExecuteComponentFunction($_name, $_class, $_fn, $Params, $_action);
        }
    }

    private function ExecuteAppFunction($ClassName, $FunctionName, $Params, $Action)
    {
        // Validate that the existence of the class
        if (!class_exists($ClassName, false))
        {
            $this->RegisterError('Class Error', 'Error cargando clase');
            return false;
        }
        // Create an instance of the class
        $_class = new $ClassName();

        // Validate that the class implements the requested function
        if (!method_exists($_class, $FunctionName))
        {
            $this->RegisterError('Implementation Error', 'Error la clase no implementa la función solicitada');
            return false;
        }

        // Invoke the function
        $_result = call_user_method($FunctionName, $_class, $Params);
        if ($_result === false)
        {
            $this->_error_list = $_class->GetErrorList();
            $this->_success = false;
            return false;
        }
        else
        {
            $this->_result = $_result;
            return true;
        }
    }

    private function ExecutePluginFunction($PluginName, $ClassName, $FunctionName, $Params, $Action)
    {
        // Validate that the existence of the class
        if (!class_exists($ClassName, false))
        {
            $this->RegisterError('Class Error', 'Error cargando clase');
            return false;
        }
        // Create an instance of the class
        $_plugin = new $ClassName();
        // Validate that the class is a plugin
        if (get_parent_class($_plugin) != 'Plugin')
        {
            $this->RegisterError('Class Error', 'Error la clase no es un plugin');
            return false;
        }
        // Validate that the class implements the requested function
        if (!method_exists($_plugin, $FunctionName))
        {
            $this->RegisterError('Implementation Error', 'Error la clase no implementa la función solicitada');
            return false;
        }

        // Invoke the validation function
        $_validation = $_plugin->Validate($FunctionName, $Params);
        if ($_validation === false)
        {
            $this->_error_list = $_plugin->GetErrorList();
            $this->_success = false;
            return false;
        }

        // Invoke the function
        $_result = $_plugin->$FunctionName($Params);
        if (!$_result)
        {
            $this->_error_list = $_plugin->GetErrorList();
            $this->_success = false;
            return false;
        }

        if ($Action == 'Request')
            $this->_result[$PluginName] = $_result;
        elseif ($Action == 'Load')
            $this->_result = $_result;
        elseif ($Action == 'Draw')
        {
            $drawer = Drawer::GetInstance();
            $drawer->Draw();
            $this->_result = $drawer->GetDrawingResult();
            $this->_result[$PluginName] = $_result;
        }

        return true;
    }

    private function ExecuteComponentFunction($ComponentName, $ClassName, $FunctionName, $Params, $Action)
    {
        // Validate that the existence of the class
        if (!class_exists($ClassName, false))
        {
            $this->RegisterError('Class Error', 'Error cargando clase');
            return false;
        }

        // Create an instance of the class
        $_component = $ClassName::GetInstance();

        // Validate that the class is a plugin
        if (get_parent_class($_component) != 'Component')
        {
            $this->RegisterError('Class Error', 'Error la clase no es un componente');
            return false;
        }
        // Validate that the class implements the requested function
        if (!method_exists($_component, $FunctionName))
        {
            $this->RegisterError('Implementation Error', 'Error la clase no implementa la función solicitada');
            return false;
        }

        if ($Action == 'Draw')
            $_drawer = Drawer::GetInstance();

        // Invoke the validation function
        $_validation = $_component->Validate($FunctionName, $Params);
        if ($_validation === false)
        {
            $this->_error_list = $_component->GetErrorList();
            $this->_success = false;
            return false;
        }

        // Invoke the function
        $_result = call_user_method($FunctionName, $_component, $Params);
        if (!$_result)
        {
            $this->_error_list = $_component->GetErrorList();
            $this->_success = false;
            return false;
        }

        if ($Action == 'Request')
            $this->_result[$ComponentName] = $_result;
        elseif ($Action == 'Load')
            $this->_result = $_result;
        elseif ($Action == 'Draw')
        {
            $_drawer->Draw();
            $this->_result = $_drawer->GetDrawingResult();
        }

        return true;
    }

    public function GetResult()
    {
        return $this->_result;
    }

    public function GetErrorList()
    {
        return $this->_error_list;
    }

}

?>
