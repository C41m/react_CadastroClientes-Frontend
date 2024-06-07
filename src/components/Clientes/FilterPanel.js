import React, { useState, useEffect } from "react";
import TableClients from "./TableClients";
import axios from "axios";
import { toast } from "react-toastify";

const FilterPanel = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
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
    setFilteredClientes(clientes);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("api/clientes");
        setClientes(response.data);
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
      <TableClients clientes={filteredClientes} />
    </div>
  );
};

export default FilterPanel;
