var tip = new Ext.ux.SliderTip({
	getText: function(thumb){
		return thumb.value;
	}
});

//----------------------------------------------------------------------
//----------------------------------------------------------------------
// Component for a color palette
//----------------------------------------------------------------------
function msExt_ColorPalette()
{
	_is_palette_active = false;
	this._fn = null;

	this._current_color_value = 0;
	this._tmp_value_color = 0;

	this._value_r = 0;
	this._value_g = 0;
	this._value_b = 0;

	this._palette = null;

	//----------------------------------------------------------------------
	// Function for update internal slider of the window
	this.UpdateSliders = function(color)
	{
		var _r = '0x' + color.substr(0,2);
		var _g = '0x' + color.substr(2,2);
		var _b = '0x' + color.substr(4,2);

		eval('_r = ' + _r + ';');
		eval('_g = ' + _g + ';');
		eval('_b = ' + _b + ';');

		Ext.getCmp('_r_rgb').setValue(_r,true);
		Ext.getCmp('_g_rgb').setValue(_g,true);
		Ext.getCmp('_b_rgb').setValue(_b,true);
	}

	//----------------------------------------------------------------------
	//Function to get the RGB value of the R, G and B values inside the object
	this.GetRGB = function ()
	{
		var _hex = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
		var text = "";

		var val = this._value_r >> 4;
		text += _hex[val];
		val = this._value_r & 15;
		text += _hex[val];

		val = this._value_g >> 4;
		text += _hex[val];
		val = this._value_g & 15;
		text += _hex[val];

		val = this._value_b >> 4;
		text += _hex[val];
		val = this._value_b & 15;
		text += _hex[val];

		return text;
	}

	//----------------------------------------------------------------------
	// Function for init the component
	this.Init = function()
	{
		var _scope = this;

		this._palette = new Ext.Window({
			width: 180,
			height: 275,
			renderTo: 'win-space',
			title: 'Color',
			id:'color_palette',
			bodyStyle: {padding: '5px'},
			closable: false,
			draggable: true,
			shadow: false,
			modal : true,
			resizable: false,
			animateTarget : 'tl',
			animCollapse  : 'tl',
			items:
			[	
				new Ext.ColorPalette({
					listeners: {select: function(cp, color){
						document.getElementById('color_muestra').style.background = "#"+color;
						_scope.UpdateSliders(color);
						_scope._tmp_value_color = color;
					}
				}}),
				{	layout : 'column',
					frame:true,
					items :
					[
						{	columnWidth:.8,
							border:false,
							items:
							[
								{
									xtype : 'tbtext',
									id : 'div_rgb',
									name: 'y_coord',
									text: '<b>Color de muestra:</b>',
									readOnly: true,
									width: 120
								}
							]
						},{	columnWidth:.2,
							border:false,
							items:
							[
								{
									xtype : 'label',
									id : 'color_muestra',
									html:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
									style: {width: '64', height: '16'}
								}
							]
						},{
							columnWidth:1,
							border:false,
							items:
							[ new Ext.form.Label({html :'</br>'}) ]
						},{
							columnWidth:.1,
							items:
							[ new Ext.form.Label({html :'<b>R</b>'}) ]
						},{
							columnWidth:.9,
							items:
							[
								new Ext.Slider({
									width: 115,
									minValue: 0,
									maxValue: 255,
									fieldLabel: 'G',
									value:_scope._value_r,
									id:'_r_rgb',
									name:'_r_rgb',
									plugins: new Ext.ux.SliderTip(),
									listeners: {change: function(This, max, min)
									{
										_scope._value_r = Ext.getCmp('_r_rgb').getValue();
										_scope._tmp_value_color = _scope.GetRGB();
										document.getElementById('color_muestra').style.background = '#' + _scope._tmp_value_color;
									}}
								})
							]
						},{
							columnWidth:.1,
							items: [ new Ext.form.Label({html :'<b>G</b>'}) ]
						},{
							columnWidth:.9,
							items:
							[
								new Ext.Slider({
									width: 115,
									minValue: 0,
									maxValue: 255,
									value:_scope._value_g,
									fieldLabel: 'G',
									id:'_g_rgb',
									name:'_g_rgb',
									plugins: new Ext.ux.SliderTip(),
									listeners: {change: function(This, max, min){
										_scope._value_g = Ext.getCmp('_g_rgb').getValue();
										_scope._tmp_value_color = _scope.GetRGB();
										document.getElementById('color_muestra').style.background = '#' + _scope._tmp_value_color;
									}}
								})
							]
						},{
							columnWidth:.1,
							items:[ new Ext.form.Label({html :'<b>B</b>'}) ]
						},{
							columnWidth:.9,
							items:
							[
								new Ext.Slider({
									width: 115,
									minValue: 0,
									maxValue: 255,
									value:_scope._value_b,
									fieldLabel: 'B',
									id:'_b_rgb',
									name:'_b_rgb',
									plugins: new Ext.ux.SliderTip(),
									listeners: {change: function(This, max, min){
										_scope._value_b = Ext.getCmp('_b_rgb').getValue();
										_scope._tmp_value_color = _scope.GetRGB();
										document.getElementById('color_muestra').style.background = '#' + _scope._tmp_value_color;
									}}
								})
							]
						}
					]
				}
			],
			buttons:
			[
				{ text:'Aceptar', handler : _scope.Accept.createDelegate(_scope)},
				{ text:'Cancelar', handler : _scope.Cancel.createDelegate(_scope)}
			]
		});
	}

	//----------------------------------------------------------------------
	// Function for show the color palette
	//	Parameters:
	//		xPos : X screen position to show the palette
	//		yPos : Y screen position to show the palette
	//		_color : Initial color of the palette
	//		fn : Function to execute when the color is selected, 
	//			This function recive as parameter the value of the selected color
	this.Show = function(xPos, yPos, _color, fn)
	{
		this._palette.setPosition(xPos,yPos);
		this._current_color_value = _color;
		this.UpdateSliders(_color);
		this._palette.show();
		this._fn = fn;
	}

	//----------------------------------------------------------------------
	// Function for cancel the operation
	this.Cancel = function()
	{
		this._palette.hide();
	}

	//----------------------------------------------------------------------
	// Function for accept the selected color
	this.Accept = function()
	{
		this._current_color_value = this._tmp_value_color;
		this._is_palette_active = false;
		this._palette.hide();

		this._fn(this._current_color_value);
		this._fn = null;
	}

	//----------------------------------------------------------------------
	// Function for retrive the value of the color selected
	this.GetColorValue = function()
	{
		return this._current_color_value;
	}
}

MsExt.Common.ColorPalette = new msExt_ColorPalette();