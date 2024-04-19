// Main namespace
MsExt = {version: '2.0'};

// Namespace for controlers objects
MsExt.Controllers = {version: '2.0'};

// Namespace for components
MsExt.Components = {version: '2.0'};

// Namespace for common objects
MsExt.Common = {version: '2.0'};

// Namespace for object with core functions
MsExt.Core = {version: '2.0'};

// Definitions and functions for layers management
//-----------------------------------------------
// Types of items in the LayerControl
MsExt.ROOT  = '_ROOT';
MsExt.GROUP = 'GROUP';
MsExt.LAYER = 'LAYER';
MsExt.CLASS = 'CLASS';
MsExt.LABEL = 'LABEL';
// Function to get the type on object in the layer control
MsExt.TypeOf = function(Node)
{
	return Node.data.id.substr(0,5);
}