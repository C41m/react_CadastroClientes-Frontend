import React, { useState, useEffect } from "react";
import FilterPanel from "./FilterPanel";
import TableClients from "./TableClients";

const ClientManagement = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [filters, setFilters] = useState({
    nome: "",
    sobrenome: "",
    cidade: "",
    estado: "",
  });

  // Função para aplicar filtros
  const applyFilters = () => {
    const filtered = clientes.filter((cliente) => {
      return (
        cliente.nome.toLowerCase().includes(filters.nome.toLowerCase()) &&
        cliente.sobrenome
          .toLowerCase()
          .includes(filters.sobrenome.toLowerCase()) &&
        cliente.cidade.toLowerCase().includes(filters.cidade.toLowerCase()) &&
        cliente.estado.toLowerCase().includes(filters.estado.toLowerCase())
      );
    });
    setFilteredClientes(filtered);
  };

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

  // Chamada à API para buscar dados dos clientes
  useEffect(() => {
    // Aqui você faria a chamada à API para buscar os dados dos clientes
    // e atualizaria o estado "clientes" com os dados obtidos
    // Exemplo fictício:
    const fetchClientes = async () => {
      const response = await fetch("api/clientes");
      const data = await response.json();
      setClientes(data);
      setFilteredClientes(data);
    };
    fetchClientes();
  }, []);

  // Atualizar os clientes filtrados sempre que os filtros mudarem
  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div>
      <FilterPanel
        filters={filters}
        onChange={(name, value) => setFilters({ ...filters, [name]: value })}
        onClear={clearFilters}
      />
      <TableClients clientes={filteredClientes} />
    </div>
  );
};

export default ClientManagement;
