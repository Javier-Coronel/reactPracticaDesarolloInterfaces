import {
  MDBCollapse,
  MDBContainer,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
  MDBNavbar,
  MDBNavbarItem,
  MDBNavbarNav,
  MDBNavbarToggler,
} from "mdb-react-ui-kit";
import { useState } from "react";
import { Link } from "react-router";

/**
 * Componente para el menú de navegación.
 * @component
 * @returns {JSX.Element} JSX element del componente Menu.
 */
function Menu() {
  const [openBasic, setOpenBasic] = useState(false);


  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer fluid>

        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setOpenBasic(!openBasic)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar open={openBasic} className="w-100">
          <MDBNavbarNav className="w-100 d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="nav-link" role="button">
                    Empresas
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <Link to="/altaempresa" style={{ color: "#4f4f4f" }}>
                      <MDBDropdownItem link>Creacion de empresa</MDBDropdownItem>
                    </Link>

                    <Link to="/listadoempresas" style={{ color: "#4f4f4f" }}>
                      <MDBDropdownItem link>Listado de empresas</MDBDropdownItem>
                    </Link>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="nav-link" role="button">
                    Proveedores
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <Link to="/altaproveedor" style={{ color: "#4f4f4f" }}>
                      <MDBDropdownItem link>Creacion de proveedor</MDBDropdownItem>
                    </Link>

                    <Link to="/listadoproveedores" style={{ color: "#4f4f4f" }}>
                      <MDBDropdownItem link>Listado de proveedores</MDBDropdownItem>
                    </Link>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
            </div>

            
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
export default Menu;