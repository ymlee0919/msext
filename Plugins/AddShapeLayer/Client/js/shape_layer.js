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

function onConnect()
{
	Ext.Ajax.request(
	{
		url		: 'Plugins/AddPostgisLayer/Server/get_connection_data.php',
		method	:'POST',
		params	: {
					host 	: Ext.getCmp('host').getValue(),
					port 	: Ext.getCmp('port').getValue(),
					user 	: Ext.getCmp('user').getValue(),
					pass 	: Ext.getCmp('pass').getValue(),
					dbase 	: Ext.getCmp('dbase').getValue()
					},
		callback: function (options,success,response)
				{
					var responseData = Ext.decode(response.responseText)
					if(responseData.success == true)
					{
						_pg_grid_layers.getStore().loadData(responseData, false);
					}
					else
					{
						msg('ERROR', responseData.message);
						_pg_grid_layers.removeAll();
						Ext.getCmp('layer_data').disable();
					}
				}
	});
}

function AddShpLayer()
{
	BeginPaint();
	
	Ext.Ajax.request(
	{
		url		: 'Plugins/AddPostgisLayer/Server/add_pg_layer.php',
		method	:'POST',
		params	: {
					host 	: Ext.getCmp('host').getValue(),
					port 	: Ext.getCmp('port').getValue(),
					user 	: Ext.getCmp('user').getValue(),
					pass 	: Ext.getCmp('pass').getValue(),
					dbase 	: Ext.getCmp('dbase').getValue(),
					
					table_name 	: Ext.getCmp('shape_name').getValue(),
										
					layer_color 			: Ext.getCmp('shp_layer_color').getValue(),
					layer_outline_color 	: Ext.getCmp('shp_layer_outline_color').getValue(),
					layer_name 				: Ext.getCmp('shp_layer_name').getValue(),
					
					map_name: document.getElementById('map_name').value,
					extent	: document.getElementById('extent').value
					},
		callback: function (options,success,response)
				{
					var responseData = Ext.decode(response.responseText);
					Ext.getCmp('layer_tree').getLoader().load(Ext.getCmp('layer_tree').getRootNode());
					Ext.getCmp('layer_tree').getRootNode().expand(true);
					mainApp.UpdateMapPanel( responseData.result );
					EndPaint();
				}
	});
}

function onShpSelect(scope, index, record)
{
	Ext.getCmp('shp_layer_data').enable();
	Ext.getCmp('shp_layer_name').setValue(record.get('table_name'));
	
	Ext.getCmp('shape_name').setValue(record.get('shape_name'));	
}

var _shp_grid_layers = new Ext.grid.GridPanel(
{
	title 	: 'Tablas',
	enable	: false,
	height 	: 150,
	width	: 'auto',
	store 	: new Ext.data.JsonStore(
			{
				root : 'shapes',
				fields: 
				[
					{name : 'shape_name'}
				]
			}),
	sm		: new Ext.grid.RowSelectionModel(
				{	
					singleSelect:true,
					listeners : {'rowselect' : onShpSelect.createDelegate()}
				}),
	columns	: [
            {id:'shape_name',header: "Fichero", width: 160, sortable: true, dataIndex: 'shape_name'}
        ],
	viewConfig: { forceFit: true }

});

var _shp_layer = new Ext.form.FormPanel(
{
	title : 'Adicionar capa postgis',
	frame : true,
	labelWidth : 70,
	items : 
	[
		{
			xtype 	: 'hidden',
			name 	: 'shape_name',
			id 		: 'shape_name',
			value 	: 0
		},
		_shp_grid_layers,
		{
			xtype:'fieldset',
			id 	: 'shp_layer_data',
            title: 'Capa',
			disabled : true,
            collapsible: false,
            autoHeight:true,
			bodyStyle	:'padding:5px 5px 0',
            items :
			[
				{
					layout : 'table',
					layoutConfig: 
					{
				        columns: 2
				    },
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
				                    name: 'shp_layer_name',
				                    id: 'shp_layer_name',
									emptyText : 'Layer name...',
									anchor :'100%',
									colspan: 2
				                },
								{
				                    fieldLabel: 'Color',
				                    name: 'shp_layer_color',
				                    id: 'shp_layer_color',
									emptyText : 'Color...'
				                },
								{
									xtype : 'button',
									text  : 'Add',
									id 	  : '_add_pg_layer_btn',
									width : 50,
									align : 'rigth',
									anchor :'20%',
									handler : AddShpLayer.createDelegate()
								}
							]
						},
						{layout: 'form',
							columnWidth:.5,
							defaults: { anchor :'90%'},
							defaultType: 'textfield',
							items:
							[
								{
				                    fieldLabel: 'Linea',
				                    name: 'shp_layer_outline_color',
				                    id: 'shp_layer_outline_color',
									emptyText : 'Outline color...'
				                }
							]
						}
					]
				}
            ]
        }
	]
});

function onAddPostgisLayer()
{
	var _user_win = new Ext.Window({
		title: 'Adicionar capa ...',
		closable:false,
		modal: true,
		shadow:'frame',
		width:430,
		height: 530,
		border:true,
		plain:true,
		layout: 'fit',
		el: 'win-space',
		items: [_pg_layer],
		buttons: 
		[
			{	
				text: 'Close',
				handler: function()
						{
							_user_win.hide();
							document.getElementById('win-space').innerHTML = '';
						}
			}
		]
	});
	
	_user_win.show();
}

var _addPgLayerBtn = new Ext.Button(
{
	id	 : 'add_postgis_layer',
	iconCls:'add_pg_layer',
	tooltip	: 'Add postgis layer',
	tooltipType	: 'title',
	handler : onAddPostgisLayer.createDelegate(this)
});

mainApp.AddTBarButton('-');
mainApp.AddTBarButton(_addPgLayerBtn);


//mainApp.AddHiddenField('highlighted_layer','highlighted_layer',0);