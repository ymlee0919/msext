<?php
require_once(realpath(dirname(__FILE__)) . '/QueryLayerIterator.php');

/**
 * @access public
 */
abstract class msExt_QByShape extends msExt_QueryLayerIterator
{
	/**
	 * Constructor of the class
	 * @access public
	 * @param layerObj layer
	 * @param shapeObj msShapeObj
	 * @ParamType layer layerObj
	 * @ParamType msShapeObj shapeObj
	 */
	public function __construct($layer, $msShapeObj)
    {
		// Not yet implemented
	}
}
?>