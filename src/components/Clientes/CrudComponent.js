import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

import TableClients from "./TableClients";
import FormCliente from "./FormCliente";

import ModalFormCidade from "../Cidades/ModalFormCidade";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/FormCliente.css"; // Importa o arquivo CSS

const CrudComponent = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);
  const [modo, setModo] = useState("adicionar");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7264/api/Cliente");
      setClientes(response.data.dados);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleClienteAdicionado = () => {
    fetchData();
    setShowModal(false);
  };

  const handleCidadeAdicionada = () => {
    // Você pode adicionar lógica para atualizar a lista de cidades se necessário
    console.log("Cidade adicionada com sucesso");
  };

  const handleAdicionarClick = () => {
    setModo("adicionar");
    setClienteParaEditar(null);
    setShowModal(true);
  };

  const handleEditarClick = (cliente) => {
    setModo("editar");
    setClienteParaEditar(cliente);
    setShowModal(true);
  };

  const handleDeleteClick = async (clienteId) => {
    try {
      await axios.delete(`https://localhost:7264/api/Cliente?id=${clienteId}`);
      fetchData(); // Atualiza a lista de clientes após deletar
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  return (
    <div>
      <h2>Clientes</h2>
      <Button variant="primary" onClick={handleAdicionarClick}>
        Adicionar Novo Cliente
      </Button>
      <ModalFormCidade onCidadeAdicionada={handleCidadeAdicionada} />

      <TableClients
        clientes={clientes}
        onEditarClick={handleEditarClick}
        onDeletarClick={handleDeleteClick}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modo === "adicionar" ? "Adicionar Novo Cliente" : "Editar Cliente"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormCliente
            modo={modo}
            clienteParaEditar={clienteParaEditar}
            onClienteAdicionado={handleClienteAdicionado}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CrudComponent;
