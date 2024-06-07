import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";

import FormCidades from "./FormCidades";
import TableCidades from "./TableCidades";

const ModalFormCidade = ({ showModal, onHide }) => {
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7264/api/cidade");
      setCidades(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao buscar dados!");
    }
  };

  const handleCidadeAdicionada = () => {
    fetchData();
  };

  const handleCidadeEditada = () => {
    fetchData();
  };

  const handleCidadeRemovida = () => {
    fetchData();
  };

  return (
    <>
      <Modal show={showModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Nova Cidade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormCidades
            onCidadeAdicionada={handleCidadeAdicionada}
            onHide={onHide}
          />

          <TableCidades
            cidades={cidades}
            onCidadeEditada={handleCidadeEditada}
            onCidadeRemovida={handleCidadeRemovida}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalFormCidade;
