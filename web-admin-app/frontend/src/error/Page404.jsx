import React from 'react'
import fail from './atm-fail.jpg'

const Page404 = () => {
  return (
    <div className='fail-page'>
        <img src={fail} alt='Fallo'/>
        <span>El clásico 404... esta página no existe o aún no la hicimos :&#41;</span>
    </div>
  )
}

export default Page404