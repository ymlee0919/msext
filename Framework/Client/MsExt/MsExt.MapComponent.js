MsExt.MapComponent = function (MapComponentId)
{
    this.map_container = MapComponentId;
    this.drawing_component = null;
    this.pan_component = null;
    this.shape = null;
    this.pan_component = null;
    this.back_image = null;
    this.last_function = null;
    this.last_args = null;
    this.extent = null;
    this.cursor = 'default';

    this.pixToGeo = function()
    {
        var args = arguments,
        x = args[0],
        y = Ext.get(this.map_container).getHeight(true) - args[1];
        return {
            x : pix2Geo(x, 0, Ext.get(this.map_container).getWidth(true), this.extent.MinX(), this.extent.MaxX()),
            y : pix2Geo(y, 0, Ext.get(this.map_container).getHeight(true), this.extent.MinY(), this.extent.MaxY())
        }
    }
    
    this.geoToPix = function()
    {
        var args = arguments,
        x = args[0],
        y = args[1];
        return {
            x : geo2Pix(x,  this.extent.MinX(), this.extent.MaxX(), 0,Ext.get(this.map_container).getWidth(true)),
            y : Ext.get(this.map_container).getHeight(true) - geo2Pix(y, this.extent.MinY(), this.extent.MaxY(), 0, Ext.get(this.map_container).getHeight(true))
        }
    }
	
    // Init the object
    this.Init = function(){
        var me = this;
        Ext.get(this.map_container).on('click', function(eventArg, element, opts){
            if(me.shape == null) return;
            if(typeof(me.shape.OnClick) == 'function') me.shape.OnClick(eventArg);
        });
        Ext.get(this.map_container).on('mousedown', function(eventArg, element, opts){
            if(me.shape == null) return;
            if(typeof(me.shape.OnMouseDown) == 'function') me.shape.OnMouseDown(eventArg);
        });
        Ext.get(this.map_container).on('mouseup', function(eventArg, element, opts){
            if(me.shape == null) return;
            if(typeof(me.shape.OnMouseUp) == 'function') me.shape.OnMouseUp(eventArg);
        });
        Ext.get(this.map_container).on('mousemove', function(eventArg, element, opts){
            me.onMouseMove(eventArg, element);
            if(me.shape == null) return;
            if(typeof(me.shape.OnMouseMove) == 'function') me.shape.OnMouseMove(eventArg);
        });
        Ext.get(this.map_container).on('dblclick', function(eventArg, element, opts){
            if(me.shape == null) return;
            if(typeof(me.shape.OnDoubleClick) == 'function') me.shape.OnDoubleClick(eventArg);
        });
		//Ext.get(this.map_container).on('mousewheel', function(a,b,c,d,e){
		//	console.log(a.getWheelDelta( ));
		//	console.log(Ext.encode(a.getWheelDeltas( )));
		//});
		//document.getElementById(this.map_container).onmousewheel = function (){
		//	console.log('scroll...');
		//}
    }
	
	this.InitMouseScroll = function()
	{
		var me = this;
	}
    
    this.onMouseMove = function(eventObject, target)
    {
        var x = eventObject.getX() - Ext.get(target).getLeft();
        var y = eventObject.getY() - Ext.get(target).getTop();
        var geo = this.pixToGeo(x, y);
        Ext.getCmp('x_coord').setText(geo.x);
        Ext.getCmp('y_coord').setText(geo.y);
    }
    
    this.SetExtent = function(str_extent)
    {
        var _tokens = str_extent.split(' ');
        this.extent = new Rectangle(parseFloat(_tokens[0]), parseFloat(_tokens[1]), parseFloat(_tokens[2]), parseFloat(_tokens[3]));
    }
	
    this.Update = function(){
        var args = arguments, url_image = args[0], extent = args[1];
        var _tokens = extent.split(' ');
        this.extent = new Rectangle(parseFloat(_tokens[0]), parseFloat(_tokens[1]), parseFloat(_tokens[2]), parseFloat(_tokens[3]));
        this.SwapBackImage(url_image);
    }
	
    this.SetBackImage = function(){
        var args = arguments, url_image = args[0], extent = args[1];
        this.back_image = url_image;
        var _tokens = extent.split(' ');
        this.extent = new Rectangle(parseFloat(_tokens[0]), parseFloat(_tokens[1]), parseFloat(_tokens[2]), parseFloat(_tokens[3]));
        Ext.get(this.map_container).setStyle({
            'background-image' : 'url(' + this.back_image + ')'
            });
    }
	
    this.SwapBackImage = function(){
        var fn = this.last_function, args = this.last_args, fn_args = arguments, url_image = fn_args[0];
        this.Clean(false);
        
        Ext.create('Ext.Component',{
            id : this.map_container + '_front_img_id',
            renderTo : this.map_container,
            width : '100%',
            height : '100%',
            style : {
                'z-index' : 5,
                position : 'absolute',
                'background-image' : 'url(' + this.back_image + ')'
                }
            }).show();

        this.back_image = url_image;
        
        Ext.get(this.map_container).setStyle({
            'background-image' : 'url(' + this.back_image + ')'
            });

        Ext.get(this.map_container + '_front_img_id').fadeOut({
            from : { opacity : 1},
            to : { opacity : 0 },
            easing: 'easeIn',
            duration: 600,
            remove: true,
            useDisplay: false,
            callback : function()
            {
                this.last_function = fn;
                this.last_args = args;
                if(this.last_function)this.Clean(true);
            },scope : this
        });
    }

    this.create_drawing_componet = function(){
        if(this.pan_component != null){
            Ext.get(this.pan_component).destroy();
            document.getElementById(this.map_container).innerHTML = "";
            this.pan_component = null;
        }
        if(this.drawing_component != null) return;
        this.drawing_component = this.map_container + '_drawing_component_id';
        Ext.create('Ext.draw.Component',{
            id : this.drawing_component,
            width : '100%',
            height : '100%',
            viewBox : false,
            renderTo : this.map_container
            }).show();
    }

    this.create_pan_componet = function(){
        if(this.drawing_component != null){
            Ext.get(this.drawing_component).destroy();
            document.getElementById(this.map_container).innerHTML = "";
            this.drawing_component = null;
        }
        if(this.pan_component != null) return;
        this.pan_component = this.map_container + '_pan_component_id';
        Ext.create('Ext.Component',{
            id : this.pan_component,
            renderTo : this.map_container,
            width : '100%',
            height : '100%',
            style : {
                position : 'relative',
                opacity : .4,
                'z-index':2,
                'background-image' : 'url(' + this.back_image + ')'
                }
            }).show();
    }
    // Circle treatment
    this.OnNewCircle = function(){
        var fn_args = arguments, args = fn_args[0];
        this.create_drawing_componet();
        var listeners = (typeof(args) == 'object') ? args.listeners : null;
        var scope = (typeof(args) == 'object') ? args.scope : null;
        var _cursor = (typeof(args) == 'object') ? ((typeof(args.cursor)=='string')? args.cursor : 'auto') : null;
        Ext.get(this.map_container).setStyle({cursor:_cursor});
        this.shape = new CircleDrawer(this, this.drawing_component, listeners, scope);
        this.last_function = this.OnNewCircle;
        this.last_args = args;
    }
    // Rectangle treatment
    this.OnNewRectangle = function(){
        var fn_args = arguments, args = fn_args[0];
        this.create_drawing_componet();
        var listeners = (typeof(args) == 'object') ? args.listeners : null;
        var scope = (typeof(args) == 'object') ? args.scope : null;
        var _cursor = (typeof(args) == 'object') ? ((typeof(args.cursor)=='string')? args.cursor : 'crosshair') : null;
        Ext.get(this.map_container).setStyle({cursor:_cursor});
        this.shape = new RectangleDrawer(this, this.drawing_component, listeners, scope);
        this.last_function = this.OnNewRectangle;
        this.last_args = args;
    }
    // LineString treatment
    this.OnNewLineString = function(){
        var fn_args = arguments, args = fn_args[0];
        this.create_drawing_componet();
        var listeners = (typeof(args) == 'object') ? args.listeners : null;
        var scope = (typeof(args) == 'object') ? args.scope : null;
        var _cursor = (typeof(args) == 'object') ? ((typeof(args.cursor)=='string')? args.cursor : 'crosshair') : null;
        Ext.get(this.map_container).setStyle({cursor:_cursor});
        this.shape = new LineStringDrawer(this, this.drawing_component, listeners, scope);
        this.last_function = this.OnNewLineString;
        this.last_args = args;
    }
    // Polygon treatment
    this.OnNewPolygon = function(args){
        var fn_args = arguments, args = fn_args[0];
        this.create_drawing_componet();
        var listeners = (typeof(args) == 'object') ? args.listeners : null;
        var scope = (typeof(args) == 'object') ? args.scope : null;
        this.shape = new PolygonDrawer(this, this.drawing_component, listeners, scope);
        this.last_function = this.OnNewPolygon;
        this.last_args = args;
    }
    // Point treatment
    this.OnNewPoint = function(){
        var fn_args = arguments, args = fn_args[0];
        this.create_drawing_componet();
        var listeners = (typeof(args) == 'object') ? args.listeners : null;
        var scope = (typeof(args) == 'object') ? args.scope : null;
        var _cursor = (typeof(args) == 'object') ? ((typeof(args.cursor)=='string')? args.cursor : 'pointer') : null;
        Ext.get(this.map_container).setStyle({cursor:_cursor});
        this.shape = new PointDrawer(this, this.drawing_component, listeners, scope);
        this.last_function = this.OnNewPoint;
        this.last_args = args;
    }
    // Pan treatment
    this.OnPan = function(){
        var fn_args = arguments, args = fn_args[0];
        this.create_pan_componet();
        var listeners = (typeof(args) == 'object') ? args.listeners : null;
        var scope = (typeof(args) == 'object') ? args.scope : null;
        var _cursor = (typeof(args) == 'object') ? ((typeof(args.cursor)=='string')? args.cursor : 'move') : null;
        Ext.get(this.map_container).setStyle({cursor:_cursor});
        this.shape = new Pan(this, this.pan_component, listeners, scope);
        this.last_function = this.OnPan;
        this.last_args = args;
    }
    //------------------
    // Clean the surface
    this.Clean = function(restart_tool)
    {
        if(this.drawing_component != null){
            Ext.getCmp(this.drawing_component).surface.removeAll(true);
            Ext.get(this.drawing_component).destroy();
            this.drawing_component = null;
        }
        if(this.pan_component != null){
            Ext.get(this.pan_component).destroy();
            this.pan_component = null;
        }
        this.shape = null;
        if(restart_tool){
            if(typeof(this.last_function) == 'function')this.last_function(this.last_args);
            else{
                this.last_args = null;
                this.last_function = null;
            }
        }
        else{
            this.last_args = null;
            this.last_function = null;
        }
    }
}