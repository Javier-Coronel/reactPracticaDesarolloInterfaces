/**
 * @fileoverview Función para generar archivos PDF a partir de contenido HTML
 * 
 * Utiliza html2canvas para capturar el contenido HTML y jsPDF para crear
 * documentos PDF. Permite descargar tablas y listas como archivos PDF.
 * 
 * @module utils/generatePDF
 * @requires html2canvas
 * @requires jspdf
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Genera un archivo PDF a partir del contenido de un elemento HTML
 * 
 * Proceso:
 * 1. Captura el elemento HTML especificado usando html2canvas
 * 2. Convierte el canvas a imagen PNG
 * 3. Crea un documento PDF en formato A4
 * 4. Ajusta la altura proporcional del contenido
 * 5. Agrega la imagen al PDF
 * 6. Descarga el archivo con el nombre especificado
 * 
 * @async
 * @function
 * @param {string} zonaImpresion - ID del elemento HTML a convertir a PDF
 * @param {string} nombreDocumento - Nombre del archivo PDF a descargar (sin extensión)
 * 
 * @returns {void} No retorna valor, inicia la descarga del PDF
 * 
 * @example
 * // Descargar un tabla como PDF
 * generatePDF("pdf-content", "listado-directores")
 * // Descargará un archivo: listado-directores.pdf
 */
const generatePDF = (zonaImpresion, nombreDocumento) => {
  // Obtener el elemento HTML a convertir
  const input = document.getElementById(zonaImpresion);
  
  // Capturar el elemento como imagen canvas
  html2canvas(input, {
    scale: 2,
    // Ignorar elementos con clase 'omitir-pdf' (ej: botones de acciones)
    ignoreElements: (el) => el.classList.contains("omitir-pdf"),
  }).then((canvas) => {
    // Convertir el canvas a imagen PNG
    const imgData = canvas.toDataURL("image/png");
    
    // Crear un nuevo documento PDF en formato A4 (horizontal)
    const pdf = new jsPDF("p", "mm", "a4");
    
    // Dimensiones del PDF A4
    const imgWidth = 210; // Ancho de A4 en milímetros
    
    // Calcular altura proporcional basada en el ancho
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Agregar imagen al PDF sin márgenes
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    
    // Descargar el PDF con el nombre especificado
    pdf.save(nombreDocumento + ".pdf");
  });
};

export default generatePDF;