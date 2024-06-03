import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "./styles/FormCidades.css";

const FormCidades = ({ onCidadeAdicionada, handleCloseModal }) => {
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novaCidade = {
        cidade: cidade.toUpperCase(),
        estado: estado.toUpperCase(),
      };

      const response = await axios.post(
        "https://localhost:7264/api/Cidade",
        novaCidade
      );

      const responseMessage = response.data.mensagem; // Captura a resposta da API

      setCidade("");
      setEstado("");

      if (responseMessage === "Cidade já cadastrada neste estado.") {
        toast.info(responseMessage);
      } else {
        // Exibe a notificação de sucesso e fecha o modal
        toast.success("Cidade adicionada com sucesso!");
        onCidadeAdicionada();
      }
    } catch (error) {
      console.error("Erro ao adicionar cidade:", error);
      toast.error("Erro ao adicionar cidade!");
    }
  };

  const handleCidadeChange = (e) => {
    setCidade(e.target.value.toUpperCase());
  };

  const handleEstadoChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 2) {
      setEstado(value);
    }
  };

  return (
    <Form onSubmit={handleSubmit} onAbort={handleCloseModal}>
      <div className="form-cidade">
        <Form.Group
          bsPrefix
          className="form-cidade-input"
          controlId="formCidade"
        >
          <Form.Label>Cidade:</Form.Label>
          <Form.Control
            type="text"
            value={cidade}
            onChange={handleCidadeChange}
            required
          />
        </Form.Group>

        <Form.Group
          bsPrefix
          className="form-estado-input"
          controlId="formEstado"
        >
          <Form.Label>Estado (UF):</Form.Label>
          <Form.Control
            type="text"
            value={estado}
            onChange={handleEstadoChange}
            required
          />
        </Form.Group>
      </div>

      <div bsPrefix className="buttons-cidade">
        <Button variant="primary" type="submit">
          Adicionar
        </Button>
        <Button variant="danger" onClick={handleCloseModal}>
          Voltar
        </Button>
      </div>
    </Form>
  );
};

export default FormCidades;
