import React, { useState } from "react";
import { Table, Button, FormControl, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/TableCidades.css";

const TableCidades = ({ cidades, onEditedCity, onCityRemoved }) => {
  const [editMode, setEditMode] = useState(null);
  const [editedCity, setEditedCity] = useState({
    id: null,
    cidade: "",
    estado: "",
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditClick = (id) => {
    setEditMode(id);
    const cidade = cidades.find((cidade) => cidade.id === id);

    if (cidade) {
      setEditedCity({
        id: cidade.id,
        cidade: cidade.cidade,
        estado: cidade.estado,
      });
    }
  };

  const handleSaveClick = async () => {
    // Verificações do campo de edição
    try {
      if (editedCity.estado.length === 0) {
        toast.error("Digite a sigla do estado.");
        return;
      }
      if (editedCity.estado.length < 2) {
        toast.error("Digite a sigla do estado corretamente.");
        return;
      }

      const response = await axios.put(
        `https://cadastroclientescaiofernando.azurewebsites.net/api/Cidade/`,
        {
          ...editedCity,
          cidade: editedCity.cidade.toUpperCase(),
          estado: editedCity.estado.toUpperCase(),
        }
      );

      if (response.data) {
        toast.success("Cidade editada com sucesso!");
        onEditedCity();
        setEditMode(null);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      // console.error("Erro ao editar cidade:", error);
      toast.error(error.response.data);
    }
  };

  const handleDeleteClick = async (id) => {
    setCityToDelete(id);
    setShowConfirmationModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `https://cadastroclientescaiofernando.azurewebsites.net/api/Cidade?id=${cityToDelete}`
      );

      if (response.data) {
        toast.success("Cidade removida com sucesso!");
        onCityRemoved();
        setShowConfirmationModal(false);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      // console.error("Erro ao remover cidade:", error);
      toast.error(error.response.data);
    }
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
    setCityToDelete(null);
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
    setEditedCity({ ...editedCity, cidade: e.target.value.toUpperCase() });
  };

  const handleEstadoChange = (e) => {
    const estado = e.target.value.toUpperCase();

    // Verificar se contém números ou espaços
    const containsNumbers = /\d/.test(estado);
    const containsSpaces = /\s/.test(estado);

    if (estado.length <= 2 && !containsNumbers && !containsSpaces) {
      setEditedCity({ ...editedCity, estado });
    }
  };

  const filteredCidades = cidades.filter(
    (cidade) =>
      cidade.cidade.toUpperCase().includes(searchTerm) ||
      cidade.estado.toUpperCase().includes(searchTerm)
  );

  return (
    <div className="table-cidades">
      <h4>Cidades Cadastradas</h4>
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
                      value={editedCity.cidade}
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
                      value={editedCity.estado}
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
      {cidades.length === 0 ? (
        <h4>Nenhuma cidade cadastrada.</h4>
      ) : (
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
      )}
    </div>
  );
};

export default TableCidades;
