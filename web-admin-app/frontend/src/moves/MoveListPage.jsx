import React from "react";

// assets
import icon from "./../assets/swap_horiz.svg";

// otros componentes
import PageHeader from "../common/PageHeader";

const MoveListPage = () => {
  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#ccffcc" icon={icon} name="Transacciones" />
      </div>
    </main>
  );
};

export default MoveListPage;
