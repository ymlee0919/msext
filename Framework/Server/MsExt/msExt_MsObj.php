<?php

/**
 * @access public
 */
abstract class msExt_MsObj
{

    /**
     * @AttributeType mixed
     * Inner MapServer object inside the wrapper object
     */
    protected $_inner_msObj;

    /**
     * Set a property to the object
     * @access public
     * @param string property
     * @param mixed value
     * @return mixed
     * @ParamType property string
     * @ParamType value mixed
     * @ReturnType mixed
     */
    public function SetProperty($property, $value)
    {
        if(gettype($value) == 'object')
        {
            $_type = get_class($value);
            if(substr($_type,0,5) == 'msExt')
                $value = $value->GetInnerMsObj();
        }
        $this->_inner_msObj->set($property,$value);
    }

    /**
     * Set a group of properties to a MapServer object
     * @access public
     * @param array aProperties
     * @return mixed
     * @ParamType aProperties array
     * @ReturnType mixed
     */
    public function SetProperties($properties)
    {
        foreach($properties as $property => $value)
            $this->SetProperty($property, $value);
    }

    /**
     * Return the MapServer object inside the wrapper
     * @access public
     * @return mixed
     * @ReturnType mixed
     */
    public function GetInnerMsObj()
    {
        return $this->_inner_msObj;
    }

}

?>