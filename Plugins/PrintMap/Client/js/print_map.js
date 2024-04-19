function PrintPlg()
{
	this._configprintMapBtn = null;
	this._print_config = null;		
	
	this._is_enable = false;
	
	this.GetName = function()
	{
		return 'Impresión';
	}
	
	this.InitComponents = function()
	{		
		this._configprintMapBtn = new Ext.Button(
		{
			id	 : 'config_print_Map',
			iconCls:'printer',
			tooltip	: 'Configuración de impresión',				
			handler : this.onConfigprintMap.createDelegate(this)
		});
		
		this._print_config = new Ext.Panel(
		{
			title : 'Configuración de Impresión',
			id 	: 'print_config',
			labelWidth:50,
			frame : true,
			collapsed 	: true,
			collapsible : true,
			animate		: true,
			titleCollapse : true,
			hideCollapseTool: true,
			frame		: true,
			iconCls		:'printer',
			border		: false,
			hideBorders : true,
			bodyBorder	: false,
			items : 
			[
				{
					xtype:'fieldset',			
		            title: 'Configuración',
		            collapsible: false,
					bodyStyle	:'padding:5px 5px 0',
		            items :
					[
						{
							xtype: 'textfield',
							fieldLabel: 'Título',
							name: 'print_title',
							id: 'print_title',
							emptyText : 'título...',
							anchor :'80%'
						},
						new Ext.form.ComboBox({
							typeAhead: true,
							fieldLabel: 'Tamaño',
							id: 'print_size',
							emptyText: 'tamaño...',
							triggerAction: 'all',
							lazyRender:true,
							mode: 'local',
							anchor :'80%',
							store: new Ext.data.ArrayStore({
								id: 0,
								fields: [
									'myId',
									'displayText'
								],
								data: [[0,'A3'], [1, 'A4'], [2, 'A5'], [3, 'Carta'], [4, 'Legal']]
							}),
							valueField: 'myId',
							displayField: 'displayText'
						}),
						{
							xtype: 'radiogroup',
							fieldLabel: 'Orientación',					
							id: 'print_orientation',
							columns: [100,100],
							anchor :'100%',
							items: [{boxLabel: 'Horizontal', checked: true, name: 'radios', id:'l'},{boxLabel: 'Vertical', name: 'radios', id:'p'}]
						},
						{
							xtype: 'checkboxgroup',
							fieldLabel: 'Opciones',
							columns: [100,100],
							items: [{boxLabel: 'Leyenda', name:'box_leyenda', id:'box_leyenda'},{boxLabel: 'Escala', name:'box_scale', id:'box_scale'}]
						}
								
		            ]
		        }
			],
			buttons:[{text:'Exportar', iconCls:'btn_export', handler : this.onPrintMap.createDelegate(this)}]
		});
	}
	
	this.Init = function()
	{		
		this.InitComponents();
		
		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'print_sep_id'});
		mainApp.AddTBarButton(this._configprintMapBtn);
		
		var _print_menu = [
			{text:'Imprimir...', id: 'print_menu_id', iconCls: 'printer', handler: this.onConfigprintMap.createDelegate(this)}		
		];
		
		mainApp.AddMenu('Archivo',_print_menu);
		
		mainApp.AddTool(this._print_config);
		
		this._is_enable = true;
	}
	
	this.Disable = function()
	{
		Ext.getCmp('print_sep_id').hide();
		Ext.getCmp('print_menu_id').hide();
		this._configprintMapBtn.hide();
		this._print_config.hide();
		this._is_enable = false;
	}

	this.Enable = function()
	{
		Ext.getCmp('print_sep_id').show();
		Ext.getCmp('print_menu_id').show();
		this._configprintMapBtn.show();
		this._print_config.show();
		this._is_enable = true;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}
	
	this.onPrintMap = function()
	{
		_wait = Ext.Msg.wait('Por favor espere...','Creando salida de impresión...');
		
		Ext.Ajax.request(
		{
			url		: 'Plugins/PrintMap/Server/get_img.php',
			method	:'POST',
			params	: {
						map_name: document.getElementById('map_name').value,
						extent	: document.getElementById('extent').value,
						scale	: Ext.getCmp('box_scale').getValue(),
						legend	: Ext.getCmp('box_leyenda').getValue(),
						orientation : (Ext.getCmp('l').getValue()) ? 'l' : 'p',
						size : Ext.getCmp('print_size').getRawValue()
					  },		 
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText)
						var t = response.responseText.toString().split('/');
						var img = t[3].split('.');
						if(Ext.getCmp('l').getValue())
							var ori = 'l';
						else
							var ori = 'p';
						var size = Ext.getCmp('print_size').getValue();
						var title = Ext.getCmp('print_title').getValue();
						var url = 'http://localhost/MsExt/Plugins/PrintMap/Server/report_map.php?img='+img[0]+'&o='+ori+'&s='+size+'&t='+title;
						
						_wait.hide();				
						
						window.open(url);
					}
		});
	}

	this.onConfigprintMap = function()
	{		
		Ext.getCmp('tools_layout').expand(true);
		Ext.getCmp('print_config').expand(true);
	}
}

var _print_plugin = new PrintPlg();
mainApp.RegisterPlugin(_print_plugin);
