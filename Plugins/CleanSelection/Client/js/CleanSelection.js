function CleanSelection()
{
	this._CleanSelection = null;

	this._is_enable = false;
	
	this.IsPlugAndPlay = function()
	{
		return false;
	}

	this.Init = function()
	{	
		var _scope = this;
		
		this._CleanSelection = new Ext.Button(
		{
			id	 : 'unmark_selection_btn',
			iconCls:'unmark_selection',
			tooltip	: 'Limpiar selección',
			disabled : true,
			handler : this.fnCleanSelection.createDelegate(this)
		});
		
		var onClickLayer = function(node, eventObject)
		{
			var id = node.attributes.id;
			var type = id.substr(0,5);
			if(type == 'layer' && MsExt.Core.Selection.HaveSelection(Ext.getCmp('selected_layer').getValue()))
			{
				_clean_selection._CleanSelection.enable();
				Ext.getCmp('unmark_selection_menu').enable();									
			}
			else
			{
				_clean_selection._CleanSelection.disable();
				Ext.getCmp('unmark_selection_menu').disable();									
			}
		};
		
		MsExt.Components.LayerControl.EnqueueOnClickHandler(onClickLayer, this);
		MsExt.Components.LayerControl.EnqueueRigthClickHandler(onClickLayer, this);

		var _menu_info = [{text:'Limpiar selección', id: 'unmark_selection_menu', iconCls: 'unmark_selection', disabled : true, handler: this.fnCleanSelection.createDelegate()}];

		mainApp.AddTBarButton({xtype: 'tbseparator', id: 'clean_selection_sep_id'});
		mainApp.AddTBarButton(this._CleanSelection);

		mainApp.AddMenu('Selección',_menu_info);

		this._is_enable = false;
	}

	this.Enable = function()
	{
		Ext.getCmp('clean_selection_sep_id').show();
		this._CleanSelection.show();
		Ext.getCmp('menu_Selección_id').show();

		this._is_enable = true;
	}

	this.Disable = function()
	{
		Ext.getCmp('clean_selection_sep_id').hide();
		this._CleanSelection.hide();
		Ext.getCmp('menu_Selección_id').hide();

		this._is_enable = false;
	}

	this.IsEnable = function()
	{
		return this._is_enable;
	}
	
	this.GetName = function()
	{
		return 'Limpiar selección';
	}

	this.fnCleanSelection = function()
	{
		if(document.getElementById('selected_layer').value == 0)
		{
			msg('Error','Por favor, seleccione una capa');			
			return;
		}
		
		BeginPaint();

		Ext.Ajax.request(
		{
			url		: 'Framework/Server/Core/MsExt.Selection.UnderHighlight.php',
			method	:'POST',
			params	: {layer : document.getElementById('selected_layer').value},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText);
						mainApp.UpdateMapPanel( responseData.result);
						MsExt.Core.Selection.ClearSelectionOfLayer(document.getElementById('selected_layer').value);
						EndPaint();
						Ext.getCmp('unmark_selection_menu').disable();
						_clean_selection._CleanSelection.disable();
					}
		});
	}
}

_clean_selection = new CleanSelection();
mainApp.RegisterPlugin(_clean_selection);