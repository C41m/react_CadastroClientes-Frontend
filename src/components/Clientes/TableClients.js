import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const TableClients = ({ clientes, onEditarClick, onDeletarClick }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [clienteIdParaExcluir, setClienteIdParaExcluir] = useState(null);

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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Sexo</th>
            <th>Data de Nascimento</th>
            <th>Idade</th>
            <th>Cidade</th>
            <th>Estado</th>
            <th>Data de Criação</th>
            <th>Data de Alteração</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.sobrenome}</td>
              <td>{cliente.sexo}</td>
              <td>{new Date(cliente.dataNascimento).toLocaleDateString()}</td>
              <td>{cliente.idade}</td>
              <td>{cliente.cidade}</td>
              <td>{cliente.estado}</td>
              <td>{new Date(cliente.dataCriacao).toLocaleString()}</td>
              <td>{new Date(cliente.dataAlteracao).toLocaleString()}</td>
              <td>
                <Button
                  variant=""
                  onClick={() => onEditarClick(cliente)}
                  className="mr-2"
                >
                  <FaEdit />
                </Button>
                <Button variant="" onClick={() => handleShowModal(cliente.id)}>
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
        <Modal.Body>Tem certeza que deseja excluir este cliente?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Excluir
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableClients;
