import React, { useEffect, useState } from 'react'
import miApi from "..";

// assets
import icon from "./../assets/account_balance.svg";
import "./styles.css";

// otros componentes
import PageHeader from "../common/PageHeader";
import Loading from "../common/Loading";
import EditButton from "../common/EditButton";

const AccountListPage = () => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    miApi.get("cuentas/all")
      .then((res) => {
        setList(res.data.list);
        setTimeout(() => setLoading(false), 200);
      })
      .catch((err) => setLoading(false));
  }, [])

  return (
    <main className="main-content">
      <div className="main-header">
        <PageHeader color="#ffffcc" icon={icon} name="Cuentas" />
      </div>

      <div className="table-container">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>CBU</th>
              <th>Alta</th>
              <th>Cliente</th>
              <th>Saldo</th>
              {/* <th>Opciones</th> */}
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr className={index % 2 ? "style1" : "style2"} key={index}>
                <td>{item.cbu}</td>
                <td>{getDate(item._id)}</td>
                <td>{item.cliente.nombre}</td>
                <td>{"$" + item.monto?.toFixed(2)}</td>
                {/*
                <td>
                  <div className="td-options">
                    {<EditButton fn={() => console.log("click") } />}
                  </div>
                </td> */ }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function getDate(id) {
  return new Date(parseInt(id.substring(0,8), 16) * 1000).toString().substring(3,21)
}

export default AccountListPage