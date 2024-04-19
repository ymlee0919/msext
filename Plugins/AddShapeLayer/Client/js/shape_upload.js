/*
* Add Shape Layer Plugin
*/

function ShapeLayer()
{
	this._uploadShp = null;
	
	this._is_enable = false;
	
	this.Disable = function()
	{		
		this._uploadShp.hide();		
		Ext.getCmp('menu_import_shp_id').hide();
		
		this._is_enable = false;
	}

	this.Enable = function()
	{		
		this._uploadShp.show();		
		Ext.getCmp('menu_import_shp_id').show();
		
		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}
	
	this.GetName = function()
	{
		return 'Adicionar Capa Shape';
	}
	
	this.Init = function()
	{
		this._uploadShp = new Ext.Button(
		{
			id	 : 'upLoadShape',
			iconCls:'import_shp',
			tooltip	: 'Importar archivo shape',
			handler : this.onUploadShape.createDelegate(this)
		});

		mainApp.AddTBarButton(this._uploadShp);

		this._import_shape_menu = [
				{text:'Importar archivo shape', id: 'menu_import_shp_id', iconCls: 'import_shp', handler: this.onUploadShape.createDelegate(this)}		
			];
	
		mainApp.AddMenu('Capas',this._import_shape_menu);
		
		this.shp_fupload = new Ext.form.FileUploadField({
		        id: 'shp',
				emptyText: 'Seleccione el archivo .shp',
				fieldLabel: 'Shp',
				name: 'shp_file',
				buttonText: '',
				buttonCfg: {iconCls: 'upload-icon'}
		});

		this.dbf_fupload = new Ext.form.FileUploadField({
				id: 'dbf',
				emptyText: 'Seleccione el archivo .dbf',
				fieldLabel: 'Dbf',
				name: 'dbf_file',
				buttonText: '',
				buttonCfg: {iconCls: 'upload-icon'}
		});

		this.shx_fupload = new Ext.form.FileUploadField({
				id: 'shx',
				emptyText: 'Seleccione el archivo .shx',
				fieldLabel: 'Shx',
				name: 'shx_file',
				buttonText: '',
				buttonCfg: {iconCls: 'upload-icon'}
		});
			
		this.fp = new Ext.FormPanel({
				fileUpload: true,
				width: 500,
				frame: true,
				autoHeight: true,
				bodyStyle: 'padding: 10px 10px 0 10px;',
				labelWidth: 50,
				defaults: {
					anchor: '95%',
					allowBlank: false,
					msgTarget: 'side'
				},
				items: 	[ this.shp_fupload, this.dbf_fupload, this.shx_fupload	]	
		});
		
		this._is_enable = true;
	}
	
	this.onUploadShape = function()
	{
		var _scope = this;
		
		var _user_win = new Ext.Window({
			title: 'Adicionar nuevo shape',
			closable:false,
			modal: true,
			shadow:'frame',
			width:600,
			height: 'auto',
			border:true,
			plain:true,
			layout: 'fit',
			items: [this.fp],
			buttons: 
			[
				{	text: 'Cargar',
					handler: function()
					{
						if(_scope.fp.getForm().isValid())
						{
							_scope.fp.getForm().submit
							({
								url: 'Plugins/UploadShape/Server/upload_shape.php',
								waitMsg: 'Cargando archivo ...',
								success: function(fp, action)
								{
									msg('Success','Archivo descargado' );
								},					
								failure: function(fp, action)
								{
									msg('Error', 'Error cargando el archivo "'+action.result.failed+'" al servidor');
								}
							});
						}
					}
				},
				{	text: 'Limpiar',
					handler: function(){ _scope.fp.getForm().reset();}
				},
				{	text: 'Cerrar',
					handler: function(){_user_win.close();}
				}
			]
		});
		
		_user_win.show();
	}
}

var _shape_layer_plg = new ShapeLayer();
mainApp.RegisterPlugin(_shape_layer_plg);