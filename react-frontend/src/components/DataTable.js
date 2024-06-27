import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';

import { DataGrid } from '@mui/x-data-grid';

export default function DataTable({ rows }) {
    const columns = [
        { field: 'created_at', headerName: 'Created At', width: 200 },
        { field: 'price', headerName: 'Price', flex: 1 },
        { field: 'latitude', headerName: 'Latitude', flex: 1 },
        { field: 'longitude', headerName: 'Longitude', flex: 1 },
        { field: 'households', headerName: 'Households', flex: 1 },
        { field: 'housing_median_age', headerName: 'Housing Median Age', flex: 1 },
        { field: 'median_income', headerName: 'Median Income', flex: 1 },
        { field: 'population', headerName: 'Population', flex: 1 },
        { field: 'total_bedrooms', headerName: 'Total Bedrooms', flex: 1 },
        { field: 'total_rooms', headerName: 'Total Rooms', flex: 1 },
        { field: 'ocean_proximity', headerName: 'Ocean Proximity', flex: 1 },
        { field: 'map_url', headerName: 'Map URL', flex: 1,
          renderCell: (cellvalue) => {
            return <a href={cellvalue.value}><MapIcon /></a>;
          },
        },
    ]
    return (
      <DataGrid
        style={{ "marginTop": "20px" }}
        getRowId={(row) => row.created_at}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5]}

      />
  );
}

