import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Clientes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const initialRows = [
    {
      id: 1,
      nombre: "Juan",
      apellidos: "Pérez",
      rfc: "JUAP123456",
      curp: "JUAP890123HDFRRL01",
      edad: 30,
    },
    {
      id: 2,
      nombre: "María",
      apellidos: "García",
      rfc: "MARG123456",
      curp: "MARG890123MDFRRL01",
      edad: 25,
    },
    {
      id: 3,
      nombre: "Pedro",
      apellidos: "Ramírez",
      rfc: "PERA123456",
      curp: "PERA890123PDFRRL01",
      edad: 35,
    },
    {
      id: 4,
      nombre: "Ana",
      apellidos: "Martínez",
      rfc: "ANAM123456",
      curp: "ANAM890123ADFRRL01",
      edad: 40,
    },
    {
      id: 5,
      nombre: "Luis",
      apellidos: "Hernández",
      rfc: "LUHE123456",
      curp: "LUHE890123LDFRRL01",
      edad: 45,
    },
  ];

  const filteredRows = search.trim()
    ? initialRows.filter(
        (row) =>
          row.nombre.toLowerCase().includes(search.toLowerCase()) ||
          row.apellidos.toLowerCase().includes(search.toLowerCase()) ||
          row.rfc.toLowerCase().includes(search.toLowerCase()) ||
          row.curp.toLowerCase().includes(search.toLowerCase())
      )
    : initialRows;

  const columns = [
    { field: "nombre", headerName: "Nombre", width: 220 },
    { field: "apellidos", headerName: "Apellidos", width: 220 },
    { field: "rfc", headerName: "RFC", width: 200 },
    { field: "curp", headerName: "CURP", width: 220 },
    { field: "edad", headerName: "Edad", width: 150 },
    {
      field: "poliza",
      headerName: "Póliza",
      width: 283,
      renderCell: (params) => (
        <Button
          className="center"
          variant="contained"
          sx={{
            backgroundColor: "#0b1956",
            "&:hover": { backgroundColor: "#354797" },
          }}
          onClick={() => navigate(`/clientes/polizas/${params.row.id}`)}
        >
          Ver Pólizas
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <div className="relative p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold"></h1>
        <TextField
          label="Buscar cliente"
          variant="outlined"
          size="small"
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar cliente"
        />
      </div>
      <div className="h-[500px] w-full">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
};

export default Clientes;
