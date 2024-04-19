<?php
include('Report/make_report_map.php');

	$pdf= new PDF();

	$st = Array('a3','a4','a5','letter','legal');
	$pages = array(	'a3' => array(841.89,1190.55),
					'a4' => array(595.28,841.89),
					'a5' => array(420.94,595.28),
					'letter' => array(612,792),
					'legal' => array(612,1008) );
	
	$_page_size = ($_GET['s'] == '') ? 3 : $_GET['s'];
	$size = $st[ $_page_size ];
	
	$pdf->ChangeFormatPrint($_GET['o'],'pt',$size);
	$pdf->CambiarFont();
	$pdf->AddPag();
	$pdf->AliasNbPages();
	$pdf->Header( utf8_decode( $_GET['t']));

	$_x = 15; 
	$_y = 60;	

	IF($_GET['o'] == 'l')
	{
		//$_z = 200;
		$_z = $pages[$size][1] - 15;
		$_h = $pages[$size][0] - 15;
		//$_h = 200;
		//$_w = $_z - 15;
		//$_ = $_z - 15;
	}
	else
	{
		//$_z = 250;
		//$_h = 190;
		//$_w = 200;
		
		$_z = $pages[$size][0] - 15;
		$_h = $pages[$size][1] - 15;
		
	}
	//$pdf->Image($_GET['img'],20,20,$_w,150);
	$pdf->Image('../../../Map/Generated/Img/'.$_GET['img'].'.png',15,40,$_z - 15,$_h - 60,'png');
	$pdf->Image('Report/header/msext_logo2.jpg',$_z - 55,8,51,42,'jpg');

	// Línea derecha
	$pdf->Line($_x,$_y,$_x,$_h);
	$pdf->Line($_x - 2,$_y - 2,$_x - 2,$_h + 2);
	
	// Línea superior
	$pdf->Line($_x,$_y,$_z,$_y);
	$pdf->Line($_x - 2,$_y - 2,$_z + 2,$_y - 2);
	
	// Linea izquierda
	$pdf->Line($_z,$_y,$_z,$_h);
	$pdf->Line($_z + 2,$_y - 2,$_z + 2,$_h + 2);
	
	// Linea inferior
	$pdf->Line($_x,$_h,$_z,$_h);
	$pdf->Line($_x - 2,$_h + 2,$_z + 2,$_h + 2);
	
	//$pdf->Image($_GET['img'],100,20,100,100);
	//$pdf->Footer('Los Locos');
	$pdf->Salida();
?>