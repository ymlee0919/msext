
var msg = function(title, msg)
{
	Ext.Msg.show({
		title: title,
		msg: msg,
		minWidth: 200,
		modal: true,
		icon: Ext.Msg.INFO,
		buttons: Ext.Msg.OK
	});
};

function LocateByPoint()
{
	this._MapLocateByPointBtn = null;
	
	this._locate_by_point_win = null;
	
	this._is_enable = false;
	
	this.GetName = function()
	{
		return 'Localización puntual';
	}
	
	this.Init = function()
	{
		var _scope = this;
		
		this._MapLocateByPointBtn = new Ext.Button(
		{
			id	 : 'locateByPoint',
			tooltip	: 'Centrar la vista sobre un punto',
			iconCls: 'bt_locate',
			handler : this.enterPoint.createDelegate(this)
		});
		
		this._locate_by_point_win = new Ext.Window(
		{
			title: 'Centrar la vista sobre un punto',
			iconCls : 'bt_locate',
			collapsible : true,
			resizable : false,
			closable: false,
			modal: true,
			shadow:'frame',
			width: 250,
			height: 330,
			border:true,
			plain:true,
			layout: 'fit',
			items: [
						new Ext.FormPanel({
				        labelWidth: 20, // label settings here cascade unless overridden
				        frame:true,
						title: 'Punto',
						id : 'point_location_form',
				        bodyStyle:'padding:5px 5px 0',
				        items: [
									{
										xtype: 'textfield',
										fieldLabel: 'X',
										name: 'point_X',
										id: 'point_X',
										maskRe	: /^[0-9.]$/,
										regex	: /^(([1-9][0-9]+)|[0-9]+.[0-9]+)$/,
										anchor :'80%',
										allowBlank:false,
										emptyText : '...',
										blankText : 'Este campo es requerido',
										invalidText : 'Coordenadas incorrectas',
										msgTarget : 'side'
									},
									{
										xtype: 'textfield',
										fieldLabel: 'Y',
										name: 'point_Y',
										id: 'point_Y',
										maskRe	: /^[0-9.]$/,
										regex	: /^(([1-9][0-9]+)|[0-9]+.[0-9]+)$/,
										anchor :'80%',
										allowBlank:false,
										emptyText : '...',
										blankText : 'Este campo es requerido',
										invalidText : 'Coordenadas incorrectas',
										msgTarget : 'side'
									},
									new Ext.form.Label({html :'</br>'}),
									{
										xtype: 'radiogroup',
										id: 'location_zoom',
										columns: [150],
										anchor :'100%',
										items: [{boxLabel: 'Extensión actual', checked: true, name: 'extents', id:'current_extents'},
										{boxLabel: 'Extensión completa', name: 'extents', id:'full_extents'}]
									},
									{							        
								        xtype:'fieldset',							        
								        title: 'Marcador',							        
								        autoHeight:true,
								        defaults: {
								            anchor: '-20' // leave room for error icon
								        },							        
								        buttons :[
										{
											id : 'marker_blue',
											iconCls : 'marker_blue',
											scale: 'large',
											enableToggle : true,
											scope: this,
											pressed : true,										
											listeners	: { 'click' : function(This, e)
																	{
																		_scope.cleanToggle();
																		This.toggle(true);
																		document.getElementById('marker_img').src = 'Plugins/LocateByPoint/Client/Icons/marker_blue.png';
																	}
											  }
										},
										{
											id : 'marker_green',
											iconCls : 'marker_green',
											scale: 'large',
											scope : this,
											enableToggle : true,	
											listeners	: { 'click' : function(This, e)
																	{
																		_scope.cleanToggle();
																		This.toggle(true);
																		document.getElementById('marker_img').src = 'Plugins/LocateByPoint/Client/Icons/marker_green.png';
																	}
											  }
										},
										{
											id : 'marker_red',
											iconCls : 'marker_red',
											scale: 'large',
											enableToggle : true,
											listeners	: { 'click' : function(This, e)
																	{
																		_scope.cleanToggle();
																		This.toggle(true);
																		document.getElementById('marker_img').src = 'Plugins/LocateByPoint/Client/Icons/marker_red.png';
																	}
											  }
										}]
									}
								]
						})
					],
			buttons:
			[
				{id: 'btn_apply',
				 text: 'Centrar',
				 scope : this,
				 listeners	: { 'click' : function()
										{
											var _new_X = Ext.getCmp('point_X').getValue();
											var _new_Y = Ext.getCmp('point_Y').getValue();
											
											//var _form = Ext.getCmp('point_location_form').getForm();
											
											if(Ext.getCmp('point_location_form').getForm().isValid())
											{
												var extent = document.getElementById('original_extent').value;
												var _map_ext = extent.split(' ');
												var minx = parseFloat(_map_ext[0]);
												var miny = parseFloat(_map_ext[1]);
												var maxx = parseFloat(_map_ext[2]);
												var maxy = parseFloat(_map_ext[3]);
												
												if((_new_X > minx && _new_X < maxx) && (_new_Y > miny && _new_Y < maxy))
													_scope.locateByPoint(_new_X, _new_Y);
												else
													msg('Información', 'Punto fuera de la extensión del mapa');
											}
										}
							  }
				},
				{text: 'Cerrar',
					handler: function()
							{
								_scope._locate_by_point_win.hide();
								mainmap.getDisplay('map').clearLayer('drawing');
							}
				}
			]
		});

		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'locate_by_point_sep_id'});
		mainApp.AddTBarButton(this._MapLocateByPointBtn);
		
		this._is_enable = true;
	}
	
	this.Disable = function()
	{
		Ext.getCmp('locate_by_point_sep_id').hide();
		this._MapLocateByPointBtn.hide();
		this._is_enable = false;
	}

	this.Enable = function()
	{
		Ext.getCmp('locate_by_point_sep_id').show();
		this._MapLocateByPointBtn.show();
		this._is_enable = true;
	}
	
	this.IsEnable = function()
	{
		return this._is_enable;
	}
	
	
	this.enterPoint = function ()
	{	
		this._locate_by_point_win.show();
	}

	this.cleanToggle = function()
	{
		Ext.getCmp('marker_blue').toggle(false);
		Ext.getCmp('marker_green').toggle(false);
		Ext.getCmp('marker_red').toggle(false);
	}
	
	this.locateByPoint = function(map_X, map_Y)
	{
		var _width = document.getElementById('map').style.width;
		var _height = document.getElementById('map').style.height;

		_width = (_width.substring(0,_width.length-2));
		_height = (_height.substring(0,_height.length-2));
		
		var _user_extent = ( Ext.getCmp('current_extents').getValue() ) ? document.getElementById('extent').value : document.getElementById('original_extent').value;

		BeginPaint();

		Ext.Ajax.request(
			{
				url		: 'Framework/Server/Core/MsExt.Location.LocatePoint.php',
				method	:'POST',
				params	: {
							map_name: document.getElementById('map_name').value,
							mapa_x 	: map_X,
							mapa_y	: map_Y,
							extent	: _user_extent
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
							EndPaint();
						}
			});
		}
}

var _locate_by_point_plg = new LocateByPoint();
mainApp.RegisterPlugin(_locate_by_point_plg);