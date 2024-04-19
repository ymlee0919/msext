//----------------------------------------------------------------------
//----------------------------------------------------------------------
// Class for  current map
//----------------------------------------------------------------------
function MapManagment()
{	
	this._save_current_map = null;
	this.frm_save_map = null;
	this._current_mapfile = null;
	this._current_map_name = null;
	this._is_enable = false;
	this._user_maps_grid = null;
	this._user_maps_panel = null;
	
	this.GetName = function()
	{
		return 'Gestor de mapas';
	}
	
	this.BuildSaveWindow = function()
	{
		if(this._save_current_map)
		{
			this._save_current_map.show();
			return;
		}
		
		var _scope = this;
		
		this.frm_save_map = new Ext.FormPanel(
		{
			layout :'form',
			frame :true,
			id: 'frm_save_map',
			labelAlign:'top',
			bodyStyle: 'padding:5px 5px 0',
			items :
			[
				{
					xtype : 'textfield',					
					id : 'name_map',
					blankText:'Este campo es obligatorio.',
					allowBlank:false,
					fieldLabel:'Nombre del mapa',
					anchor:'95%'
				},{
					xtype : 'textfield',					
					id : 'name_mapfile',
					regex	: /^(([a-zA-Z0-9_]?[a-zA-Z0-9_])+.map)$/,
					invalidText : 'Debe poner la extensión .map',
					blankText:'Este campo es obligatorio.',
					allowBlank:false,
					fieldLabel:'Nombre del archivo',
					anchor:'95%'
				}
			]
		});
		
		this._save_current_map = new Ext.Window(
		{
			title : 'Salvar Mapa',
			id : 'save_current_map',
			layout : 'fit',
			width : 200,			
			height : 180,
			resizable : false,
			modal : true,
			closeAction : 'hide',
			items : [this.frm_save_map],
			buttons:
			[
				{
					xtype : 'button',
					text:'Salvar',
					id:'btn_save',
					handler : function(){_scope.TrySaveMap(Ext.getCmp('name_mapfile').getValue(),Ext.getCmp('name_map').getValue());}
				},
				{
					xtype : 'button',
					text:'Cancelar',
					id:'btn_close',
					handler : function()
							{
								_scope._save_current_map.hide();								
							}
					}
			]
		});

		this._save_current_map.show();
	}
	
	this.AskForOverride = function(Filename, MapName)
	{
		var _scope = this;
		
		Ext.MessageBox.show({
		   title:'Confirmación',
		   msg: '¿Desea sobrescribir el mapa '+ Filename +'?',
		   buttons: Ext.MessageBox.YESNO,
		   fn: function(buttonId){if(buttonId=='yes')_scope.SaveMapAs(Filename, MapName);},
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	this.AskForDelete = function()
	{
		var _scope = this;		
		
		var record = Ext.getCmp('map_managment_grid').getSelectionModel().getSelected();		
		
		Ext.MessageBox.show({
		   title:'Confirmación',
		   msg: '¿Desea eliminar el mapa '+  record.data.mapfile +'?',
		   buttons: Ext.MessageBox.YESNO,
		   fn: function(buttonId){if(buttonId=='yes')_scope.RemoveUserMap(record);},
		   icon: Ext.MessageBox.QUESTION
		});
	}
	
	//----------------------------------------------------------------------
	// Function for load the base map
	this.TrySaveMap = function(Filename, MapName)
	{
		if(!this.frm_save_map.getForm().isValid())
			return;
		
		if(MsExt.Controlers.BaseMapsWin.ExistMap(Filename))		
			this.AskForOverride(Filename, MapName);		
		else
			this.SaveMapAs(Filename, MapName);
	}
	//----------------------------------------------------------------------
	// Function for save as the map
	this.SaveMapAs = function(Filename, MapName)
	{
		var _scope = this;
		
		MsExt.Common.Message.ShowMessage('Salvando', 'Salvando mapa como (' + Filename + ')', 'LoadingData');
		
		Ext.Ajax.request({
			url		:'Plugins/MapManagment/Server/save_map.php',
			method	:'POST',
			params : {mapfile : Filename, map_name: MapName },
			callback:function (options,success,response)
					{
						MsExt.Common.Message.HideMessage();
						var record = new Ext.data.Record({'mapfile' : Filename,  'map_name' : MapName});
						Ext.getCmp('map_managment_panel').expand(true);
						Ext.getCmp('map_managment_grid').getStore().add(record);
						MsExt.Controlers.BaseMapsWin.AddUserMap(record);
						_scope.SetCurrentMap(Filename, MapName);
						_scope._save_current_map.hide();						
					}  
		});
	}
	
	//----------------------------------------------------------------------
	// Function for save the map
	this.SaveMap = function(Filename, MapName)
	{
		var _scope = this;
		
		MsExt.Common.Message.ShowMessage('Salvando', 'Salvando mapa actual (' + Filename + ')', 'LoadingData');
		
		Ext.Ajax.request({
			url		:'Plugins/MapManagment/Server/save_map.php',
			method	:'POST',
			params : {mapfile : Filename, map_name: MapName },
			callback:function (options,success,response)
					{
						MsExt.Common.Message.HideMessage();						
					}  
		});
	}
	
	this.SetCurrentMap = function(Filename, MapName)
	{
		this._current_mapfile = Filename;
		this._current_map_name = MapName;
	}
	
	//----------------------------------------------------------------------
	// Function for init the componet
	this.Init = function()
	{		
		this._user_maps_grid = new Ext.grid.GridPanel({
			id			: 'map_managment_grid',			
			store 	: new Ext.data.JsonStore({
							fields: [ {name: 'mapfile', type:'string'}, {name: 'map_name', type:'string'} ]
						}),
			sm		: new Ext.grid.RowSelectionModel({	
							singleSelect:true,
							listeners : {'rowselect' : function(){
								Ext.getCmp('remove_map_btn_id').enable();								
								Ext.getCmp('load_user_map_btn_id').enable();								
							}}
						}),
			columns	: [
						{header: 'Mapfile', width: 70, sortable: true, dataIndex: 'mapfile'},
						{header: 'Nombre del mapa', width: 140, sortable: true, dataIndex: 'map_name'}
					  ],
			viewConfig: { forceFit: true },
			bbar : [{
				xtype: 'button',
				text: 'Cargar',				
				id : 'load_user_map_btn_id',
				disabled : true,				
				handler : function(){mainApp.LoadMap('User', Ext.getCmp('map_managment_grid').getSelectionModel().getSelected().get('mapfile'), Ext.getCmp('map_managment_grid').getSelectionModel().getSelected().get('mapfile'));}
			},'->',{
				xtype: 'button',
				text: 'Eliminar',				
				id : 'remove_map_btn_id',
				disabled : true,				
				handler : function(){_map_managment_plg.AskForDelete();}
			}]
		});
		
		this._user_maps_panel = new Ext.Panel(
		{
			title		: 'Gestor de mapas',
			id			: 'map_managment_panel',
			height		: '100%',
			collapsed 	: true,
			collapsible : true,
			animate		: true,
			titleCollapse : true,
			hideCollapseTool: true,
			frame		: true,
			iconCls		:'magnament_map',
			border		: true,
			hideBorders : true,
			bodyBorder	: false,
			items : [this._user_maps_grid],
			listeners : {beforeexpand : function(Panel)
			{
				if(Ext.getCmp('map_managment_grid').getStore().getCount())
					return;
				var store = MsExt.Controlers.BaseMapsWin.GetUsersMapsStore();
				var count = store.getCount() - 1;
				Ext.getCmp('map_managment_grid').getStore().add(store.getRange(0, count));
			}}
		});
		
		mainApp.AddTool(this._user_maps_panel);
		
		var _save_map_menu_item = [{
			text:'Guardar mapa',
			id:'_save_map_menu_item',
			iconCls: 'save_map',
			handler: function(){
				if(_map_managment_plg._current_mapfile != null)
					_map_managment_plg.SaveMap(_map_managment_plg._current_mapfile, _map_managment_plg._current_map_name);
				else
					_map_managment_plg.BuildSaveWindow();
			}}];
		var _save_map_as_menu_item = [{text:'Guardar mapa como...', id:'_save_map_as_menu_item', iconCls: 'save_map_as', handler: this.BuildSaveWindow.createDelegate(this)}];
		
		mainApp.AddMenu('Archivo',_save_map_menu_item);
		mainApp.AddMenu('Archivo',_save_map_as_menu_item);
		
		this._is_enable = true;
	}
	
	this.RemoveUserMap = function(record)
	{		
		MsExt.Common.Message.ShowMessage('Borrando', 'Borrando el mapa ' + record.data.mapfile, 'LoadingData');		
		
		Ext.Ajax.request({
			url		:'Plugins/MapManagment/Server/erase_map.php',
			method	:'POST',
			params : {mapfile : record.data.mapfile},
			callback:function (options,success,response)
					{
						MsExt.Common.Message.HideMessage();
						Ext.getCmp('map_managment_grid').getStore().remove(record);
						MsExt.Controlers.BaseMapsWin.DeleteUserMap(record);
						if(_map_managment_plg._current_mapfile == record.data.mapfile)
							_map_managment_plg.SetCurrentMap(null, null);
						Ext.getCmp('remove_map_btn_id').disable();
						Ext.getCmp('load_user_map_btn_id').disable();
					}  
		});		
	}
	
	this.Disable = function()
	{
		this._is_enable = false;
	}

	this.Enable = function()
	{
		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}
}

var _map_managment_plg = new MapManagment();
mainApp.RegisterPlugin(_map_managment_plg);