MsExt.Core.Location = function ()
{
	this.BeginLocation = function()
	{
		_map_control.fadeOut({
			endOpacity: .25,
			easing: 'easeOut',
			duration: 0.35,
			concurrent : false,
			remove: false,
			useDisplay: false });

		_timer_id = setTimeout("_wait = Ext.Msg.wait('Por favor espere...','Localizando...')",200);
	}

	this.EndLocation = function()
	{
		if(_wait)
		{
			clearTimeout(_timer_id);
			_wait.hide();
		}

		_map_control.fadeIn({
			endOpacity: 1,
			easing: 'easeOut',
			duration: 0.35});
	}

	this.LocateShape = function (MapFileName, Extent, LayerName, ShapeIndex)
	{
		var _width = document.getElementById('map').style.width;
		var _height = document.getElementById('map').style.height;

		_width = (_width.substring(0,_width.length-2));
		_height = (_height.substring(0,_height.length-2));
		
		var _scope = this;
		this.BeginLocation();
		
		Ext.Ajax.request(
		{
			url		: 'Framework/Server/Core/MsExt.Location.LocateShape.php',
			method	:'POST',
			params	: {
						map_name	: MapFileName,
						shapeIndex	: ShapeIndex,
						layer		: LayerName,
						extent		: Extent
						},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);		
						mainApp.UpdateMapPanel( responseData.result);
						
						// Mostrar
						document.getElementById('marker_img').style.left = _width/2 - 32;
						document.getElementById('marker_img').style.top = _height/2 - 32;
						document.getElementById('marker_img').style.visibility = 'visible';
						document.getElementById('marker_img').style.position = 'absolute';
						
						_scope.EndLocation();
					}
		});
	}
}

var msCoreLocation = new MsExt.Core.Location();