import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/FormCliente.css"; // Importa o arquivo CSS

const FormCliente = ({ modo, clienteParaEditar, onClienteAdicionado }) => {
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
          "https://localhost:7264/api/Cidade"
        );
        setEstados(responseEstados.data.dados);

        if (modo === "editar" && clienteParaEditar) {
          setNome(clienteParaEditar.nome || "");
          setSobrenome(clienteParaEditar.sobrenome || "");
          setSexo(clienteParaEditar.sexo || "");
          setDataNascimento(clienteParaEditar.dataNascimento || "");
          setEstado(clienteParaEditar.estado || "");
          handleEstadoChange(clienteParaEditar.estado);
          setCidade(clienteParaEditar.cidade || "");
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [modo, clienteParaEditar]);

  const handleEstadoChange = async (selectedEstado) => {
    try {
      setEstado(selectedEstado);
      const responseCidades = await axios.get(
        `https://localhost:7264/api/Cidade/estado/${selectedEstado}`
      );
      setCidades(responseCidades.data.dados);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
    }
  };

  // Validação Nome
  const handleNomeChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z]*$/.test(value)) {
      setNome(value.toUpperCase());
    }
  };

  // Validação Sobrenome
  const handleSobrenomeChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z]*$/.test(value)) {
      setSobrenome(value.toUpperCase());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novoCliente = {
        id: clienteParaEditar?.id || 0,
        nome,
        sobrenome,
        sexo,
        dataNascimento,
        idade: calcularIdade(dataNascimento),
        cidade,
        estado,
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataAlteracao: new Date().toISOString(),
      };

      console.log("Novo cliente:", novoCliente);

      if (modo === "adicionar") {
        const response = await axios.post(
          "https://localhost:7264/api/cliente",
          novoCliente
        );
        console.log("Resposta do servidor:", response.data);
      } else if (modo === "editar" && clienteParaEditar) {
        const response = await axios.put(
          `https://localhost:7264/api/Cliente/`,
          novoCliente
        );
        console.log("Resposta do servidor:", response.data);
      }

      setNome("");
      setSobrenome("");
      setSexo("");
      setDataNascimento("");
      setEstado("");
      setCidade("");

      onClienteAdicionado();
    } catch (error) {
      console.error("Erro ao adicionar/editar cliente:", error);
    }
  };

  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  return (
    <>
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
            <Form.Label className="form-label">Data de Nascimento:</Form.Label>
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
              onChange={(e) => setCidade(e.target.value)}
              className="form-control-select"
              required
            >
              <option value="">Selecione</option>
              {cidades.map((cidade, index) => (
                <option key={index} value={cidade.cidade}>
                  {cidade.cidade}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" className="btn-primary">
            {modo === "adicionar" ? "Adicionar Cliente" : "Salvar Alterações"}
          </Button>
        </Form>
      )}
    </>
  );
};

export default FormCliente;
