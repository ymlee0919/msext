 
function Tester()
{
	this._is_enable = false;
	this._btn_builder = null;
	
	this.GetName = function()
	{
		return 'Probador de superponibles';
	}
	
	this.Init = function()
	{	
		this._btn_builder = new Ext.Button(
		{
			id	 : 'result_builder_btn',
			iconCls:'search_map',
			tooltip	: 'Construir',
			handler : this.BuildResult.createDelegate(this)
		});
		
		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'builder_sep_id'});
		mainApp.AddTBarButton(this._btn_builder);
		
		this._is_enable = true;
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
	
	this.BuildResult = function()
	{
		BeginPaint();
		var _leaf = Ext.getCmp('leaf_25000_id').getValue();
		
		Ext.Ajax.request(
		{
			url		: 'Plugins/Tester/Server/result_builder.php',
			method	: 'POST',
			params	: { leaf : _leaf},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);		
						mainApp.UpdateMapPanel( responseData.result);
						mainApp.UpdateLayerControl(responseData.legend);
						EndPaint();
					}
		});
	}
}

var _tester_plugin = new Tester();
mainApp.RegisterPlugin(_tester_plugin);