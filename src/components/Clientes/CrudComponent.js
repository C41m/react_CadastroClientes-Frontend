import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";

import TableClients from "./TableClients";
import FormCliente from "./FormCliente";
import ModalFormCidade from "../Cidades/ModalFormCidade";
import "./styles/CrudComponent.css";

import "bootstrap/dist/css/bootstrap.min.css";

const CrudComponent = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);
  const [modo, setModo] = useState("adicionar");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [filtrado, setFiltrado] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7264/api/Cliente");
      setClientes(response.data);
      setFiltrado(false);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const setCloseModal = () => setShowModal(false);

  const handleClienteAdicionado = () => {
    fetchData();
    setShowModal(false);
  };

  const filterData = async () => {
    if (!nome && !sobrenome) {
      setFiltrado(false);
      fetchData();
      return;
    }

    try {
      const response = await axios.get(
        `https://localhost:7264/api/Cliente/FindByName?nome=${nome}&sobrenome=${sobrenome}`
      );
      setClientes(response.data);
      setFiltrado(true);
    } catch (error) {
      console.error("Erro ao buscar dados filtrados:", error);
    }
  };

  const clearFilters = () => {
    setNome("");
    setSobrenome("");
    fetchData();
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

  const handleDeleteClick = async (clienteId) => {
    try {
      await axios.delete(`https://localhost:7264/api/Cliente?id=${clienteId}`);
      fetchData(); // Atualiza a lista de clientes após deletar
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  const handleNomeChange = (e) => {
    setNome(e.target.value.toUpperCase());
  };

  const handleSobrenomeChange = (e) => {
    setSobrenome(e.target.value.toUpperCase());
  };

  return (
    <div>
      <h1>MeusClientes</h1>
      <Button variant="primary" onClick={handleAdicionarClick}>
        Adicionar Novo Cliente
      </Button>

      <ModalFormCidade onCidadeAdicionada={handleCidadeAdicionada} />
      <div className="container-search">
        <h2>Pesquisa</h2>
        <Form className="search-name">
          <Form.Group controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              value={nome}
              onChange={handleNomeChange}
            />
          </Form.Group>
          <Form.Group controlId="formSobrenome">
            <Form.Label>Sobrenome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o sobrenome"
              value={sobrenome}
              onChange={handleSobrenomeChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={filterData}>
            Pesquisar
          </Button>
          <Button
            variant="secondary"
            onClick={clearFilters}
            style={{ marginLeft: "10px" }}
          >
            Limpar
          </Button>
        </Form>
      </div>
      {filtrado && (
        <Alert variant="info" style={{ marginTop: "10px" }}>
          Dados filtrados!
        </Alert>
      )}

      <TableClients
        clientes={clientes}
        fetchData={fetchData}
        onDeletarClick={handleDeleteClick}
      />

      <FormCliente
        modo={modo}
        clienteParaEditar={clienteParaEditar}
        onClienteAdicionado={handleClienteAdicionado}
        showModal={showModal}
        onHide={setCloseModal}
      />
    </div>
  );
};

export default CrudComponent;
