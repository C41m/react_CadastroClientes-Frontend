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
      const response = await axios.get(
        "https://cadastroclientescaiofernando.azurewebsites.net/api/cidade"
      );
      setCidades(response.data);
    } catch (error) {
      // console.error(error.response.data);
      toast.error(error.response.data);
    }
  };

  const handleCityAdded = () => {
    fetchData();
  };

  const handleCityEdited = () => {
    fetchData();
  };

  const handleCityDeleted = () => {
    fetchData();
  };

  return (
    <>
      <Modal show={showModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Nova Cidade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormCidades onAddedCity={handleCityAdded} onHide={onHide} />

          <TableCidades
            cidades={cidades}
            onCityEdited={handleCityEdited}
            onCityRemoved={handleCityDeleted}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalFormCidade;
