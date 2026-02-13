/**
 * @fileoverview Componente PDF para exportar listado de empresas filtradas
 * 
 * Componente React-PDF que genera un documento PDF con tabla de empresas.
 * Utiliza StyleSheet para estilizar tabla de 6 columnas con bordes, 
 * encabezados con color de fondo gris y truncamiento de sinopsis.
 * 
 * @module components/ListadoEmpresasFiltroPDF
 * @requires @react-pdf/renderer
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

/**
 * Estilos para el documento PDF de empresas
 * Define página, tabla, encabezados y celdas con bordes y colores
 * Tabla de 6 columnas con ancho de 20% cada una
 * @type {StyleSheet}
 */
const styles = StyleSheet.create({
  // Estilos de página: padding interno y tamaño de fuente base
  page: {
    padding: 20,
    fontSize: 9,
  },
  // Estilos del título: centrado, fuerte, con separación inferior
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  // Estilos de tabla: ancho completo, flexbox para filas
  table: {
    display: "table",
    width: "100%",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: "#bfbfbf",
    marginTop: 20,
  },
  // Estilos de fila: dirección horizontal
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  // Estilos de encabezado: fondo gris, bordes, 20% ancho (5 columnas)
  tableColHeader: {
    width: "18%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#000",
    padding: 8,
    fontWeight: "bold",
    color: "#FFF"
  },
  smallTableColHeader: {
    width: "16%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#000",
    padding: 8,
    fontWeight: "bold",
    color: "#FFF"

  },
  // Estilos de columna de datos: bordes, ancho proporcional
  tableCol: {
    width: "18%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 8,
  },
  smallTableCol: {
    width: "16%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 8,

  },
  // Estilos de celda: tamaño de fuente reducido para tabla
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 8,
  },
});

/**
 * Componente PDF para exportar listado de empresas
 * 
 * Genera un documento PDF con una tabla de 6 columnas
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.data - Array de empresas a mostrar en la tabla
 * @param {string} props.data[].nombre - Nombre de la emresa
 * @param {Object} props.data[].descripcion - Descripcion de la emresa
 * @param {string} props.data[].fechaCreacion - Fecha de creacion de la empresa
 * @param {string} props.data[].activa - Si la empresa esta activa
 * @param {string} props.data[].facturacion - Facturacion de la empresa
 * @param {string} props.data[].porcentajeEnBolsa - Porcentage de la empresa que esta en bolsa
 * @returns {JSX.Element} Documento PDF con la tabla de empresas
 */
function ListadoEmpresasFiltroPDF({ data }) {
  return (
    // Documento PDF con página tamaño A4
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Título del documento PDF */}
        <View style={styles.title}>
          <Text>Listado de Empresas</Text>
        </View>

        {/* Tabla principal */}
        <View style={styles.table}>
          {/* Fila de encabezados */}
          <View style={styles.tableRow}>
            {/* Columna: Nombre */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Nombre</Text>
            </View>
            {/* Columna: Descripcion */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Descripcion</Text>
            </View>
            {/* Columna: Fecha creacion */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Fecha creacion</Text>
            </View>
            {/* Columna: ¿Esta activa? */}
            <View style={styles.smallTableColHeader}>
              <Text style={styles.tableCell}>¿Esta activa?</Text>
            </View>
            {/* Columna: Facturacion */}
            <View style={styles.smallTableColHeader}>
              <Text style={styles.tableCell}>Facturacion</Text>
            </View>
            {/* Columna: Porcentaje en bolsa */}
            <View style={styles.smallTableColHeader}>
              <Text style={styles.tableCell}>Porcentaje en bolsa</Text>
            </View>
          </View>

          {/* Renderizar filas de datos para cada empresa */}
          {data.map((empresa, index) => (
            <View style={styles.tableRow} key={index}>
              {/* Celda: Nombre de la empresa */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{empresa.nombre}</Text>
              </View>
              {/* Celda: Descripcion de la empresa */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{empresa.descripcion}</Text>
              </View>
              {/* Celda: Fecha en la que se creo la empresa */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{empresa.fechaCreacion}</Text>
              </View>
              {/* Celda: ¿Esta la empresa activa? */}
              <View style={styles.smallTableCol}>
                <Text style={styles.tableCell}>{empresa.activa?"Si":"No"}</Text>
              </View>
              {/* Celda: Facturacion de la empresa */}
              <View style={styles.smallTableCol}>
                <Text style={styles.tableCell}>{empresa.facturacion}</Text>
              </View>
              {/* Celda: Porcentage de la empresa que esta en bolsa */}
              <View style={styles.smallTableCol}>
                <Text style={styles.tableCell}>{empresa.porcentajeEnBolsa}</Text>
              </View>
              
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export default ListadoEmpresasFiltroPDF;