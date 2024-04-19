// Object to manipulate a circle drawing
function CircleDrawer(Owner, MapComponentId, Events, Scope)
{
    // Component to draw the circle
    this.drawing_component = MapComponentId;
    // Owner of the component
    this.owner = Owner;
    // Circle to draw
    this.component = null;
    // Flag to indidate if 
    this.drawing = false;
    // Initial x position
    this._x = -1;
    // Initial y position
    this._y = -1;
    // X offset
    this._dx = 0;
    // Y offset
    this._dy = 0;
	
    //// Events
    this.begin = null;
    this.resize = null;
    this.end = null;
	
    if(typeof(Events) == 'object')
    {
        var item;
        for(item in Events)
        {
            switch(item.toString().toLowerCase())
            {
                case 'begindrawing':
                case 'begin_drawing':
                case 'begin':
                    if(typeof(Scope) != 'undefined') this.begin = Ext.Function.bind(Events[item], Scope);
                    else this.begin = Events[item];
                    break;

                case 'drawing':
                case 'resize':
                    if(typeof(Scope) != 'undefined') this.resize = Ext.Function.bind(Events[item], Scope);
                    else this.resize = Events[item];
                    break;

                case 'enddrawing':
                case 'end_drawing':
                case 'end':
                    if(typeof(Scope) != 'undefined') this.end = Ext.Function.bind(Events[item], Scope);
                    else this.end = Events[item];
                    break;
            }
        }
    }
	
    this.OnMouseDown = function(eventArg)
    {
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();
		
        this.component = Ext.create('Ext.draw.Sprite',{
            type: 'circle',
            fill: 'yellow',
            radius: 0,
            x: X,
            y: Y,
            stroke : 'black',
            "stroke-width" : 2,
            opacity : 0.4
        });
		
        Ext.getCmp(this.drawing_component).surface.add(this.component);
        this.drawing = true;
        this._x = X;
        this._y = Y;
        this._dx = 0;
        this._dy = 0;

        if(typeof(this.begin) == 'function')
            this.begin(X, Y);
    }
	
    this.OnMouseUp = function(eventArg)
    {
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();

        this._dx = Math.abs(this._x - X);
        this._dy = Math.abs(this._y - Y);
        var rad = Math.sqrt(Math.pow(this._dx,2) + Math.pow(this._dy, 2));
		
        this._x = -1;
        this._y = -1;
        this._dx = 0;
        this._dy = 0;
        this.component = null;
        this.drawing = false;
		
        if(typeof(this.end) == 'function')
            this.end(X, Y, rad);
    }
	
    this.OnMouseMove = function(eventArg)
    {
        if(!this.drawing) return;
		
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();

        this._dx = Math.abs(this._x - X);
        this._dy = Math.abs(this._y - Y);
        var rad = Math.sqrt(Math.pow(this._dx,2) + Math.pow(this._dy, 2));
		
        this.component.setAttributes({
            radius : rad
        }, true);
		
        if(typeof(this.resize) == 'function')
            this.resize(X, Y, rad);
    }
	
    this.OnDoubleClick = function(eventArg)
    {
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();

        this._dx = Math.abs(this._x - X);
        this._dy = Math.abs(this._y - Y);
        var rad = Math.sqrt(Math.pow(this._dx,2) + Math.pow(this._dy, 2));
		
        this._x = -1;
        this._y = -1;
        this._dx = 0;
        this._dy = 0;
        this.component = null;
        this.drawing = false;
		
        if(typeof(this.end) == 'function')
            this.end(X, Y, rad);
    }
}

// Object to manipulate a rectangle drawing
function RectangleDrawer(Owner, MapComponentId, Events, Scope)
{
    // Component to draw the rectangle
    this.drawing_component = MapComponentId;
    // Owner of the component
    this.owner = Owner;
    // Rectangle to draw
    this.component = null;
    // Flag to indidate if 
    this.drawing = false;
    // Initial x position
    this._x = -1;
    // Initial y position
    this._y = -1;
    // Geom x
    this._geoX = -1;
    this._geoY = -1;
    // X offset
    this._dx = 0;
    // Y offset
    this._dy = 0;
	
    //// Events
    this.begin = null;
    this.resize = null;
    this.end = null;
	
    if(typeof(Events) == 'object')
    {
        var item;
        for(item in Events)
        {
            
            switch(item.toString().toLowerCase())
            {
                case 'begindrawing':
                case 'begin_drawing':
                case 'begin':
                    if(typeof(Scope) != 'undefined') this.begin = Ext.Function.bind(Events[item], Scope);
                    else this.begin = Events[item];
                    break;

                case 'drawing':
                case 'resize':
                    if(typeof(Scope) != 'undefined') this.resize = Ext.Function.bind(Events[item], Scope);
                    else this.resize = Events[item];
                    break;

                case 'enddrawing':
                case 'end_drawing':
                case 'end':
                    if(typeof(Scope) != 'undefined') this.end = Ext.Function.bind(Events[item], Scope);
                    else this.end = Events[item];
                    break;
            }
        }
    }
	
    this.OnMouseDown = function(eventArg)
    {
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();
		
        this.component = Ext.create('Ext.draw.Sprite',{
            type: 'rect',
            fill: 'yellow',
            width : 0,
            height : 0,
            x: X,
            y: Y,
            stroke : 'black',
            "stroke-width" : 2,
            opacity : 0.4
        });
		
        Ext.getCmp(this.drawing_component).surface.add(this.component);
        this.drawing = true;
        this._x = X;
        this._y = Y;
        this._dx = 0;
        this._dy = 0;
		
        var geo_pos = this.owner.pixToGeo(X,Y);
        this._geoX = geo_pos.x;
        this._geoY = geo_pos.y;
		
        if(typeof(this.begin) == 'function')this.begin(geo_pos.x, geo_pos.y);
    }
	
    this.OnMouseUp = function(eventArg)
    {
        if(!this.drawing) return;
        
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();
		
        var geo_pos = this.owner.pixToGeo(X,Y);
        var _geoX = geo_pos.x;
        var _geoY = geo_pos.y;
		
        var _minx = Math.min(this._geoX, _geoX);
        var _miny = Math.min(this._geoY, _geoY);
		
        var _maxx = Math.max(this._geoX, _geoX);
        var _maxy = Math.max(this._geoY, _geoY);

        this._x = -1;
        this._y = -1;
        this._dx = 0;
        this._dy = 0;
        this.component = null;
        this.drawing = false;
		
        if(typeof(this.end) == 'function')this.end(_minx, _miny, _maxx, _maxy);
    }
	
    this.OnMouseMove = function(eventArg)
    {
        if(!this.drawing) return;
        // Drawing
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();
        var geo_pos = this.owner.pixToGeo(X,Y);
		
        this._dx = Math.abs(this._x - X);
        this._dy = Math.abs(this._y - Y);
		
        if(X > this._x) X = this._x;
        if(Y > this._y) Y = this._y;
		
        this.component.setAttributes({
            width : this._dx,
            height : this._dy,
            x: X,
            y: Y
        }, true);
		
        // Get geom coordenates
		
        var _geoX = geo_pos.x;
        var _geoY = geo_pos.y;
        var _minx = Math.min(this._geoX, _geoX);
        var _miny = Math.min(this._geoY, _geoY);
        var _maxx = Math.max(this._geoX, _geoX);
        var _maxy = Math.max(this._geoY, _geoY);
		
        if(typeof(this.resize) == 'function')
            this.resize(_minx, _miny, _maxx, _maxy);
    }
}

// Object to manipulate a line drawing
function LineStringDrawer(Owner, MapComponentId, Events, Scope)
{
    // Component to draw the line
    this.drawing_component = MapComponentId;
    // Owner of the component
    this.owner = Owner;
    // Line to draw
    this.component = null;
    // Flag to indidate if 
    this.drawing = false;
    // Array of points
    this.points = null;
	
    //// Events
    this.begin = null;
    this.point_added = null;
    this.end = null;
	
    if(typeof(Events) == 'object')
    {
        var item;
        for(item in Events)
        {
            switch(item.toString().toLowerCase())
            {
                case 'begindrawing':
                case 'begin_drawing':
                case 'begin':
                    if(typeof(Scope) != 'undefined') this.begin = Ext.Function.bind(Events[item], Scope);
                    else this.begin = Events[item];
                    break;

                case 'add':
                case 'added':
                case 'point_add':
                case 'pointadded':
                case 'point_added':
                    if(typeof(Scope) != 'undefined') this.point_added = Ext.Function.bind(Events[item], Scope);
                    else this.point_added = Events[item];
                    break;

                case 'enddrawing':
                case 'end_drawing':
                case 'end':
                    if(typeof(Scope) != 'undefined') this.end = Ext.Function.bind(Events[item], Scope);
                    else this.end = Events[item];
                    break;
            }
        }
    }
	
    // function to built the line path
    this.BuildLine = function(Points, LastPoint)
    {
        var i = 0, str = "";
		
        if(Points.length == 1 && LastPoint != null)
            return "M" + Points[i].x.toString() + " " + Points[i].y.toString() + " L" + LastPoint.x.toString() + " " + LastPoint.y.toString();

        for(; i < Points.length - 1; i++)
            str += "M" + Points[i].x.toString() + " " + Points[i].y.toString() + " L" + Points[i+1].x.toString() + " " + Points[i+1].y.toString();
        if(LastPoint != null)
            str += "M" + Points[i].x.toString() + " " + Points[i].y.toString() + " L" + LastPoint.x.toString() + " " + LastPoint.y.toString();
		
        return str;
    }
		
    this.OnClick = function(eventArg)
    {
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();
			
        if(!this.drawing)
        {
            this.component = Ext.create('Ext.draw.Sprite',{
                type: 'path',
                stroke : 'black',
                "stroke-width" : 2,
                opacity : 0.4,
                path : "M0 0 L0 0"
            });
			
            Ext.getCmp(this.drawing_component).surface.add(this.component);
            this.drawing = true;
            this.points = [{
                x : X, 
                y: Y
            }];
        }
        else
        {
            this.points.push({
                x : X, 
                y: Y
            });
            var str_path = this.BuildLine(this.points, null);
			
            this.component.setAttributes({
                path : str_path
            }, true);
        }
    }
	
    this.OnDoubleClick = function(eventArg)
    {
        if(this.drawing)
        {
            this.component = null;
            this.drawing = false;
            delete this.points;
            this.points = null;
        }
    }
	
    this.OnMouseMove = function(eventArg)
    {
        if(!this.drawing) return;
		
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();
        var str_path = this.BuildLine(this.points, {
            x : X, 
            y: Y
        });
		
        this.component.setAttributes({
            path : str_path
        }, true);
    }
}

// Object to manipulate a polygon drawing
function PolygonDrawer(Owner, MapComponentId, Events, Scope)
{
    // Component to draw the polygon
    this.drawing_component = MapComponentId;
    // Owner of the component
    this.owner = Owner;
    // Polygon to draw
    this.component = null;
    // Flag to indidate if 
    this.drawing = false;
    // Array of points
    this.points = null;
    
    //// Events
    this.begin = null;
    this.point_added = null;
    this.end = null;
	
    if(typeof(Events) == 'object')
    {
        var item;
        for(item in Events)
        {
            switch(item.toString().toLowerCase())
            {
                case 'begindrawing':
                case 'begin_drawing':
                case 'begin':
                    if(typeof(Scope) != 'undefined') this.begin = Ext.Function.bind(Events[item], Scope);
                    else this.begin = Events[item];
                    break;

                case 'add':
                case 'added':
                case 'point_add':
                case 'pointadded':
                case 'point_added':
                    if(typeof(Scope) != 'undefined') this.point_added = Ext.Function.bind(Events[item], Scope);
                    else this.point_added = Events[item];
                    break;

                case 'enddrawing':
                case 'end_drawing':
                case 'end':
                    if(typeof(Scope) != 'undefined') this.end = Ext.Function.bind(Events[item], Scope);
                    else this.end = Events[item];
                    break;
            }
        }
    }
	
    // function to built the line path
    this.BuildLine = function(Points, LastPoint)
    {
        var i = 0, str = "";
		
        if(Points.length == 1 && LastPoint != null)
            return "M" + Points[i].x.toString() + " " + Points[i].y.toString() + " L" + LastPoint.x.toString() + " " + LastPoint.y.toString();

        str = "M" + Points[i].x.toString() + " " + Points[i].y.toString() + " L" ;
        for(i = 1; i < Points.length; i++)
            str += " " + Points[i].x.toString() + " " + Points[i].y.toString();
		
        if(LastPoint != null)
            str +=  " " + LastPoint.x.toString() + " " + LastPoint.y.toString();
        str += " z";
		
        return str;
    }
		
    this.OnClick = function(eventArg)
    {
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();
			
        if(!this.drawing)
        {
            this.component = Ext.create('Ext.draw.Sprite',{
                type: 'path',
                stroke : 'black',
                "stroke-width" : 2,
                opacity : 0.4,
                fill : 'yellow',
                path : "M0 0 L0 0"
            });
			
            Ext.getCmp(this.drawing_component).surface.add(this.component);
            this.drawing = true;
            this.points = [{
                x : X, 
                y: Y
            }];
        }
        else
        {
            this.points.push({
                x : X, 
                y: Y
            });
            var str_path = this.BuildLine(this.points, null);
			
            this.component.setAttributes({
                path : str_path
            }, true);
        }
    }
	
    this.OnDoubleClick = function(eventArg)
    {
        if(this.drawing)
        {
            this.component = null;
            this.drawing = false;
            delete this.points;
            this.points = null;
        }
    }
	
    this.OnMouseMove = function(eventArg)
    {
        if(!this.drawing) return;
		
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();
        var str_path = this.BuildLine(this.points, {
            x : X, 
            y: Y
        });
		
        this.component.setAttributes({
            path : str_path
        }, true);
    }
}

// Object to manipulate a point drawing
function PointDrawer(Owner, MapComponentId, Events, Scope)
{
    // Component to draw the point
    this.drawing_component = MapComponentId;
    // Owner of the component
    this.owner = Owner;
    // Point to draw
    this.component = null;
	
    //// Events
    this.on_point = null;
	
    if(typeof(Events) == 'object')
    {
        var item;
        for(item in Events)
        {
            switch(item.toString().toLowerCase())
            {
                case 'point':
                case 'on_point':
                case 'draw':
                case 'point_draw':
                    if(typeof(Scope) != 'undefined') this.on_point = Ext.Function.bind(Events[item], Scope);
                    else this.on_point = Events[item];
                    break;
            }
        }
    }

    this.OnClick = function(eventArg)
    {
        var X = eventArg.getX() - Ext.get(this.drawing_component).getX();
        var Y = eventArg.getY() - Ext.get(this.drawing_component).getY();

        this.component = Ext.create('Ext.draw.Sprite',{
            type: 'text',
            font : 'font:Arial, Helvetica, sans-serif; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold',
            text : '+',
            x: 0,
            y: 0,
            fill : 'yellow',
            stroke : 'darkblue',
            "stroke-width" : 2,
            opacity : 0.6
        });

        Ext.getCmp(this.drawing_component).surface.add(this.component);
        this.component.setAttributes({
            x: X-4, 
            y: Y
        }, true);
        //Y = eventArg.getY() - Ext.get(this.drawing_component).getY();
        if(typeof(this.on_point) == 'function')this.on_point(X,Y);
    }
	
    this.OnMouseMove = function(eventArg){}
	
    this.OnDoubleClick = function(eventArg)
    {
        this.OnClick(eventArg);
    }
}

// Object to manipulate a drag
function Pan(Owner, MapComponentId, Events, Scope)
{
    // Component to pan
    this.drawing_component = MapComponentId;
    // Owner of the component
    this.owner = Owner;
    // Pan component
    this.component = null;
    // Flag to indidate if 
    this.drawing = false;
    // Initial x position
    this._x = -1;
    // Initial y position
    this._y = -1;
    // X offset
    this._dx = 0;
    // Y offset
    this._dy = 0;
	
    //// Events
    this.begin = null;
    this.move = null;
    this.end = null;
	
    if(typeof(Events) == 'object')
    {
        var item;
        for(item in Events)
        {
            switch(item.toString().toLowerCase())
            {
                case 'begindrag':
                case 'begin_drag':
                case 'begin':
                    if(typeof(Scope) != 'undefined') this.begin = Ext.Function.bind(Events[item], Scope);
                    else this.begin = Events[item];
                    break;

                case 'move':
                case 'mouse_move':
                case 'mousemove':
                case 'ondrag':
                case 'on_drag':
                case 'drag':
                    if(typeof(Scope) != 'undefined') this.move = Ext.Function.bind(Events[item], Scope);
                    else this.move = Events[item];
                    break;

                case 'enddrag':
                case 'end_drag':
                case 'end':
                    if(typeof(Scope) != 'undefined') this.end = Ext.Function.bind(Events[item], Scope);
                    else this.end = Events[item];
                    break;
            }
        }
    }
    this.OnMouseDown = function(eventArg)
    {
        this._x = Ext.get(this.drawing_component).getX();
        this._y = Ext.get(this.drawing_component).getY();
		
        this._dx = eventArg.getX();
        this._dy = eventArg.getY();
		
        this.drawing = true;
    }
	
    this.OnMouseMove = function(eventArg)
    {
        if(!this.drawing) return;
		
        var X = eventArg.getX() - this._x;
        var Y = eventArg.getY() - this._y;

        Ext.get(this.drawing_component).setStyle({
            left : (X + this._x - this._dx),
            top : (Y + this._y - this._dy)
        });
        Ext.get(this.drawing_component).repaint();
    }
	
    this.OnMouseUp = function(eventArg)
    {
        this.drawing = false;

        var X = eventArg.getX();
        var Y = eventArg.getY();
		
        var _x = ((Ext.get(this.drawing_component).getWidth(true)) / 2) - (X - this._dx);
        var _y = ((Ext.get(this.drawing_component).getHeight(true)) / 2) - (Y - this._dy);
        if(typeof(this.end) == 'function')
            this.end(_x, _y);
		
    }
}