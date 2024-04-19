/*
* Update Layer Plugin
*/
Map.prototype.update_by_point = function(aDisplay) {
  this.selectionPoint(aDisplay, _update_plg.UpdateByPoint.createDelegate(_update_plg));
  this.getDisplay(aDisplay).docObj.style.cursor = "help";
};

UpdateLayer.prototype.UpdateLayerCentroSalud = function(_sourse)
{
	
	/*this.comboStore_tipo_salud  = new Ext.data.Store({
		  				   url: '../../LogicaNegocio/Llenar_Componentes/llenarcombo_perido.php',
						   autoLoad:true,
						   reader: new Ext.data.JsonReader({
						   root: 'datos',
						   id: 'id_tipo_centro_salud'
					    }, [{name: 'id_tipo_centro_salud'},
						   {name: 'tipo_centro_salud'}])
    });*/
	
	

		
		var _up_layer_centro_salud = new Ext.form.FormPanel(
		{
			title : 'Capa Centro Salud',
			frame : true,
			labelWidth : 75,
			id : 'form_up_layer_centro_salud',
			items :
			[
				{
		            xtype:'fieldset',
		            title: 'Campos',
		            collapsible: false,
		            autoHeight:true,
		            items :
					[
						{
							layout : 'column',
							items:
							[
								{layout: 'form',
									columnWidth:.5,
									defaults: { anchor :'90%'},
									defaultType: 'textfield',
									items:
									[
										{
											fieldLabel: 'Nombre',
											name: 'nombre',
											id: 'up_nombre_salud',
											allowBlank:false,
											blankText : 'Parámetro requerido',											
											emptyText : 'nombre...'
										},{
											fieldLabel: 'Cant. camas',
											name: 'cant_camas',
											id: 'up_cant_camas',
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'camas...'
										},{
											fieldLabel: 'Zona Defensa',
											name: 'zona_defensa',
											id: 'up_zona_defensa',
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'zona defensa...'
										}
									]
								},
								{layout: 'form',
									columnWidth:.5,
									defaults: { anchor :'90%'},
									defaultType: 'textfield',
									items:
									[
										/*{
											 xtype:'combo',
					            		     store: comboStore_centro_u,
											 emptyText:'- Seleccione -',
											 editable:true,
											 forceSelection : true,
											 displayField:'tipo_centro_salud',
											 valueField:'id_tipo_centro_salud',
										 	 triggerAction: 'all',
											 mode:'local',
										 	 name: 'up_tipo_salud',
										 	 id: 'up_tipo_salud',
											 blankText:'Este campo es obligatorio.',
											 allowBlank:false,
											 fieldLabel:'Tipo Centro',
											 anchor:'94.5%'
										},*/
										{
											fieldLabel: 'Tipo Centro',
											name: 'tipo_salud',
											id: 'up_tipo_salud',
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'Tipo Centro...'
										},
										{
											fieldLabel: 'Observaciones',
											name: 'observaciones',
											id: 'up_observaciones',
											allowBlank:false,
											blankText : 'Parámetro requerido',
											emptyText: 'observaciones...'
										},
										{
										    xtype:'hidden',
											name: 'gid',
											id: 'up_gid'
										}/*,
										{
											xtype : 'button',
											text  : 'Conectar',
											width : 50,
											align : 'rigth',											
											handler : this.onUpLayer.createDelegate(this)
										}*/
									]
								}
							]
						}
		            ],
					bbar: [
							{
								xtype : 'tbtext',
								text: '<b>Coordenadas:</b>&nbsp; &nbsp;<b>X:</b>&nbsp;'
							},{
								xtype : 'tbtext',
								id : 'x_coord_centro_salud',
								readOnly: true,
								width: 120
							},{	
								xtype : 'tbspacer', 
								width : 10
							},{
								xtype : 'tbtext',
								text: '<b>Y:</b>&nbsp;'
							},{
								xtype : 'tbtext',
								id : 'y_coord_centro_salud',
								readOnly: true,
								width: 120
							}
							]
		        }
			]
		});
		
		var _up_layer_win_centro_salud = new Ext.Window({
			title: 'Actualizar capa ...',
			closable:false,
			modal: true,
			id:'_up_layer_win_centro_salud',
			shadow:'frame',
			width:430,
			height: 250,
			border:true,
			plain:true,
			layout: 'fit',
			items: [_up_layer_centro_salud],
			buttons:
			[
				{
					text  : 'Adicionar',
					id : 'up_layer_centro_salud_btn',
					//scope : _scope,
					handler : this.UpFieldLayer.createDelegate(this,[_up_layer_centro_salud, 'centro_salud'])
				},
				{
					text: 'Cerrar',
					handler: function()
							{
								_up_layer_win_centro_salud.close();
							}
				}
			]
		});
		var _data = Ext.decode(_sourse);
	 
		Ext.getCmp('up_gid').setValue(_data.result[0]['gid']);
		Ext.getCmp('up_nombre_salud').setValue(_data.result[0]['nombre_centro']);
		Ext.getCmp('up_cant_camas').setValue(_data.result[0]['cant_camas']);
		Ext.getCmp('up_tipo_salud').setValue(_data.result[0]['id_tipo_centro_salud']);
		Ext.getCmp('up_observaciones').setValue(_data.result[0]['observacio']);
		Ext.getCmp('up_zona_defensa').setValue(_data.result[0]['defensa']);
		//Ext.getCmp('y_coord_centro_salud').setText(_data.result[0]['coordy']);
		//Ext.getCmp('x_coord_centro_salud').setText(_data.result[0]['coordx']);		
		_up_layer_win_centro_salud.show();
}

 UpdateLayer.prototype.UpLayer = function()
{
			
	if(document.getElementById('selected_layer').value == 0)
	{
		msg('Error','Por favor, seleccione la capa que desea consultar');
		mainmap.getDisplay('map').clearLayer('drawing');
		return;
	}

	_wait = Ext.Msg.wait('Por favor espere...','Buscando...');
	
	var pto = Ext.getCmp('selection_coords').getValue().split(' ');
	_x = pto[0];
	_y = pto[1];

	Ext.Ajax.request(
	{
		url		: 'Plugins/UpdateLayer/Server/update_by_point.php',
		method	:'POST',
		params	: {
					map_name: document.getElementById('map_name').value,
					mapa_x 	: _x,
					mapa_y	: _y,
					extent	: document.getElementById('extent').value,
					layer	: document.getElementById('selected_layer').value
					},
		callback: function (options,success,response)
				{
					_wait.hide();
					Ext.getCmp('shapeIndex').setValue(Ext.decode(response.responseText).shapeindex);
					//onUpFieldLayer(response.responseText, document.getElementById('selected_layer').value);					
					onUpFieldLayer();
				}
	});
}

UpdateLayer.prototype.UpdateByPoint = function()
{	
	if(document.getElementById('selected_layer').value == 0)
	{
		msg('Error','Por favor, seleccione la capa que desea consultar');
		mainmap.getDisplay('map').clearLayer('drawing');
		return;
	}

	_wait = Ext.Msg.wait('Por favor espere...','Buscando...');
	
	var pto = Ext.getCmp('selection_coords').getValue().split(' ');
	_x = pto[0];
	_y = pto[1];
	var _scope = this;

	Ext.Ajax.request(
	{
		url		: 'Plugins/UpdateLayer/Server/update_by_point.php',
		method	:'POST',
		params	: {
					map_name: document.getElementById('map_name').value,
					mapa_x 	: _x,
					mapa_y	: _y,
					extent	: document.getElementById('extent').value,
					layer	: document.getElementById('selected_layer').value
					},
		callback: function (options,success,response)
				{
					_wait.hide();
					responseData = Ext.decode(response.responseText);
					
					if(responseData.cant_field != 0)
					_scope.UpdateLayerCentroSalud(response.responseText);
					else
					msg('Error','Por favor, seleccione debe seleccionar el objetivo que desea modificar');
					
					mainmap.getDisplay('map').clearLayer('drawing');
					
				}
	});
}

UpdateLayer.prototype.onUpdateByPoint = function()
{
	mainmap.update_by_point('map');
	_last_fn = 'mainmap.update_by_point';
	mainApp.UnToggleMapButtons();
}
