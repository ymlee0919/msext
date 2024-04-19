//--------------------------------------------
// Feature: Circle
function Circle(X, Y, Radio)
{
	this._x = X;
	this._y = Y;
	this._r = Radio; 
}

// Return the area of the circle
Circle.prototype.Area = function()
{
	return Math.PI * this._r * this._r;
}

// Return the length of the circle
Circle.prototype.GetLength = function()
{
	return Math.PI * this._r;
}

// Get the radio of the circle
Circle.prototype.GetRadio = function()
{
	return this._r;
}

// Get the center of the circle
Circle.prototype.GetCenter = function()
{
	return {x : this._x, y : this._y};
}

//---------------------------------------------
// Feature : Rectangle
function Rectangle(MinX, MinY, MaxX, MaxY)
{
	this._minx = MinX;
	this._miny = MinY;
	this._maxx = MaxX;
	this._maxy = MaxY;
}

// Get the area of the rectangle
Rectangle.prototype.GetArea = function()
{
	return (this._maxx - this._minx) * (this._maxy - this._miny);
}

// Get the length of the rectangle
Rectangle.prototype.GetLength = function()
{
	return 2 * ((this._maxx - this._minx) + (this._maxy - this._miny));
}

// Get the with of the rectangle
Rectangle.prototype.GetWidth = function()
{
	return (this._maxx - this._minx);
}

// Get the with of the rectangle
Rectangle.prototype.GetHeight = function()
{
	return (this._maxy - this._miny);
}

// Return the min x
Rectangle.prototype.MinX = function()
{
	return this._minx;
}

// Return the min y
Rectangle.prototype.MinY = function()
{
	return this._miny;
}

// Return the max x
Rectangle.prototype.MaxX = function()
{
	return this._maxx;
}

// Return the max y
Rectangle.prototype.MaxY = function()
{
	return this._maxy;
}

// Get the extent of the rectangle
Rectangle.prototype.GetExtent = function()
{
	return this._minx.toString() + ' ' + this._miny.toString() + ' ' + this._maxx.toString() + ' ' + this._maxy.toString()
}

// Get the WKT representation of the rectangle
Rectangle.prototype.GetWKT = function()
{
	return "POLYGON((" + this._minx.toString() + ' ' + this._miny.toString() + "," + this._maxx.toString() + ' ' + this._miny.toString() + "," + this._maxx.toString() + ' ' + this._maxy.toString() + "," + this._minx.toString() + ' ' + this._maxy.toString() + "," + "))";
}

//------------------------------------------
// Linestring
function LineString()
{
	this._vertex = new Array();
}

// Add a new vertex
LineString.prototype.AddVertex = function(X, Y)
{
	this._vertex.push({x : X, y : Y});
}

// Get the count of vertex
LineString.prototype.VertexCount = function()
{
	return this._vertex.length;
}

// Get a vertex given the index
LineString.prototype.GetVertex = function(index)
{
	if(index >= this._vertex.length)
		return null;
	return this._vertex[index];
}

// Get the list of vertex
LineString.prototype.GetVertexList = function()
{
	return this._vertex;
}

// Get the length of all the linestring
LineString.prototype.GetLength = function()
{
	if(this._vertex.length < 2)
		return 0;
	var i = 0, _length = 0;
	for(;i < this._vertex.length - 1; i++)
		_length += Math.sqrt( Math.pow(this._vertex[i].x - this._vertex[i + 1].x, 2) + Math.pow(this._vertex[i].y - this._vertex[i + 1].y, 2));
	return _length;
}

// Get the WKT representation of the LineString
LineString.prototype.GetWKT = function()
{
	var WKTString = new String(), i = 0;
	for (;i<this._vertex.length;i++)
		coords += this._vertex[i].x + " " + this._vertex[i].y + ",";
	coords = coords.substring(0, coords.length -1);
	return "LINESTRING(" + coords + ")";
}

//------------------------------------------
// Polygon
function Polygon()
{
	this._vertex = new Array();
}

// Add a new vertex
Polygon.prototype.AddVertex = function(X, Y)
{
	this._vertex.push({x : X, y : Y});
}

// Get the count of vertex
Polygon.prototype.VertexCount = function()
{
	return this._vertex.length;
}

// Get a vertex given the index
Polygon.prototype.GetVertex = function(index)
{
	if(index >= this._vertex.length)
		return null;
	return this._vertex[index];
}

// Get the list of vertex
Polygon.prototype.GetVertexList = function()
{
	return this._vertex;
}

// Get the length of all the linestring
Polygon.prototype.GetLength = function()
{
	if(this._vertex.length < 2)
		return 0;
	var i = 0, _length = 0;
	for(;i < this._vertex.length - 1; i++)
		_length += Math.sqrt( Math.pow(this._vertex[i].x - this._vertex[i + 1].x, 2) + Math.pow(this._vertex[i].y - this._vertex[i + 1].y, 2));
	_length += Math.sqrt( Math.pow(this._vertex[0].x - this._vertex[this._vertex.length - 1].x, 2) + Math.pow(this._vertex[0].y - this._vertex[this._vertex.length - 1].y, 2));
	return _length;
}

// Get the length of all the linestring
Polygon.prototype.GetArea = function()
{
	var _x = 0, _y = 0, _yn = 0, _area = 0, i = 0;
	if(this._vertex.length <= 2) return 0;
	_y = this._vertex[this._vertex.length - 1].y;
	_x = this._vertex[0].x;
	while(i < this._vertex.length)
	{
		_x = this._vertex[i].x;
		_yn = this._vertex[i].y;
		i++;
		if(i < this._vertex.length)
			_area += _x * (_y - this._vertex[i].y);
		else
		{
			_y = this._vertex[0].y;
			_area += _x * ( this._vertex[this._vertex.length - 2].y - _y);
		}
		_y = _yn;
	}
	return _area / 2;
}

// Get the WKT representation of the LineString
Polygon.prototype.GetWKT = function()
{
	var WKTString = new String(), i = 0;
	for (;i<this._vertex.length;i++)
		coords += this._vertex[i].x + " " + this._vertex[i].y + ",";
	coords += this._vertex[i].x + " " + this._vertex[i].y;
	return "LINESTRING(" + coords + ")";
}

//-----------------------------------------------
// Point
function Point(X, Y)
{
	this._x = X;
	this._y = Y;
}

// Get the x coords of the point
Point.prototype.GetX = function()
{
	return this._x;
}

// Get the y coords of the point
Point.prototype.GetY = function()
{
	return this._y;
}

// Get the point as an object
Point.prototype.GetValue = function()
{
	return {x : this._x, y : this._y};
}

// Get the WKT representation of the LineString
Point.prototype.GetWKT = function()
{
	return "Point(" + this._x + " " + this._y + ")";
}