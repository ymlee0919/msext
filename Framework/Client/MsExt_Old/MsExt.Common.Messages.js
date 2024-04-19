//-------------------------------------------------------------------
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
//-------------------------------------------------------------------
function Show_Message(text, type, icon)
{
   if(icon == 'info')
   {
		Ext.MessageBox.show(
		{
			title   : type,
			msg     : text,
			buttons : Ext.MessageBox.OK,			
			icon    : Ext.MessageBox.INFO
		});
	}
	else if(icon == 'error')
	{
		Ext.MessageBox.show(
		{
			title   : type,
			msg     : text,
			buttons : Ext.MessageBox.OK,
			icon    : Ext.MessageBox.ERROR		
		});
	}
	else if(icon == 'warning')
	{
		Ext.MessageBox.show(
		{
				title   : type,
				id      : 'message',
				msg     : text,
				buttons : Ext.MessageBox.OK,
				icon    : Ext.MessageBox.WARNING
		});

		Ext.getCmp('message').setIcon(icon)		
	}
	else if(icon == 'question')
	{
		Ext.MessageBox.show(
		{
				title   : type,
				id      : 'message',
				msg     : text,
				buttons : Ext.MessageBox.OK,
				icon    : Ext.MessageBox.QUESTION				
		});

		Ext.getCmp('message').setIcon(icon)	
	}

}
//-------------------------------------------------------------------

function msExt_Message()
{
	this._current_type = null;
	
	this.BlockScreen = function()
	{
		document.getElementById('blanck_screen').style.width = Ext.getBody().getWidth();
		document.getElementById('blanck_screen').style.height = Ext.getBody().getHeight();
	}
	
	this.FreeScreen = function()
	{
		document.getElementById('blanck_screen').style.width = 0;
		document.getElementById('blanck_screen').style.height = 0;
	}
	
	this.ShowMessage = function(Caption, Message, Type)
	{
		this.BlockScreen();
		
		if(this._current_type != Type)
		{
			document.getElementById('MessagesImage').innerHTML = document.getElementById(Type).innerHTML
			this._current_type = Type;
		}
		
		document.getElementById('loading-indicator').innerHTML = Caption;
		document.getElementById('loading_div-msg').innerHTML = Message;
		document.getElementById('loading_div').style.visibility = 'visible';
	}
	
	this.HideMessage = function()
	{
		this.FreeScreen();
		
		document.getElementById('loading_div').style.visibility = 'hidden';
	}
}

MsExt.Common.Message = new msExt_Message();