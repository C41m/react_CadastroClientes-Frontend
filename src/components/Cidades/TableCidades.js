import React, { useState } from "react";
import { Table, Button, FormControl, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/TableCidades.css";

const TableCidades = ({ cidades, onCidadeEditada, onCidadeRemovida }) => {
  const [editMode, setEditMode] = useState(null);
  const [editedCidade, setEditedCidade] = useState({
    id: null,
    cidade: "",
    estado: "",
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cidadeToDelete, setCidadeToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditClick = (id) => {
    setEditMode(id);
    const cidade = cidades.find((cidade) => cidade.id === id);

    if (cidade) {
      setEditedCidade({
        id: cidade.id,
        cidade: cidade.cidade.toUpperCase(),
        estado: cidade.estado.toUpperCase(),
      });
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`https://localhost:7264/api/Cidade/`, {
        ...editedCidade,
        cidade: editedCidade.cidade.toUpperCase(),
        estado: editedCidade.estado.toUpperCase(),
      });

      if (response.data && response.data.sucesso) {
        toast.success("Cidade editada com sucesso!");
        onCidadeEditada();
        setEditMode(null);
      } else {
        toast.error(response.data.mensagem);
      }
    } catch (error) {
      console.error("Erro ao editar cidade:", error);
      toast.error("Erro ao editar cidade!");
    }
  };

  const handleDeleteClick = async (id) => {
    setCidadeToDelete(id);
    setShowConfirmationModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `https://localhost:7264/api/Cidade?id=${cidadeToDelete}`
      );

      if (response.data && response.data.sucesso) {
        toast.success("Cidade removida com sucesso!");
        onCidadeRemovida();
        setShowConfirmationModal(false);
      } else {
        toast.error(response.data.mensagem);
      }
    } catch (error) {
      console.error("Erro ao remover cidade:", error);
      toast.error("Erro ao remover cidade!");
    }
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
    setCidadeToDelete(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toUpperCase());
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleCidadeChange = (e) => {
    setEditedCidade({ ...editedCidade, cidade: e.target.value.toUpperCase() });
  };

  const handleEstadoChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 2) {
      setEditedCidade({ ...editedCidade, estado: value });
    }
  };

  const filteredCidades = cidades.filter(
    (cidade) =>
      cidade.cidade.toUpperCase().includes(searchTerm) ||
      cidade.estado.toUpperCase().includes(searchTerm)
  );

  return (
    <div>
      <div className="search-bar">
        <Form className="search-form">
          <FormControl
            type="text"
            placeholder="Pesquisar Cidade ou Estado"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyPress}
          />
        </Form>
      </div>
      <div className="table-container">
        <Table striped bordered hover size="sm" bsPrefix className="table">
          <thead>
            <tr>
              <th className="center-column">ID</th>
              <th>Cidade</th>
              <th className="center-column">Estado</th>
              <th className="center-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCidades.map((cidade) => (
              <tr key={cidade.id}>
                <td className="center-column">{cidade.id}</td>
                <td>
                  {editMode === cidade.id ? (
                    <FormControl
                      bsPrefix
                      className="form-control"
                      size="sm"
                      type="text"
                      value={editedCidade.cidade}
                      onChange={handleCidadeChange}
                    />
                  ) : (
                    cidade.cidade
                  )}
                </td>
                <td className="center-column">
                  {editMode === cidade.id ? (
                    <FormControl
                      className="form-control-cidade"
                      type="text"
                      value={editedCidade.estado}
                      onChange={handleEstadoChange}
                    />
                  ) : (
                    cidade.estado
                  )}
                </td>
                <td className="center-column">
                  {editMode === cidade.id ? (
                    <Button variant="" onClick={handleSaveClick}>
                      <FaSave />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant=""
                        onClick={() => handleEditClick(cidade.id)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant=""
                        onClick={() => handleDeleteClick(cidade.id)}
                      >
                        <FaTrash />
                      </Button>
                    </>
                  )}
                  {editMode === cidade.id && (
                    <Button variant="" onClick={() => setEditMode(null)}>
                      <FaTimes />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de confirmação para exclusão */}
      <Modal show={showConfirmationModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir esta cidade?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={confirmDelete}>
            Excluir
          </Button>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TableCidades;
