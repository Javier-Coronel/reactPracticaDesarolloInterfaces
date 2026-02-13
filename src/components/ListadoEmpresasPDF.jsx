/**
 * @fileoverview Componente PDF para exportar listado de películas filtradas
 * 
 * Componente React-PDF que genera un documento PDF con tabla de películas.
 * Utiliza StyleSheet para estilizar tabla de 5 columnas con bordes, 
 * encabezados con color de fondo gris y truncamiento de sinopsis.
 * 
 * @module components/ListadoPeliculasFiltroPDF
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
 * Estilos para el documento PDF de películas
 * Define página, tabla, encabezados y celdas con bordes y colores
 * Tabla de 5 columnas con ancho de 20% cada una
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
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f0f0f0",
    padding: 8,
    fontWeight: "bold",
  },
  // Estilos de columna de datos: bordes, ancho proporcional
  tableCol: {
    width: "20%",
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
 * Componente PDF para exportar listado de películas
 * 
 * Genera un documento PDF con tabla de 5 columnas:
 * - Título de la película
 * - Fecha de lanzamiento
 * - Nombre del director
 * - Sinopsis (truncada a 60 caracteres)
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array<Object>} props.data - Array de películas a mostrar en la tabla
 * @param {string} props.data[].title - Título de la película
 * @param {string} props.data[].release_date - Fecha de lanzamiento (formato YYYY-MM-DD)
 * @param {Object} props.data[].id_director_director - Relación con el director
 * @param {string} props.data[].id_director_director.name - Nombre del director
 * @param {string} props.data[].synopsis - Sinopsis de la película (se trunca a 60 caracteres)
 * @returns {JSX.Element} Documento PDF con tabla de películas
 */
function ListadoPeliculasFiltroPDF({ data }) {
  return (
    // Documento PDF con página tamaño A4
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Título del documento PDF */}
        <View style={styles.title}>
          <Text>Listado de Películas</Text>
        </View>

        {/* Tabla principal */}
        <View style={styles.table}>
          {/* Fila de encabezados */}
          <View style={styles.tableRow}>
            {/* Columna: Título */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Título</Text>
            </View>
            {/* Columna: Lanzamiento */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Lanzamiento</Text>
            </View>
            {/* Columna: Director */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Director</Text>
            </View>
            {/* Columna: Sinopsis */}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>Sinopsis</Text>
            </View>
          </View>

          {/* Renderizar filas de datos para cada película */}
          {data.map((pelicula, index) => (
            <View style={styles.tableRow} key={index}>
              {/* Celda: Título de la película */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{pelicula.title}</Text>
              </View>
              {/* Celda: Fecha de lanzamiento de la película */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{pelicula.release_date}</Text>
              </View>
              {/* Celda: Nombre del director asociado a la película */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {pelicula.id_director_director.name || ""}
                </Text>
              </View>
              {/* Celda: Sinopsis truncada a 60 caracteres más puntos suspensivos */}
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {pelicula.synopsis
                    ? pelicula.synopsis.substring(0, 60) + "..."
                    : ""}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export default ListadoPeliculasFiltroPDF;