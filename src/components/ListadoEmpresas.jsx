/**
 * @fileoverview Componente para mostrar el listado de empresas en una tabla
 * 
 * Muestra todos los empresas registrados en la base de datos en formato tabla.
 * Permite editar, eliminar y descargar los datos como PDF.
 * 
 * @module components/ListadoEmpresas
 * @requires react
 * @requires @mui/material
 * @requires ../api
 */

import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox"
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import Fab from "@mui/material/Fab";
import { Stack, Box } from "@mui/material";

import api from "../api";
import { useNavigate } from "react-router-dom";
//import generatePDF from "../utils/generatePDF";

/**
 * Componente que muestra el listado de empresas en tabla
 * 
 * Características:
 * - Obtiene datos de empresas del servidor al montar el componente
 * - Muestra tabla con información: nombre, fecha nacimiento, biografía, foto
 * - Permite eliminar empresas
 * - Permite editar empresas (navega a /empresas/edit/:id)
 * - Botón flotante para descargar la tabla como PDF
 * - Manejo de errores y estados vacíos
 * 
 * @component
 * @returns {JSX.Element} Tabla de empresas o mensajes de error/vacío
 */
function ListadoEmpresas() {
  // Estado para almacenar los empresas
  const [datos, setDatos] = useState([]);

  // Estado para manejar errores
  const [error, setError] = useState(null);

  // Hook para navegación programática
  const navigate = useNavigate();

  /**
   * Efecto para cargar los empresas al montar el componente
   */
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        // Obtener empresas del backend
        const respuesta = await api.get("/empresas/");

        // Actualizar estado con los datos obtenidos
        setDatos(respuesta.datos);
        setError(null);
      } catch (error) {
        // En caso de error, mostrar mensaje
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    fetchEmpresas();
  }, []);

  /**
   * Maneja la eliminación de una empresa
   * @async
   * @function
   * @param {number} id_empresa - ID del empresa a eliminar
   */
  async function handleDelete(id_empresa) {
    try {
      // Enviar solicitud de eliminación al servidor
      await api.delete("/empresas/" + id_empresa);

      // Filtrar el empresa eliminado del estado local
      const datos_nuevos = datos.filter(
        (empresa) => empresa.id_empresa != id_empresa,
      );

      // Actualizar el estado sin la empresa eliminada
      setDatos(datos_nuevos);
      setError(null);
    } catch (error) {
      // Mostrar error si algo falla
      setError(error.mensaje || "No se pudo conectar al servidor");
      setDatos([]);
    }
  }

  // Mostrar mensaje si hay error
  if (error != null) {
    return (
      <>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          {error}
        </Typography>
      </>
    );
  }

  // Mostrar mensaje si no hay empresas
  if (!datos || datos.length === 0) {
    return (
      <>
        <Typography variant="h5" align="center" sx={{ mt: 3 }}>
          No hay empresas disponibles
        </Typography>
      </>
    );
  }

  return (
    <>
      {/* Contenedor con ID para capturar como PDF */}
      <Box id="pdf-content">
        {/* Título */}
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Listado de empresas
        </Typography>
¡
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell align="center">Fecha creacion</TableCell>
                <TableCell>¿Esta activa?</TableCell>
                <TableCell>Facturacion</TableCell>
                <TableCell>Porcentage en bolsa</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {datos.map((row) => (
                <TableRow key={row.id_empresa}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "500px",
                      textWrap: "wrap",
                      overflow: "hidden",
                    }}>{row.descripcion}</TableCell>
                  <TableCell align="center">{row.fechaCreacion}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={row.activa}
                      disabled
                      slotProps={{
                        input: { 'aria-label': 'controlled' },
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.facturacion}</TableCell>
                  <TableCell>{row.porcentajeEnBolsa}</TableCell>
                  <TableCell>
                    <Stack
                      sx={{ width: "100%" }}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      {/* Botón para eliminar */}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(row.id_empresa)}
                      >
                        <DeleteIcon />
                      </Button>

                      {/* Botón para editar */}
                      <Button
                        sx={{ ml: 1 }}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          navigate("/modificarempresa/" + row.id_empresa)
                        }
                      >
                        <EditIcon />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Botón flotante para descargar PDF */}
      <Fab
        color="secondary"
        aria-label="imprimir"
        onClick={() => generatePDF("pdf-content", "empresas")}
        sx={{
          position: "fixed",
          top: 85,
          right: 20,
        }}
      >
        <PrintIcon />
      </Fab>
    </>
  );
}

export default ListadoEmpresas;