import React from 'react';
import MapIcon from '@mui/icons-material/Map';
import LinearProgress from '@mui/material/LinearProgress';

import { DataGrid } from '@mui/x-data-grid';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';

export default function DataTable({ rows, loading }) {
    const columns = [
        { field: 'created_at', headerName: 'Created At', width: 180 },
        { field: 'price', headerName: 'Price ($)', width: 180},
        { field: 'latitude', headerName: 'Latitude', flex: 1 },
        { field: 'longitude', headerName: 'Longitude', flex: 1 },
        { field: 'households', headerName: 'Households', flex: 1 },
        { field: 'housing_median_age', headerName: 'Housing Median Age', flex: 1 },
        { field: 'median_income', headerName: 'Median Income ($)', flex: 1 },
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
    <div style={{ height: 400, width: '100%' }}>
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
        slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            loadingOverlay: LinearProgress,
        }}
        sx={{ '--DataGrid-overlayHeight': '300px' }}
        pageSizeOptions={[5]}
        loading={loading}
      />
      </div>
  );
}

