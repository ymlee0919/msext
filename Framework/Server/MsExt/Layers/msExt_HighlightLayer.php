<?php

require_once(realpath(dirname(__FILE__)) . '/../msExt_Shape.php');

/**
 * @access public
 */
class msExt_HighlightLayer
{
	protected $_msLayer;

	/**
	 * @access public
	 */
	public function Show()
    {
		$this->_msLayer->set('status', MS_ON);
	}

	/**
	 * @access public
	 */
	public function Hide()
    {
        $this->_msLayer->set('status', MS_OFF);
	}

	/**
	 * @access public
	 * @param string newName
	 * @ParamType newName string
	 */
	public function Rename($newName)
    {
		$this->_msLayer->set('name', "__highlight_$newName");
	}

	/**
	 * @access public
	 */
	public function Clear() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @ParamType shape msExt_Shape
	 */
	public function AddShape($shape)
    {
		$this->_msLayer->addFeature($shape->GetInnerMsObj());
	}

    /**
     * @return mixed
     */
    public function GetInnerMsObj()
    {
        return $this->_msLayer;
    }


    /**
     * @param $property string The name of the property to set
     * @param $value mixed The value of the property
     */
    public function SetProperty($property, $value)
    {
        $this->GetInnerMsObj()->set($property, $value);
    }

    /**
     * @param $properties array Array of key value properties to set
     */
    public function SetProperties($properties)
    {
        foreach($properties as $property => $value)
            $this->SetProperty($property, $value);
    }

    /**
     * @access public
     * @param string wktProjection
     * @ParamType wktProjection string
     */
    public function SetWKTProjection($wktProjection)
    {
        $this->_msLayer->setWKTProjection($wktProjection);
    }

    /**
     * @access public
     * @param string connectionType
     * @ParamType connectionType string
     */
    public function SetConnectionType($connectionType)
    {
        $this->_msLayer->setConnectionType($connectionType);
    }

    /**
     * @access public
     * @param string projection
     * @ParamType projection string
     */
    public function SetProjection($projection)
    {
        $this->_msLayer->setProjection($projection);
    }
}
?>