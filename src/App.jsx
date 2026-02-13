import { createBrowserRouter, RouterProvider } from "react-router";

import ListadoEmpresas from "./components/ListadoEmpresas"
import ListadoProveedores from "./components/ListadoProveedores"
import ListadoEmpresasFiltrado from "./components/ListadoEmpresasFiltrado"
import ListadoProveedoresFiltrado from "./components/ListadoProveedoresFiltrado"
import AltaEmpresa from "./components/AltaEmpresa"
import AltaProveedor from "./components/AltaProveedor"
import ModificarEmpresa from "./components/ModificarEmpresa"
import ModificarProveedor from "./components/ModificarProveedor"
import Inicio from "./components/Inicio"
import Home from "./pages/Home"
//import PaginaError from "./pages/PaginaError"
import './App.css'
/**
 * Rutas de la aplicación
 */
let router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    //errorElement: <PaginaError />,
    children: [
      {
        index:true,
        Component: Inicio
      },
      {
        path: "listadoempresas",
        element: <ListadoEmpresas />,
      },
      {
        path: "listadoproveedores",
        element: <ListadoProveedores />,
      },
      {
        path: "listadoempresasfacturacionmin/",
        element: <ListadoEmpresasFiltrado />,
      },
      {
        path: "listadoproveedoresporempresa/",
        element: <ListadoProveedoresFiltrado />,
      },
      {
        path: "altaempresa",
        element: <AltaEmpresa />,
      },
      {
        path: "altaproveedor",
        element: <AltaProveedor />,
      },
      {
        path: "modificarempresa/:id_empresa",
        element: <ModificarEmpresa />,
      },
      {
        path: "modificarproveedor/:id_proveedor",
        element: <ModificarProveedor />,
      },
    ],
  },
]);

function App() {

  return (
      <RouterProvider router={router}/>
  )
}

export default App
