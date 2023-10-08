import React from 'react'
import icon from '../home/settings.svg'
import PageHeader from '../common/PageHeader'

const SettingsPage = () => {
  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#cccccc" name="Opciones" icon={icon} />
      </div>
    </main>
  )
}

export default SettingsPage