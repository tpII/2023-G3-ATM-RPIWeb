import React from 'react'
import { Link } from "react-router-dom";

// estilos
import "./styles.css"

function UserListPage() {
  return (
    <main className="main-content">
      
        <Link to="/users/add">
            <div className="main-buttons">
                <button className='big-btn'>Agregar Usuario</button>
            </div>
        </Link>

    </main>
  )
}

export default UserListPage