import React, { useState, useEffect } from "react";
import TableClients from "./TableClients";
import axios from "axios";
import { toast } from "react-toastify";

const FilterPanel = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClientes] = useState([]);
  const [filters, setFilters] = useState({
    nome: "",
    sobrenome: "",
    cidade: "",
    estado: "",
  });

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      nome: "",
      sobrenome: "",
      cidade: "",
      estado: "",
    });
    setFilteredClientes(clients);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://cadastroclientescaiofernando.azurewebsites.net/clientes"
        );
        setClients(response.data);
        setFilteredClientes(response.data);
      } catch (error) {
        // console.log("Erro ao buscar dados:", error.response.data);
        toast.error(error.response.data);
      }
    };
    fetchData();
  }, [filters]);

  return (
    <div className="Teste">
      <FilterPanel
        filters={filters}
        onChange={(name, value) => setFilters({ ...filters, [name]: value })}
        onClear={clearFilters}
      />
      <TableClients clients={filteredClients} />
    </div>
  );
};

export default FilterPanel;
