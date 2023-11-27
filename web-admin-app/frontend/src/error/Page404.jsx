import React from 'react'
import fail from './atm-fail.jpg'

const Page404 = () => {
  return (
    <div className='fail-page'>
        <img src={fail} alt='Fallo'/>
        <span>Esta página no existe, disculpe las molestias</span>
    </div>
  )
}

export default Page404