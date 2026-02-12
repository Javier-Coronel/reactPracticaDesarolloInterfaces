import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import { MenuItem } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import api from "../api";

function AltaProveedor() {
  // Hook para navegación programática
  const navigate = useNavigate();

  // Estado del formulario
  const [proveedor, setProveedor] = useState({
    nombre: "",
    fechaCreacion: "",
    activa: true,
    recurso: "",
    cantidad: "",
    facturacion: "",
    empresaIdEmpresa: "",
  });
  const [empresas, setEmpresas] = useState([]);
  // Estado de validación de campos
  const [isCamposValidos, setIsCamposValidos] = useState({
    nombre: true,
    fechaCreacion: true,
    activa: true,
    recurso: true,
    cantidad: true,
    facturacion: true,
    empresaIdEmpresa: true,
  });

  // Estado para controlar si se está enviando el formulario
  const [isUpdating, setIsUpdating] = useState(false);

  // Estado del diálogo de resultado
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState("success");

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
   * Efecto para crear el proveedor cuando isUpdating cambia a true
   */
  useEffect(() => {
    async function fetchCreateProveedor() {
      try {
        // Enviar datos del proveedor al servidor
        const respuesta = await api.post("/proveedores/", proveedor);

        // Mostrar mensaje de éxito
        setDialogMessage(respuesta.mensaje);
        setDialogSeverity("success");
        setOpenDialog(true);
      } catch (error) {
        // Mostrar mensaje de error
        setDialogMessage(error.mensaje || "Error al crear el proveedor");
        setDialogSeverity("error");
        setOpenDialog(true);
      }
      // Indicar que la operación ha terminado
      setIsUpdating(false);
    }

    if (isUpdating) fetchCreateProveedor();
  }, [isUpdating]);

  /**
   * Maneja los cambios en los campos del formulario
   * @param {React.ChangeEvent} e - Evento del cambio
   */
  function handleChange(e) {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  }

  /**
   * Maneja el click en el botón de aceptar
   * Valida los datos antes de enviarlos
   */
  function handleClick() {
    // Evitar envíos duplicados
    if (isUpdating) return;

    if (validarDatos()) {
      setIsUpdating(true);
    }
  }

  /**
   * Maneja el cierre del diálogo de resultado
   */
  function handleDialogClose() {
    setOpenDialog(false);

    // Si fue éxito, navegar a la página de inicio
    if (dialogSeverity === "success") navigate("/");
  }

  /**
   * Valida los datos del formulario
   * @returns {boolean} true si todos los datos son válidos, false en caso contrario
   */
  function validarDatos() {
    let valido = true;
    let objetoValidacion = {
      nombre: true,
      descripcion: true,
      fechaCreacion: true,
      activa: true,
      facturacion: true,
      porcentajeEnBolsa: true,
    };

    // Validación del nombre: mínimo 10 caracteres
    if (proveedor.nombre.length > 50 || proveedor.nombre.length <= 0) {
      valido = false;
      objetoValidacion.nombre = false;
    }

    // Validación de la fecha: campo obligatorio
    if (!proveedor.fechaCreacion) {
      valido = false;
      objetoValidacion.fechaCreacion = false;
    }

    // Actualizar estado de validación
    setIsCamposValidos(objetoValidacion);

    return valido;
  }

  return (
    <>
      {/* Contenedor principal */}
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Tarjeta del formulario */}
        <Grid item size={{ xs: 12, sm: 9, md: 7 }}>
          <Paper elevation={6} sx={{ mt: 3, p: 3, maxWidth: 900, mx: "auto" }}>
            {/* Título del formulario */}
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              Creacion del proveedor
            </Typography>

            {/* Grid con los campos */}
            <Grid
              container
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Campo de nombre */}
              <Grid item size={{ xs: 10 }}>
                <TextField
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  name="nombre"
                  type="text"
                  maxLength="50"
                  value={proveedor.nombre}
                  onChange={handleChange}
                  error={!isCamposValidos.nombre}
                  helperText={
                    !isCamposValidos.nombre && "El nombre es obligatorio."
                  }
                />
              </Grid>

              {/* Campo de fecha de nacimiento */}
              <Grid item size={{ xs: 10 }}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                >
                  <DatePicker
                    label="Fecha de creacion"
                    name="fechaCreacion"
                    minDate={dayjs("1800-01-01")}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        required: true,
                        error: !isCamposValidos.fechaCreacion,
                        helperText: !isCamposValidos.fechaCreacion
                          ? "La fecha es obligatoria"
                          : "",
                      },
                    }}
                    value={
                      proveedor.fechaCreacion
                        ? dayjs(proveedor.fechaCreacion)
                        : null
                    }
                    onChange={(newValue) =>
                      setProveedor({
                        ...proveedor,
                        fechaCreacion: newValue.format("YYYY-MM-DD"),
                      })
                    }
                  />
                </LocalizationProvider>
              </Grid>

              {/* Campo de descripcion */}
              <Grid item size={{ xs: 10 }}>
                <TextField
                  fullWidth
                  id="descripcion"
                  label="Descripcion"
                  name="descripcion"
                  type="text"
                  multiline
                  maxRows={4}
                  minRows={2}
                  maxLength="50"
                  value={proveedor.descripcion}
                  onChange={handleChange}
                />
              </Grid>

              {/* Campo de facturacion de la proveedor */}
              <Grid item size={{ xs: 10 }}>
                <TextField
                  id="facturacion"
                  label="Facturacion del proveedor"
                  name="facturacion"
                  type="number"
                  value={proveedor.facturacion}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item size={{ xs: 10 }}>
                <TextField
                  select
                  required
                  fullWidth
                  id="empresaIdEmpresa"
                  label="Empresa"
                  name="empresaIdEmpresa"
                  value={proveedor.empresaIdEmpresa}
                  onChange={handleChange}
                  error={!isCamposValidos.empresaIdEmpresa}
                  helperText={
                    !isCamposValidos.empresaIdEmpresa &&
                    "Debe seleccionar una empresa"
                  }
                >
                  <MenuItem value="">
                    <em>Seleccionar empresa</em>
                  </MenuItem>
                  {empresas.map((empresa) => (
                    <MenuItem
                      key={empresa.id_empresa}
                      value={empresa.id_empresa}
                    >
                      {empresa.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* Campo de facturacion de la proveedor */}
              <Grid item size={{ xs: 10 }}>
                <FormControlLabel
                  label="¿Esta el proveedor activo?"
                  control={
                    <Checkbox
                      id="activa"
                      label="¿Esta el proveedor activo?"
                      name="activa"
                      value={proveedor.activa}
                      onChange={handleChange}
                    />
                  }
                />
              </Grid>
              {/* Botón de aceptar */}
              <Grid
                item
                size={{ xs: 10 }}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  loading={isUpdating}
                  defaultValue={proveedor.activa}
                  loadingPosition="end"
                  onClick={handleClick}
                >
                  Aceptar
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo de resultado */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        disableEscapeKeyDown
        aria-labelledby="result-dialog-title"
      >
        <DialogTitle id="result-dialog-title">
          {dialogSeverity === "success" ? "Operación correcta" : "Error"}
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity={dialogSeverity} variant="filled">
            {dialogMessage}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AltaProveedor;
