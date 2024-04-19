<?php
require_once(realpath(dirname(__FILE__)) . '/../msExt_Class.php');
require_once(realpath(dirname(__FILE__)) . '/../msExt_RectObj.php');
require_once(realpath(dirname(__FILE__)) . '/../QueryLayer/msExt_QByPoint.php');
require_once(realpath(dirname(__FILE__)) . '/../QueryLayer/msExt_QByCircle.php');
require_once(realpath(dirname(__FILE__)) . '/../QueryLayer/msExt_QByRect.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_Layer.php');

/**
 * @access public
 * @package MsExt___LayerControl
 */
abstract class msExt_RasterLayer extends msExt_Layer {
	/**
	 * @AttributeType string
	 */
	protected $processing;

	/**
	 * @access public
	 * @param string processing
	 * @ParamType processing string
	 */
	public function setProcessing($processing) {
		$this->processing = $processing;
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function getProcessing() {
		return $this->processing;
	}

	/**
	 * @access public
	 */
	public function open() {
		// Not yet implemented
	}

	/**
	 * @access public
	 */
	public function close() {
		// Not yet implemented
	}

	/**
	 * @access public
	 */
	public function free() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param int index
	 * @return msExt_Class
	 * @ParamType index int
	 * @ReturnType msExt_Class
	 */
	public function getClass($index) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param int index
	 * @ParamType index int
	 */
	public function removeClass($index) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string className
	 * @param int status
	 * @return msExt_Class
	 * @ParamType className string
	 * @ParamType status int
	 * @ReturnType msExt_Class
	 */
	public function addClass($className, $status) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param int index
	 * @ParamType index int
	 */
	public function moveClassUp($index) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param int index
	 * @ParamType index int
	 */
	public function moveClassDown($index) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @return msExt_RectObj
	 * @ReturnType msExt_RectObj
	 */
	public function getExtent() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function getFilterString() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string filter
	 * @ParamType filter string
	 */
	public function setFilter($filter) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string key
	 * @return string
	 * @ParamType key string
	 * @ReturnType string
	 */
	public function getMetaData($key) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string key
	 * @param string value
	 * @ParamType key string
	 * @ParamType value string
	 */
	public function setMetaData($key, $value) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string key
	 * @ParamType key string
	 */
	public function removeMetaData($key) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string wktProjection
	 * @ParamType wktProjection string
	 */
	public function setWKTProjection($wktProjection) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param msExt_Point point
	 * @return msExt_QByPoint
	 * @ParamType point msExt_Point
	 * @ReturnType msExt_QByPoint
	 */
	public function queryByPoint(msExt_Point $point) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param msExt_Point point
	 * @param double radio
	 * @param int selectionType
	 * @return msExt_QByCircle
	 * @ParamType point msExt_Point
	 * @ParamType radio double
	 * @ParamType selectionType int
	 * @ReturnType msExt_QByCircle
	 */
	public function queryByCircle(msExt_Point $point, $radio, $selectionType) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param msExt_RectObj rect
	 * @return msExt_QByRect
	 * @ParamType rect msExt_RectObj
	 * @ReturnType msExt_QByRect
	 */
	public function queryByRect(msExt_RectObj $rect) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param msExt_Shape shape
	 * @return msExt_Shape
	 * @ParamType shape msExt_Shape
	 * @ReturnType msExt_Shape
	 */
	public function queryByShape(msExt_Shape $shape) {
		// Not yet implemented
	}

	/**
	 * @access public
	 */
	public function Show() {
		// Not yet implemented
	}

	/**
	 * @access public
	 */
	public function Hide() {
		// Not yet implemented
	}

	/**
	 * @access public
	 */
	public function isVisible() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string newName
	 * @ParamType newName string
	 */
	public function rename($newName) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string newName
	 * @ParamType newName string
	 */
	public function duplicate($newName) {
		// Not yet implemented
	}
}
?>