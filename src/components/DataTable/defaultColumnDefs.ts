/**
 * defaultColumnDefs.ts
 * Default column definitions for the AG-Grid component
 */
export const defaultColumnDefs = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    filter: 'agNumberColumnFilter'
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 200
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 250
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 150
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150
  }
];
