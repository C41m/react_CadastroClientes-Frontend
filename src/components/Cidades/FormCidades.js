import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import "./styles/FormCidades.css";

const FormCidades = ({ onCidadeAdicionada, onHide }) => {
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const novaCidade = {
        cidade: cidade.toUpperCase(),
        estado: estado.toUpperCase(),
      };

      if (estado.length < 2) {
        toast.error("Digite a sigla do estado corretamente.");
        return;
      }

      await axios.post("https://localhost:7264/api/Cidade", novaCidade);

      setCidade("");
      setEstado("");

      toast.success("Cidade adicionada com sucesso!");
      onCidadeAdicionada();
    } catch (errors) {
      // console.log(errors.response.data.errors.Estado);
      toast.error(errors.response.data);
    }
  };

  const handleCidadeChange = (e) => {
    setCidade(e.target.value.toUpperCase());
  };

  const handleEstadoChange = (e) => {
    const estado = e.target.value.toUpperCase();

    // Verificar se contém números ou espaços
    const containsNumbers = /\d/.test(estado);
    const containsSpaces = /\s/.test(estado);

    if (estado.length <= 2 && !containsNumbers && !containsSpaces) {
      setEstado(estado);
    }
  };

  return (
    <Form
      className="container-form-cidade"
      onSubmit={handleSubmit}
      onAbort={onHide}
    >
      <div className="form-cidade">
        <Form.Group bsPrefix controlId="formCidade">
          <Form.Label>Cidade:</Form.Label>
          <Form.Control
            type="text"
            value={cidade}
            onChange={handleCidadeChange}
            required
          />
        </Form.Group>

        <Form.Group bsPrefix controlId="formEstado">
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

        <Button variant="danger" onClick={onHide}>
          Voltar
        </Button>
      </div>
      <hr />
    </Form>
  );
};

export default FormCidades;
