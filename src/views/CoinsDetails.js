import './CoinCompare.css';
import { Component } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid2'
// import { Autocomplete } from '@mui/material';
// import AutoComplete from './modules/AutoCompleteField1';
import   AutoComplete   from './modules/PrimeAutoComplete';        
import { dateNormaliser,priceNormaliser,noNormaliser, sampleResult, emptyDataStructure, headers } from './modules/constants';
import {coinList} from './modules/sampleData'


class HomePage extends Component{

state={
        ids:[null,null,null,null] ,
        coinsList:[{}], 
        inProgress:false, 
        data :[emptyDataStructure,emptyDataStructure, emptyDataStructure, emptyDataStructure],
        radioButtonValue: "Option 1"
}

componentDidMount() {
  // axios.get("https://api.coingecko.com/api/v3/coins/list")
  // // axios.get("https://api.coinpaprika.com/v1/coins")
  //   .then((response)=>{
  //     const data = response.data;
  //     // const filteredData = data.filter(i=>i.rank !==0 && i.rank <=1000)
  //     this.setState({coinsList:data})
  //   }).catch((er)=>console.log(er.message))
      this.setState({coinsList:coinList})
}

fetchCoinId = (sym = '')=>{
  if (typeof sym === 'string') {
    const coinsList = this.state.coinsList || [{}]
    const coinObj = coinsList.find(c=>c.name && c.name.toUpperCase()===sym.toUpperCase())
    const result = coinObj && coinObj.id || ""
    return result.toLowerCase()
  }
  return ""
}

  fetchCoinDetails =(ids ) =>{    
    this.setState({inProgress:true})
    const filteredArray = ids.filter(Boolean).map(this.fetchCoinId)
    const idsString = filteredArray.join(',')

      axios
      .get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids="+idsString)
      // .get("https://jsonplaceholder.typicode.com/users/1")
      .then((response) => {
        this.setState({inProgress:false})      
        const res = response.data ||[]
        const coinsData=[]
        ids.map(id=> coinsData.push(res.find(c=> (c.name && c.name.toUpperCase()) === (id && id.toUpperCase())) || [emptyDataStructure] ))
        this.setState({data:coinsData})
      })
      .catch((err) => {
        this.setState({inProgress:false})
        console.log(err)});
  }

  tableDataCreator =(coinDetails) =>{
    const result =[]    
    const titles = Object.keys(headers);
    const percentFormatter= (no) =>no && no.toPrecision(4) || no
    titles.forEach(h=>{
      const header = headers[h] 
      const marketCapWithPercent = (mc,fdv) => `${noNormaliser(mc)} (${(mc>0&&fdv>0) ? percentFormatter(100*mc/(fdv||1) ):''}%)`     
      const col1 = header == "Market Cap" && coinDetails[0][h] && coinDetails[0]["fully_diluted_valuation"] ? marketCapWithPercent(coinDetails[0][h],coinDetails[0]["fully_diluted_valuation"]) : coinDetails[0][h];
      const col2 = header == "Market Cap" && coinDetails[1][h] && coinDetails[1]["fully_diluted_valuation"] ? marketCapWithPercent(coinDetails[1][h],coinDetails[1]["fully_diluted_valuation"]) : coinDetails[1][h];
      const col3 = header == "Market Cap" && coinDetails[2][h] && coinDetails[2]["fully_diluted_valuation"] ? marketCapWithPercent(coinDetails[2][h],coinDetails[2]["fully_diluted_valuation"]) : coinDetails[2][h];
      const col4 = header == "Market Cap" && coinDetails[3][h] && coinDetails[3]["fully_diluted_valuation"] ? marketCapWithPercent(coinDetails[3][h],coinDetails[3]["fully_diluted_valuation"]) : coinDetails[3][h];
      const row =[header, col1, col2, col3, col4]
      return (result.push(row))


      // return result.push([headers[h], coinDetails[0][h], coinDetails[1][h], coinDetails[2][h], coinDetails[3][h]])
    })
    return result
  }

  inputFieldChangeHandler = (id,value) =>{
    let newIds= this.state.ids||[];
    newIds[id] = value;
    return this.setState({ids: newIds})
  }

  tableCreator =(data)=>  { 

    const {coinsList} = this.state
    // const coinOptions = coinsList.map(c=>c.name)
    const coinOptions = coinsList.map(c=>({item: c.symbol, description: c.name}))


    const normalisers ={
      [headers.current_price]: priceNormaliser,
      [headers.market_cap]: priceNormaliser,
      [headers.fully_diluted_valuation]: priceNormaliser,
      [headers.price_change_24h]: noNormaliser,
      [headers.circulating_supply]: noNormaliser,
      [headers.total_supply]: noNormaliser,
      [headers.max_supply]: noNormaliser,
      [headers.ath]: priceNormaliser,
      [headers.ath_date]: dateNormaliser,
      [headers.atl]: priceNormaliser,
      [headers.atl_date]: dateNormaliser,
    }

    const headerStyle = {
      border: 'none',
      // borderBottom: '1px solid #ddd',
      padding: '10px',
      textAlign: 'center',
      fontSize:'12px',
      fontWeighth:"600 !important",
      minWidth:'5vw',
      height:'5vh'
  };
    const logosStyle = {
      border: '1px solid #ddd',
      padding: '10px',
      textAlign: 'center',
      fontSize:'12px',
      fontWeighth:"600 !important",
      minWidth:'5vw',
      height:'5vh'
  };
    const rowHeaderStyle = {
      border: '1px solid #ddd',
      padding: '10px',
      textAlign: 'center',
      fontSize:'12px',
      fontWeighth:"600 !important",
      minWidth:'5vw',
  };
    const cellStyle = {
      border: '1px solid #ddd',
      padding: '10px',
      textAlign: 'center',
      fontSize:'12px',
      width:'12vw'
  };
    const tableHeaders = data[0]
    data.shift()
    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>

        <thead>
          <tr>
              <td style={headerStyle}></td>
              <td style={headerStyle}>
                <AutoComplete id='id1' placeholder='Source Coin' callback ={(e) => this.inputFieldChangeHandler(0,e)}  items={coinOptions} />         
              </td>
              <td style={headerStyle}>
                <AutoComplete id='id2' placeholder='Source Coin' callback ={(e) => this.inputFieldChangeHandler(1,e)}  items={coinOptions} />         
              </td>
              <td style={headerStyle}>
                <AutoComplete id='id3' placeholder='Source Coin' callback ={(e) => this.inputFieldChangeHandler(2,e)}  items={coinOptions} />         
              </td>
              <td style={headerStyle}>
                <AutoComplete id='id4' placeholder='Source Coin' callback ={(e) => this.inputFieldChangeHandler(3,e)}  items={coinOptions} />         
              </td>
          </tr>
        </thead>

      <tbody>
          <tr>
              {tableHeaders.map((i,ind)=>(ind===0?<td style={logosStyle} key={`${i}-${ind}`}></td>:
                    <td key={`${i}-${ind}`} style={logosStyle}>{i && <img key={`IM-${i}-${ind}`} src={i} style={{width:'3vw'}}/>}</td>
                   ))}
          </tr>
          {data.map((row, index) => (
              <tr key={`row-${index}`}>
                {
                  row.map((i,ind)=>(<td key={`${i}-${ind}`} style={ind===0? rowHeaderStyle: cellStyle}>{
                    (Object.keys(normalisers).includes(row[0]) && ind !==0)? normalisers[row[0]](i):i
                    }</td>))
                } 
              </tr>
          ))}
      </tbody>
  </table>
    )
  }

  findDataByField = (data,fieldName) => {    
    const dataArray =  data || {}
    return (dataArray[fieldName]||"")
  }


  render =() =>{
    
    const coinsData = this.state.data ||[]
     
    const table =
      <div style={{marginTop:'2vh', minWidth:'60vw'}}>
      <Grid container justifyContent={'center'} > 
        <Grid item>
          {coinsData && coinsData.length && this.tableCreator(this.tableDataCreator(coinsData))}
          </Grid>
        </Grid> 
      </div>

 
    return (
      <div className="App">
        <Grid container justifyContent={'center'} spacing={5} style={{marginBottom:'5vh'}}>         
          <Grid item justifyContent={'center'}>
            <button disabled={this.state.inProgress} onClick={()=>this.fetchCoinDetails(this.state.ids)}>Compare</button>
          </Grid>
        </Grid>
        <Grid container justifyContent={'center'}>
          <Grid item size={{ xs: 10 }} >
            {table}
          </Grid>
        </Grid>
    </div>
  );
}
}

export default HomePage;
