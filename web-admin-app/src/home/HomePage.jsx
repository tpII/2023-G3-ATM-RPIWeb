import './HomePage.css'

// link to route
import { Link } from 'react-router-dom'

function HomePage() {
  return <div className='main-buttons'>
    <Link to="/users">Usuarios</Link>
    <Link to="/cards">Tarjetas</Link>
    <Link to="/moves">Transacciones</Link>
  </div>
}

export default HomePage