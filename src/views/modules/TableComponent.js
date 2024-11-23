import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: '1.3rem',
    fontWeight :"500",
    textAlign:'center'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign:'center'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const TableComponent = (props)=> {
  const {data} =props;
  
  const tableCreator = (tableDate=[[]]) => {
    const headers = tableDate[0]
    const bodyDate = tableDate.slice(1); //remove the header
    
    const headerComponents =
        <TableHead>
          <TableRow>
            {headers.map((h, ind)=>{
              return (<StyledTableCell style={h.style} key={`header-${ind}`}>{h.value}</StyledTableCell>)
            })}
          </TableRow>
        </TableHead>
    
    const tableBody =
      <TableBody>
            {bodyDate.map((row, ind) => (
              <StyledTableRow key={`row-${ind}`}>
                {row.map((c, rowInd) =>(
                  <StyledTableCell style={c.style} key={`cell-${rowInd}`} component="th" scope="row">
                    {c.value}
                  </StyledTableCell>))
                  }
              </StyledTableRow>
                ))}
      </TableBody>

     
    
    return ( 
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        {headerComponents}
        {tableBody}
      </Table>)
  }
 
  
  return (
    <TableContainer component={Paper}>
      {tableCreator(data)}    
    </TableContainer>
  );
}

export default TableComponent