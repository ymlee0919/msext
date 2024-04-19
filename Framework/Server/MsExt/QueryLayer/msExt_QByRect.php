<?php
require_once(realpath(dirname(__FILE__)) . '/QueryLayerIterator.php');

/**
 * @access public
 */
abstract class msExt_QByRect extends msExt_QueryLayerIterator
{
	/**
	 * Constructor of the class
	 * @access public
	 * @param layerObj layer
	 * @param rectObj msRectObj
	 * @ParamType layer layerObj
	 * @ParamType msRectObj rectObj
	 */
	public function __construct(layerObj $layer, $msRectObj) {
		// Not yet implemented
	}
}
?>