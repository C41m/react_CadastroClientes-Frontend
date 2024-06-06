import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import FormCidades from "./FormCidades";
import TableCidades from "./TableCidades";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalFormCidade = () => {
  const [showModal, setShowModal] = useState(false);
  const [cidades, setCidades] = useState([]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

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
      <Button variant="primary" onClick={handleShowModal}>
        Adicionar Nova Cidade
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Nova Cidade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormCidades
            onCidadeAdicionada={handleCidadeAdicionada}
            handleCloseModal={handleCloseModal}
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
