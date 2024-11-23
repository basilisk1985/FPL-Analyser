import React, {PureComponent} from "react";
import Grid from "@mui/material/Grid2";
import TableComponent from "./modules/TableComponent";

const emptyRows = {
    logo:'',
    name:'',
    details:''
}

class DetailsPage extends PureComponent {

   dataCreator = (data = [], normalisers = {}) => {
    const firstRowStyle = { width:'8vw'}
    const inputData= data && data.length<2 ? [...data,emptyRows] : [...data]
    let tableData=[[]]
        const headersList = Object.keys(inputData[0])
        const details = (inputData.length > 1 && false) ? inputData.slice(1) : inputData;
        tableData = headersList.map((h,ind)=>{
            return details.map((d,ind)=> {
                const tableCell = 
                    (ind === 0) ? {value: h!=='logo'? h: '', style:{...firstRowStyle}} :
                    ( h === 'logo' ) ? {value: <img src={d[h]} alt={`logo-$`} style={{width:'30px'}} ></img> }:
                    {value: normalisers[h] ? normalisers[h](d[h]) : d[h]}
                return tableCell
            })
        })
        
    return tableData
   }

    render(){

        const atest ={
            logo:'https://img.freepik.com/free-photo/link-icon-front-side-white-backround_187299-40175.jpg',
            name:'first',
            details:'5'
        }
        const btest ={
            logo:'https://img.freepik.com/free-photo/link-icon-front-side_187299-39505.jpg',
            name:'second',
            details:'6'
        }
        const ctest ={
            logo:'https://img.freepik.com/free-vector/illustration-share-icon_53876-5843.jpg',
            name:'third',
            details:'7'
        }       

        const headers = {...emptyRows}

        const data =[headers, atest, btest, ctest, atest, btest, ctest ]
          const tableData = this.dataCreator(data)

        return (
            <Grid container>
                <Grid size={12}>
                    <TableComponent data={tableData}/>
                </Grid>
            </Grid>)
    }
}

export default DetailsPage


















//sol
//sui
//apt ton  arwave kaspa  inj(good tokenomic) tia1 stx 
// axelar not good toke 
//superverse(eliottrade owned)
//aethir  
//mantra
//cetus dex sui
