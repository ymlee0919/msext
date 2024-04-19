function onAuthenticate()
{
	if(Ext.getCmp('inica_user').getValue() == Ext.getCmp('hd_inica_user').getValue()
		&& Ext.getCmp('inica_pass').getValue() == Ext.getCmp('hd_inica_pwd').getValue())
	{
		Ext.getCmp('inica_auth_win').hide();
		document.getElementById('win-space').innerHTML = "";
		return;
	}
		
	if(!_auth_form.getForm().isValid())
	{
		Ext.Msg.show({
		   title:'Error',
		   msg: 'Existen campos vacíos',
		   buttons: Ext.Msg.OK,
		   icon: Ext.MessageBox.ERROR
		});
	}
	else
	{
		BeginPaint();
		
		Ext.Ajax.request(
		{
			url		: 'Plugins/Auth/Server/inica_auth.php',
			method	:'POST',
			params	: {
						user 	: Ext.getCmp('inica_user').getValue(),
						pass 	: Ext.getCmp('inica_pass').getValue(),
						
						map_name: document.getElementById('map_name').value,
						extent	: document.getElementById('extent').value
						},
			callback: function (options,success,response)
					{
						var responseData = Ext.decode(response.responseText)
						EndPaint();
						
						if(responseData.success == true)
						{
							Ext.getCmp('hd_inica_user').setValue( Ext.getCmp('inica_user').getValue() );
							Ext.getCmp('hd_inica_pwd').setValue( Ext.getCmp('inica_pass').getValue() );
							
							mainApp.UpdateMapPanel(responseData.result);
							Ext.getCmp('layer_tree').getLoader().load(Ext.getCmp('layer_tree').getRootNode());
							Ext.getCmp('layer_tree').getRootNode().expand(true);
							
							Ext.getCmp('inica_auth_win').hide();
							document.getElementById('win-space').innerHTML = "";
						}
						else
						{
							Ext.Msg.show({
							   title:'Error',
							   msg: responseData.message,
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.ERROR
							});
						}
					}
		});
	}
}

var _auth_form = new Ext.form.FormPanel(
{
	frame : true,
	labelWidth : 70,
	items : 
	[
		{
            xtype:'fieldset',
            title: 'Registro',
            collapsible: false,
            autoHeight:true,
            items :
			[
				{
					layout : 'column',
					items:
					[
						{layout: 'form',
							columnWidth:1,
							defaults: { anchor :'90%'},
							defaultType: 'textfield',
							items:
							[
								{
									fieldLabel: 'Usuario',
									name: 'inica_user',
									id: 'inica_user',
									emptyText: 'usuario',
									allowBlank : false,
									emptyText : 'Usuario'
								},{
									fieldLabel: 'Contraseña',
									name: 'inica_pass',
									id: 'inica_pass',
									inputType : 'password',
									allowBlank : false
								}
							]
						}
					]
				}
            ]
        }
	]
});

function ShowAuthWin()
{
	_auth_form.getForm().reset();
	
	var _user_win = new Ext.Window({
		title: 'Autenticación',
		closable:false,
		modal: true,
		shadow:'frame',
		width:250,
		height: 170,
		border:true,
		plain:true,
		layout: 'fit',
		id : 'inica_auth_win',
		items: [_auth_form],
		buttons: 
		[
			{
				text  : 'Aceptar',
				handler : onAuthenticate.createDelegate()
			},
			{	
				text: 'Cerrar',
				handler: function(){_user_win.close();}
			}
		]
	});
	
	_user_win.show();
}

function onAuthenticateUser()
{
	if(Ext.getCmp('hd_inica_user').getValue() != 0 && Ext.getCmp('hd_inica_pwd').getValue() != 0)
	{
		Ext.Msg.show({
		   title: 'Alerta',
		   msg: 'Ya existe un usuario autenticado, si se identifica con otro usuario<br>perderá la sesión actual ¿Desea continuar?',
		   width: 500,
		   buttons: Ext.MessageBox.YESNO,
		   fn: function(buttonId){if(buttonId=='yes')ShowAuthWin();},
		   icon: Ext.MessageBox.WARNING
		});
	}
	else
		ShowAuthWin();
}

var _authUserBtn = new Ext.Button(
{
	id	 : 'auth_inica_user_btn',
	iconCls:'log_inica',
	tooltip	: 'Autenricarse',	
	handler : onAuthenticateUser.createDelegate(this)
});

mainApp.AddHiddenField('hd_inica_user','hd_inica_user',0);
mainApp.AddHiddenField('hd_inica_pwd','hd_inica_pwd',0);

mainApp.AddTBarButton('-');
mainApp.AddTBarButton(_authUserBtn);

var _auth_inica_user = [
		{text:'Autenricarse', iconCls: 'log_inica', handler: onAuthenticateUser.createDelegate()}		
	];
	
mainApp.AddMenu('Archivo',_auth_inica_user);