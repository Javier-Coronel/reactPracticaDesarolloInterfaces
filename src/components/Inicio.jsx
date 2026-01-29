/**
 * @fileoverview Componente de página de inicio de la aplicación
 * 
 * Página de bienvenida que se muestra como landing page principal de la aplicación.
 * Utiliza componentes de Material-UI para mostrar un mensaje centrado en la pantalla.
 * 
 * @module components/Inicio
 * @requires @mui/material
 */

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

/**
 * Componente de página de inicio
 * 
 * Características:
 * - Centrado vertical y horizontal en la pantalla
 * - Altura mínima que cubre toda la viewport (menos la altura del navbar)
 * - Mensaje de bienvenida en tamaño grande (variant h3)
 * 
 * @component
 * @returns {JSX.Element} Página de inicio con mensaje de bienvenida
 */
function Inicio() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 100px)",
      }}
    >
      {/* Mensaje de bienvenida principal */}
      <Typography variant="h3" align="center">
        Bienvenido a la mejor web de cine
      </Typography>
    </Box>
  );
}

export default Inicio;