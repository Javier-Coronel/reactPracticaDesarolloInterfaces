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
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import Fab from "@mui/material/Fab";
import { Stack, Box } from "@mui/material";
import TextField from "@mui/material/TextField";

import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Label,
} from "recharts";
import generatePDF from "../utils/generatePDF";

/**
 * Componente que muestra el listado de empresas en tabla
 *
 * Características:
 * - Obtiene datos de empresas del servidor al montar el componente
 * - Permite eliminar empresas
 * - Botón flotante para descargar la tabla como PDF
 * - Manejo de errores y estados vacíos
 *
 * @component
 * @returns {JSX.Element} Tabla de empresas o mensajes de error/vacío
 */
function ListadoEmpresasFiltrado() {
  // Estado para almacenar los empresas
  const [datos, setDatos] = useState([]);

  // Estado para guardar la facturacion minima
  const [facturacion, setFacturacion] = useState("0");

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
        const respuesta = await api.get(`/empresas/facturation/${facturacion}`);

        // Actualizar estado con los datos obtenidos
        setDatos(respuesta.datos);
        setError(null);
      } catch (error) {
        // En caso de error, mostrar mensaje
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    if (facturacion) fetchEmpresas();
  }, [facturacion]);

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

  function handleChangeOfFacturacion(e) {
    setFacturacion(e.target.value);
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
  function dataGet() {
    // Mostrar mensaje si no hay empresas
    if (!datos || datos.length === 0) {
      return (
        <>
          <Typography variant="h5" align="center" sx={{ mt: 3 }}>
            No hay empresas disponibles
          </Typography>
        </>
      );
    } else {
      const dataToGraph = [];
      datos.map((row) => {
        dataToGraph.push({
          name: row.nombre,
          Facturacion: row.facturacion,
          "Porcentaje en bolsa": row.porcentajeEnBolsa,
        });
      });
      console.log(dataToGraph);
      return (
        <>
          <ResponsiveContainer
            width="100%"
            aspect={1.618}
            maxHeight={500}
            id="pdf-content"
          >
            <Label
              position="insideTop"
              value="Facturacion y porcentaje en bolsa de las empresas"
            ></Label>

            <BarChart responsive data={dataToGraph}>
              <CartesianGrid strokeDasharray="30 9"></CartesianGrid>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Facturacion" fill="#333" isAnimationActive={true} />
              <Bar
                dataKey="Porcentaje en bolsa"
                fill="#AAA"
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripcion</TableCell>
                  <TableCell align="center">Fecha creacion</TableCell>
                  <TableCell>¿Esta activa?</TableCell>
                  <TableCell>Facturacion</TableCell>
                  <TableCell>Porcentaje en bolsa</TableCell>
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
                      }}
                    >
                      {row.descripcion}
                    </TableCell>
                    <TableCell align="center">{row.fechaCreacion}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={row.activa}
                        disabled
                        slotProps={{
                          input: { "aria-label": "controlled" },
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
                          onClick={() => {
                            console.log("/modificarempresa/" + row.id_empresa);
                            navigate("/modificarempresa/" + row.id_empresa);
                          }}
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
  }

  return (
    <>
      {/* Contenedor con ID para capturar como PDF */}
      <Box>
        {/* Título */}
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Listado de empresas
        </Typography>
        <TextField
          id="facturacion"
          label="Facturacion de la empresa"
          name="facturacion"
          type="number"
          value={facturacion}
          onChange={handleChangeOfFacturacion}
        />
        {dataGet()}
      </Box>
    </>
  );
}

export default ListadoEmpresasFiltrado;
