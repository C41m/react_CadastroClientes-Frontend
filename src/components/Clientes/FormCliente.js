import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/FormCliente.css";

const FormCliente = ({
  modo,
  clienteParaEditar,
  onClienteAdicionado,
  showModal,
  onHide,
}) => {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseEstados = await axios.get(
          "https://cadastroclientescaiofernando.azurewebsites.net/api/cidade"
        );
        setEstados(responseEstados.data);

        if (modo === "editar" && clienteParaEditar) {
          setNome(clienteParaEditar.nome);
          setSobrenome(clienteParaEditar.sobrenome);
          setSexo(clienteParaEditar.sexo);
          setDataNascimento(clienteParaEditar.dataNascimento);
          setEstado(clienteParaEditar.cidade.estado);
          handleEstadoChange(clienteParaEditar.cidade.estado);
          setCidade(clienteParaEditar.cidade.id);
        }

        setLoading(false);
      } catch (error) {
        toast.error(error.response.data);
      }
    };

    if (showModal) {
      fetchData();
    }
  }, [clienteParaEditar, modo, showModal]);

  const handleEstadoChange = async (selectedEstado) => {
    try {
      setEstado(selectedEstado);

      const responseCidades = await axios.get(
        `https://cadastroclientescaiofernando.azurewebsites.net/api/Cidade/estado/${selectedEstado}`
      );
      setCidades(responseCidades.data);
      setLoading(false);
    } catch (error) {
      // console.error("Erro ao buscar cidades:", error);
      toast.error(error.response.data);
    }
  };

  // Validação Nome
  const handleNomeChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setNome(value.toUpperCase());
    }
  };

  // Validação Sobrenome
  const handleSobrenomeChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setSobrenome(value.toUpperCase());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clientForm = {
        id: clienteParaEditar?.id,
        nome,
        sobrenome,
        sexo,
        dataNascimento,
        ativo: true,
        cidadeId: parseInt(cidade),
      };

      if (modo === "adicionar") {
        await axios.post(
          "https://cadastroclientescaiofernando.azurewebsites.net/api/cliente",
          clientForm
        );
        toast.success("Cliente adicionado com sucesso!");
        // console.log("Resposta do servidor:", response.data);
      } else if (modo === "editar" && clienteParaEditar) {
        await axios.put(
          `https://cadastroclientescaiofernando.azurewebsites.net/api/cliente/`,
          clientForm
        );
        toast.success("Cliente atualizado com sucesso!");

        // console.log("Resposta do servidor:", response.data);
      }

      handleCleanForm();

      onClienteAdicionado();
    } catch (error) {
      // console.error("Erro ao adicionar/editar cliente:", error);
    }
  };

  const handleCleanForm = () => {
    setNome("");
    setSobrenome("");
    setSexo("");
    setDataNascimento("");
    setEstado("");
    setCidade("");
  };

  return (
    <Modal show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modo === "adicionar" ? "Adicionar Novo Cliente" : "Editar Cliente"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status"></Spinner>
          </div>
        ) : (
          <Form className="form-container" onSubmit={handleSubmit}>
            <Form.Group controlId="formNome">
              <Form.Label className="form-label">Nome:</Form.Label>
              <Form.Control
                type="text"
                value={nome}
                onChange={handleNomeChange}
                className="form-control"
                required
              />
            </Form.Group>

            <Form.Group controlId="formSobrenome">
              <Form.Label className="form-label">Sobrenome:</Form.Label>
              <Form.Control
                type="text"
                value={sobrenome}
                onChange={handleSobrenomeChange}
                className="form-control"
                required
              />
            </Form.Group>

            <Form.Group controlId="formSexo">
              <Form.Label className="form-label">Sexo:</Form.Label>
              <Form.Control
                as="select"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                className="form-control-select"
                required
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDataNascimento">
              <Form.Label className="form-label">
                Data de Nascimento:
              </Form.Label>
              <Form.Control
                type="date"
                value={
                  dataNascimento
                    ? new Date(dataNascimento).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setDataNascimento(e.target.value)}
                className="form-control"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEstado">
              <Form.Label className="form-label">Estado:</Form.Label>
              <Form.Control
                as="select"
                value={estado}
                onChange={(e) => {
                  setEstado(e.target.value);
                  handleEstadoChange(e.target.value);
                }}
                className="form-control-select"
                required
              >
                <option value="">Selecione</option>
                {[...new Set(estados.map((estado) => estado.estado))].map(
                  (estado, index) => (
                    <option key={index} value={estado}>
                      {estado}
                    </option>
                  )
                )}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formCidade">
              <Form.Label className="form-label">Cidade:</Form.Label>
              <Form.Control
                as="select"
                value={cidade}
                onChange={(e) => {
                  setCidade(e.target.value);
                }}
                className="form-control-select"
                required
              >
                <option value="">Selecione</option>
                {cidades.map((cidadeItem) => (
                  <option key={cidadeItem.id} value={cidadeItem.id}>
                    {cidadeItem.cidade}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <div className="buttons-container">
              <Button variant="primary" type="submit" className="btn">
                {modo === "adicionar"
                  ? "Adicionar Cliente"
                  : "Salvar Alterações"}
              </Button>

              <Button
                variant="secondary"
                className="btn"
                onClick={handleCleanForm}
              >
                Limpar
              </Button>

              <Button variant="danger" className="btn" onClick={onHide}>
                Cancelar
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FormCliente;
