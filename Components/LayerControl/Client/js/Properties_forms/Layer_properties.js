/* This file is created or modified with 
 * Ext.ux.guid.plugin.GuiDesigner (v2.1.0) 
 */
{
  xtype : "form",
  border : true,
  frame : true,
  title : "Propiedad de la capa",
  items : [    {
      xtype : "fieldset",
      title : "Capa",
      autoHeight : true,
      items : [        {
          layout : "column",
          items : [            {
              title : "Datos",
              layout : "form",
              labelWidth : 100,
              items : [                {
                  xtype : "textfield",
                  fieldLabel : "Nombre",
                  name : "layer_name"
              },                {
                  xtype : "textfield",
                  fieldLabel : "Grupo",
                  disabled : true,
                  name : "layer_group"
              },                {
                  xtype : "textfield",
                  fieldLabel : "Tipo",
                  disabled : true,
                  name : "layer_type"
              },                {
                  xtype : "checkbox",
                  boxLabel : "Visible",
                  fieldLabel : "Visible",
                  inputValue : "layer_visible",
                  name : "layer_visible"
              },                {
                  xtype : "numberfield",
                  fieldLabel : "Escala mínima",
                  name : "layer_minscale"
              },                {
                  xtype : "numberfield",
                  name : "numbervalue",
                  fieldLabel : "Escala máxima"
              }],
              width : 350,
              height : 250,
              border : true,
              frame : true
          },            {
              title : "Metadatos",
              layout : "form",
              items : [                {
                  xtype : "editorgrid",
                  border : false,
                  viewConfig : {
    forceFit : true
},
                  ds : new Ext.data.Store(
         {reader: new Ext.data.ArrayReader(
                          {}, 
                          [
                            {name: 'field'},
                            {name: 'value'}
                          ]),
                           data: [['Table','public.geom']]}),
                  cm : new Ext.grid.ColumnModel(
         [new Ext.grid.RowNumberer(),
               {header: 'Campo', width: 120, sortable: true, dataIndex: 'field'},
               {header: 'Valor', width: 120, sortable: true, dataIndex: 'value'}
         ]
),
                  frame : false,
                  height : 230,
                  width : 340
              }],
              border : true,
              frame : true,
              height : 250,
              width : 350
          }]
      }],
      height : 450,
      width : 725
  },    {
      xtype : "fieldset",
      title : "Representación",
      height : 114,
      width : 725
  }],
  json : {
  size : {
    width : 717,
    height : 518
}
},
  width : 750,
  buttonAlign : "center",
  buttons : ['Aceptar','Aplicar','Cerrar']
}