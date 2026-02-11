import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox"

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import api from "../api";


function ModificarEmpresa() {
    // Hook para navegación programática
    const navigate = useNavigate();

    // Estado del formulario
    const [empresa, setEmpresa] = useState({
        nombre: "",
        descripcion: "",
        fechaCreacion: "",
        activa: true,
        facturacion: "",
        porcentajeEnBolsa: ""
    });

    // Estado de validación de campos
    const [isCamposValidos, setIsCamposValidos] = useState({
        nombre: true,
        descripcion: true,
        fechaCreacion: true,
        activa: true,
        facturacion: true,
        porcentajeEnBolsa: true

    });

    // Estado para controlar si se está enviando el formulario
    const [isUpdating, setIsUpdating] = useState(false);

    // Estado del diálogo de resultado
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogSeverity, setDialogSeverity] = useState("success");

    const { id_empresa } = useParams();

    /**
     * Efecto para crear el empresa cuando isUpdating cambia a true
     */
    useEffect(() => {
        async function fetchUpdateEmpresa() {
            try {
                // Enviar datos del empresa al servidor
                const respuesta = await api.put(`/empresas/${id_empresa}`, empresa);

                // Mostrar mensaje de éxito
                setDialogMessage(respuesta.mensaje);
                setDialogSeverity("success");
                setOpenDialog(true);
            } catch (error) {
                // Mostrar mensaje de error
                setDialogMessage(error.mensaje || "Error al crear el empresa");
                setDialogSeverity("error");
                setOpenDialog(true);
            }
            // Indicar que la operación ha terminado
            setIsUpdating(false);
        }

        if (isUpdating) fetchUpdateEmpresa();
    }, [isUpdating]);
    useEffect(() => {
    async function fetchEmpresa() {
      try {
        // Obtener datos de la empresa del servidor
        
        const respuesta = await api.get("/empresas/"+id_empresa);

        // Establecer los datos en el formulario
        setEmpresa(respuesta.datos);
      } catch (error) {
        // Mostrar error si no se pueden recuperar los datos
        setDialogMessage(error.mensaje || "Error al recuperar los datos de la empresa");
        setDialogSeverity("error");
        setOpenDialog(true);
      }
    }

    fetchEmpresa();
  }, [id_empresa]);
    /**
     * Maneja los cambios en los campos del formulario
     * @param {React.ChangeEvent} e - Evento del cambio
     */
    function handleChange(e) {
        setEmpresa({ ...empresa, [e.target.name]: e.target.value });
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
            porcentajeEnBolsa: true
        };

        // Validación del nombre: mínimo 10 caracteres
        if (empresa.nombre.length > 50 || empresa.nombre.length <= 0) {
            valido = false;
            objetoValidacion.nombre = false;
        }

        // Validación de la fecha: campo obligatorio
        if (!empresa.fechaCreacion) {
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
                            Creacion de la empresa
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
                                    value={empresa.nombre}
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
                                            empresa.fechaCreacion ? dayjs(empresa.fechaCreacion) : null
                                        }
                                        onChange={(newValue) =>
                                            setEmpresa({
                                                ...empresa,
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
                                    value={empresa.descripcion}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Campo de facturacion de la empresa */}
                            <Grid item size={{ xs: 10 }}>
                                <TextField
                                    id="facturacion"
                                    label="Facturacion de la empresa"
                                    name="facturacion"
                                    type="number"
                                    value={empresa.facturacion}
                                    onChange={handleChange}
                                />
                            </Grid>
                            {/* Campo de que porcentaje de la empresa esta en bolsa */}
                            <Grid item size={{ xs: 10 }}>
                                <TextField
                                    id="porcentajeEnBolsa"
                                    label="Porcentaje en bolsa de la empresa"
                                    name="porcentajeEnBolsa"
                                    type="number"
                                    value={empresa.porcentajeEnBolsa}
                                    onChange={handleChange}
                                />
                            </Grid>
                            {/* Campo de facturacion de la empresa */}
                            <Grid item size={{ xs: 10 }}>
                                <FormControlLabel
                                    label="¿Esta la empresa activa?"
                                    control={
                                        <Checkbox
                                            id="activa"
                                            label="¿Esta la empresa activa?"
                                            name="activa"
                                            value={empresa.activa}
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
                                    defaultValue={empresa.activa}
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

export default ModificarEmpresa;