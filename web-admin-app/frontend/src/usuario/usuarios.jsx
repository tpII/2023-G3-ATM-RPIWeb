import React from 'react'
import { Link, useNavigate } from "react-router-dom";
function Usuario() {
  return (
    <main className="usuario">
      
        <Link to="/agregarusuario">
            <div className="main-buttons">
                <button>Agregar Usuario</button>
            </div>
        </Link>
    </main>
  )
}

export default Usuario