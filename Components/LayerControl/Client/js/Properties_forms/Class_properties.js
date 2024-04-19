/* This file is created or modified with 
 * Ext.ux.guid.plugin.GuiDesigner (v2.1.0) 
 */
{
  xtype : "form",
  title : "Propiedades de la clase",
  items : [    
  {
	xtype : "fieldset",
	autoHeight : true,
	title : "Datos",
	items : [	  
	{
		xtype : "textfield",
		fieldLabel : "Nombre",
		name : "class_name"
	},
	{
		xtype : "numberfield",
		fieldLabel : "Escala mínima",
		name : "class_min_scale"
	},	  
	{
		xtype : "numberfield",
		fieldLabel : "Escala máxima",
		name : "class_max_scale"
	},	  
	{
		xtype : "checkbox",
		fieldLabel : "Visible",
		inputValue : "class_visibility",
		name : "class_visibility"
	}]
  },    
  {
	xtype : "fieldset",
	autoHeight : true,
	title : "Representación"
  }],
  frame : true,
  border : true
}