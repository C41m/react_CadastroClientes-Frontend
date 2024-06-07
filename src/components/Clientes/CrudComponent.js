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
  const [showModalClient, setShowModalClient] = useState(false);
  const [showModalCity, setShowModalCity] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [modo, setModo] = useState("adicionar");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [filtered, setFiltered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://cadastroclientescaiofernando.azurewebsites.net/clientes"
      );
      setClientes(response.data);
      setFiltered(false);
      setLoading(false);
    } catch (error) {
      // console.error(error.data.response);
      toast.error(error.data.response);
    }
  };

  const setCloseModalClient = () => setShowModalClient(false);
  const setCloseModalCity = () => setShowModalCity(false);

  const handleClientAdded = () => {
    fetchData();
    setShowModalClient(false);
  };

  const filterData = async () => {
    if (!nome && !sobrenome) {
      setFiltered(false);
      fetchData();
      return;
    }

    try {
      const response = await axios.get(
        `https://cadastroclientescaiofernando.azurewebsites.net/clientes/buscar?nome=${nome}&sobrenome=${sobrenome}`
      );
      setClientes(response.data);
      setFiltered(true);
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

  const handleClientAddClick = () => {
    setModo("adicionar");
    setClientToEdit(null);
    setShowModalClient(true);
  };

  const handleCityAddClick = () => {
    setShowModalCity(true);
  };

  const handleDeleteClick = async (clienteId) => {
    try {
      await axios.delete(
        `https://cadastroclientescaiofernando.azurewebsites.net/api/Cliente?id=${clienteId}`
      );
      fetchData();
    } catch (error) {
      // console.log("Erro ao deletar cliente:", error);
      toast.error(error.response.data);
    }
  };

  const handleNameChange = (e) => {
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
        <Button variant="primary" onClick={handleClientAddClick}>
          Adicionar Novo Cliente
        </Button>
        <Button variant="primary" onClick={handleCityAddClick}>
          Adicionar Nova Cidade
        </Button>

        <ModalFormCidade showModal={showModalCity} onHide={setCloseModalCity} />
      </div>

      <div className="container-search">
        <h2>Pesquisa</h2>
        <Form className="search-inputs">
          <Form.Group controlId="formNome">
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              value={nome}
              onChange={handleNameChange}
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
      {filtered && (
        <Alert variant="info" style={{ marginTop: "10px" }}>
          Dados filtrados!
        </Alert>
      )}
      <TableClients
        clientes={clientes}
        fetchData={fetchData}
        onDeleteClick={handleDeleteClick}
        loading={loading}
      />
      <FormCliente
        modo={modo}
        clientToEdit={clientToEdit}
        onClienteAdicionado={handleClientAdded}
        showModal={showModalClient}
        onHide={setCloseModalClient}
      />
    </div>
  );
};

export default CrudComponent;
