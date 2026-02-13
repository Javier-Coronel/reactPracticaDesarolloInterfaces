/**
 * @fileoverview Componente para mostrar el listado de proveedores filtrado por una empresa.
 *
 * Muestra todos los proveedores registrados en la base de datos filtrado por una empresa.
 * Permite editar, eliminar y descargar los datos como PDF.
 *
 * @module components/ListadoProveedores
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
import { MenuItem } from "@mui/material";

import api from "../api";
import { useNavigate } from "react-router-dom";
import generatePDF from "../utils/generatePDF";

/**
 * Componente que muestra el listado de proveedores en tabla
 *
 * Características:
 * - Obtiene datos de proveedores del servidor al montar el componente
 * - Muestra tabla la información correspondiente
 * - Permite eliminar proveedores
 * - Permite editar proveedores (navega a /modificarproveedor/:id)
 * - Botón flotante para descargar la tabla como PDF
 * - Manejo de errores y estados vacíos
 *
 * @component
 * @returns {JSX.Element} Tabla de proveedores o mensajes de error/vacío
 */
function ListadoProveedoresFiltrado() {
  // Estado para almacenar los proveedores
  const [datos, setDatos] = useState([]);

  const [empresas, setEmpresas] = useState([]);
  const [empresa, setEmpresa] = useState("");

  // Estado para manejar errores
  const [error, setError] = useState(null);

  // Hook para navegación programática
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmpresas() {
      try {
        // Obtener lista de empresas del servidor
        const respuesta = await api.get("/empresas/");
        setEmpresas(respuesta.datos);
      } catch (error) {
        // Mostrar error si no se pueden recuperar las empresas
        setDialogMessage(error.mensaje || "Error al recuperar las empresas");
        setDialogSeverity("error");
        setOpenDialog(true);
      }
    }

    fetchEmpresas();
  }, []);

  /**
   * Efecto para cargar los proveedores al montar el componente
   */
  useEffect(() => {
    async function fetchProveedores() {
      try {
        // Obtener proveedores del backend
        const respuesta = await api.get(`/proveedores/empresa/${empresa}`);

        // Actualizar estado con los datos obtenidos
        setDatos(respuesta.datos);
        setError(null);
      } catch (error) {
        // En caso de error, mostrar mensaje
        setError(error.mensaje || "No se pudo conectar al servidor");
        setDatos([]);
      }
    }

    if (empresa) fetchProveedores();
  }, [empresa]);

  /**
   * Maneja la eliminación de un proveedor
   * @async
   * @function
   * @param {number} id_proveedor - ID del proveedor a eliminar
   */
  async function handleDelete(id_proveedor) {
    try {
      // Enviar solicitud de eliminación al servidor
      await api.delete("/proveedores/" + id_proveedor);

      // Filtrar el proveedor eliminado del estado local
      const datos_nuevos = datos.filter(
        (proveedor) => proveedor.id_proveedor != id_proveedor,
      );

      // Actualizar el estado sin el proveedor eliminado
      setDatos(datos_nuevos);
      setError(null);
    } catch (error) {
      // Mostrar error si algo falla
      setError(error.mensaje || "No se pudo conectar al servidor");
      setDatos([]);
    }
  }
  function handleChangeOfEmpresa(e) {
    setEmpresa(e.target.value);
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
    // Mostrar mensaje si no hay proveedores
    if (!datos || datos.length === 0) {
      return (
        <>
          <Typography variant="h5" align="center" sx={{ mt: 3 }}>
            No hay proveedores a mostrar
          </Typography>
        </>
      );
    } else {
      return (
        <>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell align="center">Fecha de creacion</TableCell>
                  <TableCell>Recurso</TableCell>
                  <TableCell>Cantidad del recurso</TableCell>
                  <TableCell>Facturacion</TableCell>
                  <TableCell>Prove a la empresa:</TableCell>
                  <TableCell>¿Esta activa?</TableCell>
                  <TableCell align="center" className="omitir-pdf">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {datos.map((row) => (
                  <TableRow key={row.id_proveedor}>
                    <TableCell>{row.nombre}</TableCell>
                    <TableCell align="center">{row.fechaCreacion}</TableCell>
                    <TableCell>{row.recurso}</TableCell>
                    <TableCell>{row.cantidad}</TableCell>
                    <TableCell>{row.facturacion}</TableCell>
                    <TableCell>
                      {row.empresa ? row.empresa.nombre : "Ninguna"}
                    </TableCell>

                    <TableCell align="center">
                      <Checkbox
                        checked={row.activa}
                        disabled
                        slotProps={{
                          input: { "aria-label": "controlled" },
                        }}
                      />
                    </TableCell>
                    <TableCell
                        className="omitir-pdf"
                        >
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
                          onClick={() => handleDelete(row.id_proveedor)}
                        >
                          <DeleteIcon />
                        </Button>

                        {/* Botón para editar */}
                        <Button
                          sx={{ ml: 1 }}
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            console.log(
                              "/modificarproveedor/" + row.id_proveedor,
                            );
                            navigate("/modificarproveedor/" + row.id_proveedor);
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
            className="omitir-pdf"
            onClick={() => generatePDF("pdf-content", "proveedores")}
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
      <Box id="pdf-content">
        {/* Título */}
        <Typography variant="h4" align="center" sx={{ my: 3 }}>
          Listado de proveedores
        </Typography>
        <TextField
          select
          required
          fullWidth
          id="empresaIdEmpresa"
          className="omitir-pdf"
          label="Empresa"
          name="empresaIdEmpresa"
          value={empresa}
          onChange={handleChangeOfEmpresa}
        >
          <MenuItem value="">
            <em>Seleccionar empresa</em>
          </MenuItem>
          {empresas.map((empresaToShow) => (
            <MenuItem
              key={empresaToShow.id_empresa}
              value={empresaToShow.id_empresa}
            >
              {empresaToShow.nombre}
            </MenuItem>
          ))}
        </TextField>
        {dataGet()}
      </Box>
    </>
  );
}

export default ListadoProveedoresFiltrado;
