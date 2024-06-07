import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import TableClients from "./TableClients";
import FormCliente from "./FormCliente";
import ModalFormCidade from "../Cidades/ModalFormCidade";

import "./styles/CrudComponent.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CrudComponent = () => {
  const [clientes, setClientes] = useState([]);
  const [showModalCliente, setShowModalCliente] = useState(false);
  const [showModalCidade, setShowModalCidade] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);
  const [modo, setModo] = useState("adicionar");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [filtrado, setFiltrado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://cadastroclientescaiofernando.azurewebsites.net/api/Cliente"
      );
      setClientes(response.data);
      setFiltrado(false);
      setLoading(false);
    } catch (error) {
      // console.error(error.data.response);
      toast.error(error.data.response);
    }
  };

  const setCloseModalCliente = () => setShowModalCliente(false);
  const setCloseModalCidade = () => setShowModalCidade(false);

  const handleClienteAdicionado = () => {
    fetchData();
    setShowModalCliente(false);
  };

  const filterData = async () => {
    if (!nome && !sobrenome) {
      setFiltrado(false);
      fetchData();
      return;
    }

    try {
      const response = await axios.get(
        `https://cadastroclientescaiofernando.azurewebsites.net/api/Cliente/FindByName?nome=${nome}&sobrenome=${sobrenome}`
      );
      setClientes(response.data);
      setFiltrado(true);
    } catch (error) {
      // console.error("Erro ao buscar dados filtrados:", error);
      toast.error(error.response.data);
    }
  };

  const clearFilters = () => {
    setNome("");
    setSobrenome("");
    fetchData();
  };

  const handleAdicionarClienteClick = () => {
    setModo("adicionar");
    setClienteParaEditar(null);
    setShowModalCliente(true);
  };

  const handleAdicionarCidadeClick = () => {
    setShowModalCidade(true);
  };

  const handleDeleteClick = async (clienteId) => {
    try {
      await axios.delete(
        `https://cadastroclientescaiofernando.azurewebsites.net/api/Cliente?id=${clienteId}`
      );
      fetchData(); // Atualiza a lista de clientes após deletar
    } catch (error) {
      // console.log("Erro ao deletar cliente:", error);
      toast.error(error.response.data);
    }
  };

  const handleNomeChange = (e) => {
    setNome(e.target.value.toUpperCase());
  };

  const handleSobrenomeChange = (e) => {
    setSobrenome(e.target.value.toUpperCase());
  };

  return (
    <div className="crud-container">
      <div className="title-container">
        <h1 className="first-title">Meus</h1>
        <h1 className="second-title">Clientes</h1>
      </div>

      <div className="buttons-container">
        <Button variant="primary" onClick={handleAdicionarClienteClick}>
          Adicionar Novo Cliente
        </Button>
        <Button variant="primary" onClick={handleAdicionarCidadeClick}>
          Adicionar Nova Cidade
        </Button>

        <ModalFormCidade
          showModal={showModalCidade}
          onHide={setCloseModalCidade}
        />
      </div>

      <div className="container-search">
        <h2>Pesquisa</h2>
        <Form className="search-inputs">
          <Form.Group controlId="formNome">
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              value={nome}
              onChange={handleNomeChange}
            />
          </Form.Group>
          <Form.Group controlId="formSobrenome">
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

          <Button variant="secondary" onClick={clearFilters}>
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
        loading={loading}
      />
      <FormCliente
        modo={modo}
        clienteParaEditar={clienteParaEditar}
        onClienteAdicionado={handleClienteAdicionado}
        showModal={showModalCliente}
        onHide={setCloseModalCliente}
      />
    </div>
  );
};

export default CrudComponent;
