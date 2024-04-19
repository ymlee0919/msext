<?php
require_once(realpath(dirname(__FILE__)) . '/msExt_RectObj.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_Reference.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_Color.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_MsObj.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_ScaleBar.php');
require_once(realpath(dirname(__FILE__)) . '/msExt_Point.php');

require_once(realpath(dirname(__FILE__)) . '/msExt_LayerController.php');

/**
 * @access public
 */
class msExt_Map extends msExt_MsObj {
	/**
	 * @AttributeType string
	 */
	private $_map_name;
	/**
	 * @AttributeType msExt_Map
	 * Instance of the class
	 */
	private static $_instance = 0;
	
	/**
	 * @AttributeType string
	 */
	private $_map;
	
	/**
	 * @AttributeType msExt_RectObj
	 */
	private $_original_extent;

	/**
     * @ReturnType MsExt.msExt_Map
     * Constructor of the class
     */
    public function __construct()
    {
        // Get the map name
        $this->_map_name = $_SESSION['MSEXT_MAP_NAME'];
        // Build the map
        $this->_map = ms_newMapObj($this->_map_name);
        // Get the original extent of the map
        $this->_original_ext = new msExt_RectObj( $this->_map->extent->minx,
            $this->_map->extent->miny,
            $this->_map->extent->maxx,
            $this->_map->extent->maxy);

        $this->_inner_msObj = $this->_map;
    }
	
	/**
	 * Return the unique instance of the class
	 * @access public
	 * @return msExt_Map
	 */
	public static function GetInstance()
	{
		if (self::$_instance == 0)
            self::$_instance = new msExt_Map();

        return self::$_instance;
	}

	/**
	 * @access public
	 * @static
	 * @ReturnType string
	 */
	public static function GetTemporalMapName()
	{
		return ( "map_" . substr(session_id(), 0, 10) . "_" . date("d.m.y.H.i.s") . ".map");
	}

	/**
	 * @access public
	 * @static
	 * @ReturnType string
	 */
	public static function GetTemporalRefName()
	{
		return ( "ref_" . substr(session_id(), 0, 10) . "_" . date("d.m.y.H.i.s") . ".png");
	}

	/**
	 * @access public
	 * @param mixed aRectObj
	 * @return string
	 * @static
	 * @ParamType aRectObj mixed
	 * @ReturnType string
	 */
	public static function RectOBJtoStr($RectObj)
	{
        $_str = "";
        if(is_a($RectObj, 'msExt_RectObj'))
		    $_str = $RectObj->MinX() . " " . $RectObj->MinY(). " " . $RectObj->MaxX() . " " . $RectObj->MaxY();
        elseif(is_a($RectObj, 'rectObj'))
            $_str = $RectObj->minx . " " . $RectObj->miny . " " . $RectObj->maxx . " " . $RectObj->maxy;
        return $_str;
	}

	/**
	 * @access public
	 * @param string aStr
	 * @return msExt_RectObj
	 * @static
	 * @ParamType aStr string
	 * @ReturnType msExt_RectObj
	 */
	public static function StrToRectOBJ($str)
    {
        $_extent_of_rect = explode(" ", $str);
        $_rect = new msExt_RectObj(floatval($_extent_of_rect[0]), floatval($_extent_of_rect[1]), floatval($_extent_of_rect[2]), floatval($_extent_of_rect[3]));
        return $_rect;
	}

	/**
	 * @access public
	 * @param int width
	 * @param int height
	 * @param msExt_Point point
	 * @param msExt_RectObj aExt
	 * @return array
	 * @static
	 * @ParamType width int
	 * @ParamType height int
	 * @ParamType point msExt_Point
	 * @ParamType ext msExt_RectObj
	 * @ReturnType array
	 */
	public static function Img2Map($width, $height, $point, $ext)
    {
		$_result_point = null;
        if($point->GetX() && $point->GetY())
        {
            // find degrees per pixel
            $dpp_x = ($ext->MaxX() - $ext->MinX()) / $width;
            $dpp_y = ($ext->MaxY() - $ext->MinY()) / $height;

            // calculate map coordinates
            $_result_point = new msExt_Point($ext->MinX() + $dpp_x * $point->GetX(),
                $ext->MaxY() - $dpp_y * $point->GetY());
        }

        return $_result_point;
	}

	/**
	 * @access public
	 * @param string symbolName
	 * @return symbolObj
	 * @ParamType symbolName string
	 * @ReturnType symbolObj
	 */
	public function GetSymbolByName($symbolName)
    {
		$_index = $this->_map->getSymbolByName($symbolName);
        if($_index == -1)
            return null;
        $_symbol = $this->_map->getSymbolObjectById($_index);
        return new msExt_Symbol($_symbol);
	}

	/**
	 * @access public
	 * @param integer aSymbolId
	 * @return symbolObj
	 * @ParamType aSymbolId integer
	 * @ReturnType symbolObj
	 */
	public function GetSymbolObjectById($symbolId)
    {
        $_symbol = $this->_map->getSymbolObjectById($symbolId);
        return new msExt_Symbol($_symbol);
	}

	/**
	 * @access public
	 * @param string filename
	 * @return int
	 * @ParamType filename string
	 * @ReturnType int
	 */
	public function SetSymbolSet($filename)
    {
		$this->_map->setSymbolSet($filename);
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetNumSymbols()
    {
		return $this->_map->getNumSymbols();
	}

	/**
	 * @access public
	 * @param string filename
	 * @return int
	 * @ParamType filename string
	 * @ReturnType int
	 */
	public function SetFontSet($filename)
    {
		$this->_map->setFontSet($filename);
	}

	/**
	 * @access public
	 * @return MapServerExt.Image
	 * @ReturnType MapServerExt.Image
	 */
	public function Draw() {
		// TODO: Not yet implemented
	}

	/**
	 * @access public
	 * @return MapServerExt.Image
	 * @ReturnType MapServerExt.Image
	 */
	public function DrawLegend() {
		// TODO: Not yet implemented
	}

	/**
	 * @access public
	 * @return MapServerExt.Image
	 * @ReturnType MapServerExt.Image
	 */
	public function DrawReferenceMap() {
		// TODO: Not yet implemented
	}

	/**
	 * @access public
	 * @return MapServerExt.Image
	 * @ReturnType MapServerExt.Image
	 */
	public function DrawScaleBar() {
		// TODO: Not yet implemented
	}

	/**
	 * @access public
	 * @param integer index
	 * @return msExt_Layer
	 * @ParamType index integer
	 * @ReturnType msExt_Layer
	 */
	public function GetLayerById($index) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string name
	 * @return msExt_Layer
	 * @ParamType name string
	 * @ReturnType msExt_Layer
	 */
	public function GetLayerByName($name) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @return array
	 * @ReturnType array
	 */
	public function GetAllLayerNames() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetNumLayers() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param Layer aLayer
	 * @param int aNIndex
	 * @return int
	 * @ParamType aLayer Layer
	 * @ParamType aNIndex int
	 * @ReturnType int
	 */
	public function InsertLayer(Layer $aLayer, $aNIndex = 0) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param int aNIndex
	 * @return MapServerExt.Layer
	 * @ParamType aNIndex int
	 * @ReturnType MapServerExt.Layer
	 */
	public function RemoveLayer($aNIndex) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param int aLayerindex
	 * @return boolean
	 * @ParamType aLayerindex int
	 * @ReturnType boolean
	 */
	public function MoveLayerUp($aLayerindex) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param int layerIndex
	 * @return boolean
	 * @ParamType layerIndex int
	 * @ReturnType boolean
	 */
	public function MoveLayerDown($layerIndex) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @return array
	 * @ReturnType array
	 */
	public function GetLayersDrawingOrder() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param array layerIndex
	 * @return array
	 * @ParamType layerIndex array
	 * @ReturnType array
	 */
	public function SetLayersDrawingOrder(array $layerIndex) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string aGroupName
	 * @return array
	 * @ParamType aGroupName string
	 * @ReturnType array
	 */
	public function GetLayersIndexByGroup($groupName) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @return array
	 * @ReturnType array
	 */
	public function GetAllGroupNames() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string aGroupName
	 * @return boolean
	 * @ParamType aGroupName string
	 * @ReturnType boolean
	 */
	public function MoveGroupUp($aGroupName) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param string aGroupName
	 * @return boolean
	 * @ParamType aGroupName string
	 * @ReturnType boolean
	 */
	public function MoveGroupDown($aGroupName) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param double minx
	 * @param double miny
	 * @param double maxx
	 * @param double maxy
	 * @return void
	 * @ParamType minx double
	 * @ParamType miny double
	 * @ParamType maxx double
	 * @ParamType maxy double
	 * @ReturnType void
	 */
	public function SetMapExtent($minx, $miny, $maxx, $maxy)
    {
		$this->_map->setExtent($minx, $miny, $maxx, $maxy);
	}

    /**
     * @ReturnType void
     * Set the original extent to the map
     */
    public function SetOriginalExtent()
    {
        $this->_map->setExtent($this->_original_ext->MinX(),
            $this->_original_ext->MinY(),
            $this->_original_ext->MaxX(),
            $this->_original_ext->MaxY());
    }

    /**
     * @ReturnType string
     * Return the original map extent
     */
    public function GetOriginalExtent()
    {
        return self::RectOBJtoStr($this->_original_ext);
    }

	/**
	 * @access public
	 * @return void
	 * @ReturnType void
	 */
	public function SetExtent()
    {
        $extent_to_set = explode(" ", $_SESSION['MSEXT_MAP_EXTENT']);
        $this->_map->setExtent($extent_to_set[0], $extent_to_set[1], $extent_to_set[2], $extent_to_set[3]);
	}

	/**
	 * @access public
	 * @return msExt_RectObj
	 * @ReturnType msExt_RectObj
	 */
	public function GetMapExtent()
    {
		return new msExt_RectObj($this->_map->extent->minx,
            $this->_map->extent->miny,
            $this->_map->extent->maxx,
            $this->_map->extent->maxy);
	}

	/**
	 * @access public
	 * @param double rotationAngle
	 * @return int
	 * @ParamType rotationAngle double
	 * @ReturnType int
	 */
	public function SetRotation($rotationAngle)
    {
		$this->_map->setRotation($rotationAngle);
	}

	/**
	 * @access public
	 * @param int width
	 * @param int height
	 * @return int
	 * @ParamType width int
	 * @ParamType height int
	 * @ReturnType int
	 */
	public function SetSize($width, $height)
    {
		$this->_map->setSize($width, $height);
	}

    /**
     * @ReturnType void
     * @ParamType type string
     * @ParamType factor double
     * Zoom the map (In / Out)
     */
    public function Zoom($type = 'In', $factor = 2)
    {
        $_zoom_type = strtolower($type);
        $_zoom_factor = ($_zoom_type == 'out') ? $factor * -1 : $factor;

        $_extent = self::StrToRectOBJ($_SESSION['MSEXT_MAP_EXTENT']);

        $_xOffset = ( floatval($_extent->MaxX()) - floatval($_extent->MinX()) ) / ($_zoom_factor * 2);
        $_yOffset = ( floatval($_extent->MaxY()) - floatval($_extent->MinY()) ) / ($_zoom_factor * 2);

        $this->_map->setExtent($_extent->MinX() + $_xOffset, $_extent->MinY() + $_yOffset, $_extent->MaxX() - $_xOffset, $_extent->MaxY() - $_yOffset);
    }

    /**
     * @access public
     * @param int posX
     * @param int posY
     * @param int factor
     * @return int
     * @ParamType posX int
     * @ParamType posY int
     * @ParamType factor int
     * @ReturnType int
     */
	public function ZoomPoint($posX, $posY, $factor)
    {
        $_point = new msExt_Point($posX, $posY);
        $_extent = self::StrToRectOBJ($_SESSION['MSEXT_MAP_EXTENT']);

        if ($factor >= 1)
            $this->_map->zoompoint($factor, $_point->GetInnerMsObj(), $this->_map->width, $this->_map->height, $_extent->GetInnerMsObj());
        else
        {
            $_x = 0; $_y = 0;

            $_point = self::Img2Map($this->_map->width, $this->_map->height, $_point, $_extent);
            $_x = $_point->GetX();
            $_y = $_point->GetY();

            $_xOffset = floatval($_extent->MaxX()) - floatval($_extent->MinX());
            $_yOffset = floatval($_extent->MaxY()) - floatval($_extent->MinY());

            $this->_map->setExtent($_x - $_xOffset, $_y - $_yOffset, $_x + $_xOffset, $_y + $_yOffset);
        }
	}

    /**
     * @access public
     * @param msExt_RectObj rectangle
     * @return int
     * @ParamType rectangle msExt_RectObj
     * @ReturnType int
     */
	public function ZoomRectangle($rectangle)
    {
        $rect = msExt_Map::StrToRectOBJ($rectangle);
		$this->_map->setExtent($rect->MinX(), $rect->MinY(), $rect->MaxX(), $rect->MaxY());
	}

    /**
     * @access public
     * @param int scaleValue
     * @return int
     * @ParamType scaleValue int
     * @ReturnType int
     */
	public function ZoomScale($scaleValue)
    {
        $_extent = self::StrToRectOBJ($_SESSION['MSEXT_MAP_EXTENT']);
        $_point = new msExt_Point($this->_map->width / 2, $this->_map->height / 2);
        $this->_map->zoomscale($scaleValue, $_point->GetInnerMsObj(), $this->_map->width, $this->_map->height, $_extent->GetInnerMsObj(), $this->_original_extent);
	}

    /**
     * @ReturnType void
     * @ParamType posX double
     * @ParamType posY double
     * Pan a map to a point
     */
    public function Pan($posX, $posY)
    {
        $this->ZoomPoint($posX, $posY, 1);
    }

    /**
     * @ParamType posX
     * @ParamType posY
     * Locate the map in a given point
     */
    public function GotoPoint($posX, $posY)
    {
        $extent_to_set = explode(" ", $_SESSION['MSEXT_MAP_EXTENT']);

        $_xOffset = floatval($extent_to_set[2]) - floatval($extent_to_set[0]);
        $_yOffset = floatval($extent_to_set[3]) - floatval($extent_to_set[1]);

        $this->_map->setExtent(
            $posX - $_xOffset / 2, $posY - $_yOffset / 2, $posX + $_xOffset / 2, $posY + $_yOffset / 2);
    }

    /**
     * @ReturnType void
     * @ParamType width int
     * @ParamType $height int
     * Resize the map
     */
    public function Resize($width, $height)
    {
        $this->_map->setSize($width, $height);
    }

    /**
     * @ReturnType void
     * @ParamType scaleValue double
     * Change the scale of the map
     */
    public function ChangeScale($scaleValue)
    {
        $_extent = self::StrToRectOBJ($_SESSION['MSEXT_MAP_EXTENT']);
        $_map_ext = $this->_map->extent;
        $_point = new msExt_Point($this->_map->width / 2, $this->_map->height / 2);

        $this->_map->zoomscale($scaleValue, $_point->GetInnerMsObj(), $this->_map->width, $this->_map->height, $_extent->GetInnerMsObj(), $_map_ext);
    }

    /**
     * @ReturnType void
     * @ParamType scalePercent int
     * Change the scale of the map by the reference scale
     */
    public function ChangeReferenceScale($scalePercent)
    {
        $_ref_scale_percent = max($scalePercent, 0.0001);
        $_XOffset = ($this->_original_ext->MaxX() - $this->_original_ext->MinX()) * ($_ref_scale_percent / 100) / 2;
        $_YOffset = ($this->_original_ext->MaxY() - $this->_original_ext->MinY()) * ($_ref_scale_percent / 100) / 2;

        $_extent = self::StrToRectOBJ($_SESSION['MSEXT_MAP_EXTENT']);

        $_Xcenter = ($_extent->MaxX() + $_extent->MinX()) / 2;
        $_Ycenter = ($_extent->MaxY() + $_extent->MinY()) / 2;

        $this->_map->setextent($_Xcenter - $_XOffset, $_Ycenter - $_YOffset, $_Xcenter + $_XOffset, $_Ycenter + $_YOffset);
    }

	/**
	 * @access public
	 * @param pointObj aPoint
	 * @param int aMode
	 * @param double aBuffer
	 * @return int
	 * @ParamType aPoint pointObj
	 * @ParamType aMode int
	 * @ParamType aBuffer double
	 * @ReturnType int
	 */
	public function QueryByPoint(pointObj $aPoint, $aMode, $aBuffer) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param RectObj aRect
	 * @return int
	 * @ParamType aRect RectObj
	 * @ReturnType int
	 */
	public function QueryByRect(RectObj $aRect) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @param shapeObj aShape
	 * @return int
	 * @ParamType aShape shapeObj
	 * @ReturnType int
	 */
	public function QueryByShape(shapeObj $aShape) {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function Save()
    {
        $this->_map->save($this->_map_name);
	}

    /**
     * @access public
     * @param string filename
     * @param bool reload
     * @return int
     * @ParamType filename string
     * @ParamType reload bool
     */
    public function SaveAs($filename, $reload = false)
    {
        $_map_file_name = $_SESSION['APP_PATH'] . '/Map/Generated/Map/' . $filename;

        $this->_map->save($_map_file_name);

        if($reload === TRUE)
        {
            $this->_map->free();
            // Get the map name
            $this->_map_name = $_map_file_name;
            $_SESSION['MSEXT_MAP_NAME'] = $_map_file_name;

            // Build the map
            $this->_map = ms_newMapObj($this->_map_name);
            // Get the original extent of the map
            $this->_original_ext = new msExt_RectObj( $this->_map->extent->minx,
                $this->_map->extent->miny,
                $this->_map->extent->maxx,
                $this->_map->extent->maxy);

            $this->_inner_msObj = $this->_map;
        }
    }

	/**
	 * @access public
	 * @param string projParams
	 * @param boolean setUnitsAndExtents
	 * @return int
	 * @ParamType projParams string
	 * @ParamType setUnitsAndExtents boolean
	 * @ReturnType int
	 */
	public function SetProjection($projParams, $setUnitsAndExtents)
    {
		$this->_map->setProjection($projParams, $setUnitsAndExtents);
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetProjection()
    {
		return $this->_map->getProjection();
	}

    /**
     * @access public
     * @param string projParams
     * @param boolean setUnitsAndExtents
     * @return int
     * @ParamType projParams string
     * @ParamType setUnitsAndExtents boolean
     * @ReturnType int
     */
	public function SetWKTProjection($projParams, $setUnitsAndExtents)
    {
		$this->_map->setWKTProjection($projParams, $setUnitsAndExtents);
	}

	/**
	 * @access public
	 * @param string entry
	 * @return string
	 * @ParamType entry string
	 * @ReturnType string
	 */
	public function GetMetaData($entry)
    {
		$this->_map->getMetaData($entry);
	}

	/**
	 * @access public
	 * @param string entry
	 * @param string value
	 * @return int
	 * @ParamType entry string
	 * @ParamType value string
	 * @ReturnType int
	 */
	public function SetMetaData($entry, $value)
    {
		$this->_map->setMetaData($entry, $value);
	}

	/**
	 * @access public
	 * @param string entry
	 * @return int
	 * @ParamType entry string
	 * @ReturnType int
	 */
	public function RemoveMetaData($entry)
    {
		$this->_map->removeMetaData($entry);
	}

	/**
	 * @access public
	 * @return void
	 * @ReturnType void
	 */
	public function ClearMetadata()
    {
		// TODO: Not yet implemented
	}

	/**
	 * @access public
	 * @return string
	 * @ReturnType string
	 */
	public function GetName()
    {
		return $this->_map->name;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetWidth()
    {
		return $this->_map->width;
	}

	/**
	 * @access public
	 * @return int
	 * @ReturnType int
	 */
	public function GetHeight()
    {
		return $this->_map->height;
	}

	/**
	 * @access public
	 * @return double
	 * @ReturnType double
	 */
	public function GetScale()
    {
		return $this->_map->scaledenom;
	}

	/**
	 * @access public
	 * @return msExt_Reference
	 * @ReturnType msExt_Reference
	 */
	public function GetReference()
    {
		return new msExt_Reference($this);
	}

	/**
	 * @access public
	 * @return MapServerExt.ScaleBar
	 * @ReturnType MapServerExt.ScaleBar
	 */
	public function GetScaleBar()
    {
		return new msExt_ScaleBar($this->_map->scalebar);
	}

	/**
	 * @access public
	 * @return MapServerExt.Legend
	 * @ReturnType MapServerExt.Legend
	 */
	public function GetLegend() {
		// Not yet implemented
	}

	/**
	 * @access public
	 * @return MapServerExt.WebObj
	 * @ReturnType MapServerExt.WebObj
	 */
	public function GetWeb() {
		// Not yet implemented
	}
}
?>