<?php
require_once(realpath(dirname(__FILE__)) . '/QueryLayerIterator.php');

/**
 * @access public
 */
abstract class msExt_QByPoint extends msExt_QueryLayerIterator
{
	/**
	 * Constructor of the class
	 * @access public
	 * @param layerObj layer
	 * @param pointObj msPointObj
	 * @param int mapUnit
	 * @ParamType layer layerObj
	 * @ParamType msPointObj pointObj
	 * @ParamType mapUnit int
	 */
	public function __construct($layer, $msPointObj, $mapUnit) {
		// Not yet implemented
	}
}
?>