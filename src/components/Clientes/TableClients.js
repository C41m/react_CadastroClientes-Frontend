import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { FaEdit, FaTrash, FaSortUp, FaSortDown } from "react-icons/fa";

import FormCliente from "./FormCliente";
import "./styles/TableClientes.css";
import { toast } from "react-toastify";

const TableClients = ({ clientes, fetchData, onDelteClick, loading }) => {
  const [sortedClients, setSortedClients] = useState(clientes);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [modo, setModo] = useState("");
  const [clientToEdit, setClientToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direcao: "crescente",
  });

  const setCloseModal = () => setShowModal(false);

  // Atualiza a lista de clientes
  useEffect(() => {
    setSortedClients(clientes);
  }, [clientes]);

  // Editar cliente
  const handleEditClick = (cliente) => {
    setModo("editar");
    setClientToEdit(cliente);
    setShowModal(true);
  };

  const handleClientAdded = () => {
    fetchData();
    setShowModal(false);
  };

  const handleShowModal = (clienteId) => {
    setClientIdToDelete(clienteId);
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    setClientIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (clientIdToDelete !== null) {
      onDelteClick(clientIdToDelete);
      handleCloseModal();
      toast.success("Cliente exlcuido!");
    }
  };

  // Ordenação das colunas
  const handleSort = (key) => {
    let direcao = "crescente";
    if (sortConfig.key === key && sortConfig.direcao === "crescente") {
      direcao = "decrescente";
    }

    setSortConfig({ key, direcao });

    const sorted = [...sortedClients].sort((a, b) => {
      if (a[key] < b[key]) {
        return direcao === "crescente" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direcao === "crescente" ? 1 : -1;
      }
      return 0;
    });
    setSortedClients(sorted);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direcao === "crescente" ? <FaSortUp /> : <FaSortDown />;
    }
    return null;
  };

  return (
    <div className="table-clientes">
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status"></Spinner>
        </div>
      ) : (
        <React.Fragment>
          <div className="table-container">
            <Table bsPrefix striped bordered hover className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>
                    ID {renderSortIcon("id")}
                  </th>
                  <th onClick={() => handleSort("nome")}>
                    Nome {renderSortIcon("nome")}
                  </th>
                  <th onClick={() => handleSort("sobrenome")}>
                    Sobrenome {renderSortIcon("sobrenome")}
                  </th>
                  <th
                    className="center-column"
                    onClick={() => handleSort("sexo")}
                  >
                    Sexo {renderSortIcon("sexo")}
                  </th>
                  <th onClick={() => handleSort("dataNascimento")}>
                    Data de Nascimento {renderSortIcon("dataNascimento")}
                  </th>
                  <th
                    className="center-column"
                    onClick={() => handleSort("idade")}
                  >
                    Idade {renderSortIcon("idade")}
                  </th>
                  <th onClick={() => handleSort("cidade")}>
                    Cidade {renderSortIcon("cidade")}
                  </th>
                  <th
                    className="center-column"
                    onClick={() => handleSort("estado")}
                  >
                    Estado {renderSortIcon("estado")}
                  </th>
                  <th onClick={() => handleSort("dataCriacao")}>
                    Data de Criação {renderSortIcon("dataCriacao")}
                  </th>
                  <th onClick={() => handleSort("dataAlteracao")}>
                    Data de Alteração {renderSortIcon("dataAlteracao")}
                  </th>
                  <th className="center-column">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.reverse().map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.sobrenome}</td>
                    <td className="center-column">{cliente.sexo}</td>
                    <td className="center-column">
                      {new Date(cliente.dataNascimento).toLocaleDateString()}
                    </td>
                    <td className="center-column">{cliente.idade}</td>
                    <td>{cliente.cidade.cidade}</td>
                    <td className="center-column">{cliente.cidade.estado}</td>
                    <td>{new Date(cliente.dataCriacao).toLocaleString()}</td>
                    <td>{new Date(cliente.dataAlteracao).toLocaleString()}</td>
                    <td className="center-column">
                      <Button
                        variant=""
                        onClick={() => handleEditClick(cliente)}
                        className="mr-2"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="mr-2"
                        onClick={() => handleShowModal(cliente.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {clientes.length === 0 ? (
              <h2>Nenhum cliente cadastrado.</h2>
            ) : (
              <Modal show={showConfirmationModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Tem certeza que deseja excluir este cliente?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleConfirmDelete}>
                    Excluir
                  </Button>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                  </Button>
                </Modal.Footer>
              </Modal>
            )}

            <FormCliente
              modo={modo}
              clientToEdit={clientToEdit}
              onClienteAdicionado={handleClientAdded}
              showModal={showModal}
              onHide={setCloseModal}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
export default TableClients;
