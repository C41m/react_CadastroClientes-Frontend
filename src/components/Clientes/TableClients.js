import React, { useState } from "react";
import { Table, Button, Modal, Spinner } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

import FormCliente from "./FormCliente";

const TableClients = ({ clientes, fetchData, onDeletarClick, loading }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [clienteIdParaExcluir, setClienteIdParaExcluir] = useState(null);
  const [modo, setModo] = useState("");
  const [clienteParaEditar, setClienteParaEditar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const setCloseModal = () => setShowModal(false);

  // Editar cliente
  const handleEditarClick = (cliente) => {
    setModo("editar");
    setClienteParaEditar(cliente);
    setShowModal(true);
  };

  const handleClienteAdicionado = () => {
    fetchData();
    setShowModal(false);
  };

  const handleShowModal = (clienteId) => {
    setClienteIdParaExcluir(clienteId);
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    setClienteIdParaExcluir(null);
  };

  const handleConfirmDelete = () => {
    if (clienteIdParaExcluir !== null) {
      onDeletarClick(clienteIdParaExcluir);
      handleCloseModal();
    }
  };

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status"></Spinner>
        </div>
      ) : (
        <React.Fragment>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th className="center-column">Sexo</th>
                <th>Data de Nascimento</th>
                <th className="center-column">Idade</th>
                <th>Cidade</th>
                <th className="center-column">Estado</th>
                <th>Data de Criação</th>
                <th>Data de Alteração</th>
                <th className="center-column">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
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
                      onClick={() => handleEditarClick(cliente)}
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

          <FormCliente
            modo={modo}
            clienteParaEditar={clienteParaEditar}
            onClienteAdicionado={handleClienteAdicionado}
            showModal={showModal}
            onHide={setCloseModal}
          />
        </React.Fragment>
      )}
    </>
  );
};
export default TableClients;
