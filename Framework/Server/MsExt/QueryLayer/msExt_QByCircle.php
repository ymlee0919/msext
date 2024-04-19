<?php
require_once(realpath(dirname(__FILE__)) . '/QueryLayerIterator.php');

/**
 * @access public
 */
abstract class msExt_QByCircle extends msExt_QueryLayerIterator
{
	/**
	 * Constructor of the class
	 * @access public
	 * @param layerObj layer
	 * @param pointObj msPointObj
	 * @param int selectionType
	 * @param double radius
	 * @ParamType layer layerObj
	 * @ParamType msPointObj pointObj
	 * @ParamType selectionType int
	 * @ParamType radius double
	 */
	public function __construct($layer, $msPointObj, $selectionType, $radius)
    {
		// Not yet implemented
	}
}
?>