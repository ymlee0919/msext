<?php
define('FPDF_FONTPATH','font/');
require('fpdf.php');

class PDF 
{
	var $pdf_maker;
 
function __construct()
{
	$this->pdf_maker = new FPDF();
} 

function Footer($text)
{
    $this->pdf_maker->Cell(0,170,$text,0,1,'L');
}

function AliasNbPages()
{
	$this->pdf_maker->AliasNbPages();
}

function SetTitle($title)
{
	$this->pdf_maker->SetTitle($title);
}

function Image($img, $x,$y,$w,$h, $img_type)
{
	$this->pdf_maker->Image($img,$x,$y,$w,$h,$img_type,'');
}

function CambiarFont()
{
	$this->pdf_maker->SetFont('Arial','',7);
}

function AddPag()
{
	$this->pdf_maker->AddPage();
}

function Salida()
{
	$this->pdf_maker->Output();
}

function Line($x1,$y1,$x2,$y2)
{
	$this->pdf_maker->Line($x1,$y1,$x2,$y2);
}

function ChangeFormatPrint($orientation,$unit,$format)
{
	$this->pdf_maker->FPDF($orientation,$unit,$format);
}
function Header($fila1)
{
	//Colores, ancho de línea y fuente en negrita
	$this->pdf_maker->SetFillColor(249,129, 129);
	$this->pdf_maker->SetTextColor(6,6,6);
	$this->pdf_maker->SetDrawColor(128,0,0);
	$this->pdf_maker->SetLineWidth(.3);
	$this->pdf_maker->SetFont('Arial','B',14);
	//Cabecera
	$this->pdf_maker->Cell(239,6,$fila1,0,0,'L',0);
	$this->pdf_maker->Ln();
	$this->pdf_maker->Ln();
}

}