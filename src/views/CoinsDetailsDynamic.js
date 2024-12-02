import './CoinCompare.css';
import { Component } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid2'
// import { Autocomplete } from '@mui/material';
// import AutoComplete from './modules/AutoCompleteField1';
import   AutoComplete   from './modules/PrimeAutoCompleteFullObject';        
import { dateNormaliser,priceNormaliser,noNormaliser, allCapital, emptyDataStructure, headers } from './modules/constants';
import {coinList} from './modules/sampleData'


class HomePage extends Component{

state={
        ids:[null, null, null, null, null] ,
        coinsList:[{}], 
        inProgress:false, 
        data :[emptyDataStructure,emptyDataStructure, emptyDataStructure],
        radioButtonValue: "Option 1"
}

componentDidMount() {
      this.setState({coinsList:coinList})
}

addCoins = ()=>{
  const inputField = this.state.inputField || ''
  if (inputField && inputField.item) {      
    const coinObjectList= this.state.coinObjectList ||[]
    coinObjectList.push(inputField)
    return this.setState({coinObjectList:coinObjectList, inputFieldValue:null})
  }
}

compareCoins = ()=>{
  const coinObjectList = this.state.coinObjectList||[{}]  
  if (coinObjectList && coinObjectList.length ) {      
    return this.fetchCoinDetails(coinObjectList)
  }
}


  fetchCoinDetails =(coins ) =>{    
    this.setState({inProgress:true})
    const idsString = coins.map(c=>c.id).join(',')

      axios
      .get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids="+idsString)
      // .get("https://jsonplaceholder.typicode.com/users/1")
      .then((response) => {
        this.setState({inProgress:false})      
        const res = response.data ||[]
        const coinsData=[]
        // ids.map(id=> coinsData.push(res.find(c=> (c.name && c.name.toUpperCase()) === (id && id.toUpperCase())) || [emptyDataStructure] ))
        const sortedRes = res.sort((a,b) => parseInt(a['market_cap_rank']||'999999999') - parseInt(b['market_cap_rank']||'999999999') )
        this.setState({data:sortedRes})
      })
      .catch((err) => {
        this.setState({inProgress:false})
        console.log(err)});
  }

  tableDataCreator =(coinDetails) => {
    const result =[]    
    const titles = Object.keys(headers);
    const percentFormatter= (no) =>no && no.toPrecision(4) || no
    titles.forEach(h=>{
      const header = headers[h] 
      const rowData =coinDetails.map(c=>{
        const marketCapWithPercent = (mc,fdv) => `${noNormaliser(mc)} (${(mc>0&&fdv>0) ? percentFormatter(100*mc/(fdv||1) ):''}%)`   
        const currentPriceFloat = parseFloat(c['current_price'] || '')
        const priceChange = noNormaliser(c['price_change_24h']) || ''
        const priceChangeFloat = parseFloat(priceChange)
        const priceChangePercent = (100 * priceChangeFloat / currentPriceFloat).toFixed(2)
        const priceChangeComponent =   priceChangeFloat ? (<span style={{color:priceChangeFloat<0 ? 'red':priceChangeFloat>0 ?'green' : 'black'}}>{`(${priceChangeFloat>0 ?'+' : ''}${priceChangePercent}%)`}</span>) :''
        return (
          (header == "Market Cap" && c[h] && c["fully_diluted_valuation"]) ? marketCapWithPercent(c[h],c["fully_diluted_valuation"]) : 
          header == "Price" && c[h] ? <div><span>{priceNormaliser(c[h])}</span> {priceChangeComponent}</div>  :
          c[h]
      )        
      })
      const row =[header, ...rowData]
      return (result.push(row))
    })
    return result
  }

  inputFieldChangeHandler = (value) => {
    return this.setState({inputField: value})
  }

  tableCreator =(data)=>  { 
    const normalisers ={
      [headers.symbol]: allCapital,
      // [headers.current_price]: priceNormaliser,
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
    const coinObjectList = this.state.coinObjectList||[{}]
     
    const table =
      <div style={{marginTop:'2vh', minWidth:'60vw'}}>
      <Grid container justifyContent={'center'} > 
        <Grid item>
          {coinsData && coinsData.length && this.tableCreator(this.tableDataCreator(coinsData))}
          </Grid>
        </Grid> 
      </div>

    const {coinsList} = this.state

    const coinOptions = coinsList.map(c=>({item: c.symbol, description: c.name, id:c.id}))

    const textareaValue = coinObjectList.map(c=>(c.item?`${c.item.toUpperCase()}-${c.id}\n`:'')).join('')

 
    return (
      <div className="App">
        <Grid container spacing={5}>
          <Grid item  size={{xs:12, lg:3}}>
            <Grid container  direction='column' justifyContent={'center'} spacing={5} style={{marginBottom:'3vh'}}>         
                <Grid item justifyContent={'center'}>
                  <div style={{display: 'flex', marginTop: '2vh',  marginBottom: '2vh',  alignItems: 'center',  justifyContent: 'center'}}>
                    <AutoComplete id='inputCoin' placeholder='Enter Coin' value={this.state.inputFieldValue} setValue={(val)=>this.setState({inputFieldValue: val})} callback ={ this.inputFieldChangeHandler} items={coinOptions} /> 
                    <button  style={{marginLeft:'1vw'}}  disabled={this.state.inProgress} onClick={this.addCoins}>Add</button>
                  </div>
                </Grid>
                <Grid item justifyContent={'center'}>
                  <textarea
                    value={textareaValue}
                    readOnly
                    rows="6"
                    // cols="8"
                    style={{ width: "80%", padding: "10px" }}
                  />
                </Grid>
                <Grid item justifyContent={'center'} style={{display: 'flex',alignItems:'',  marginBottom: '4vh',  alignItems: 'center',  justifyContent: 'center'}} >
                  <button disabled={this.state.inProgress} onClick={()=>this.setState({coinObjectList:[]})}>Reset</button>
                  <button disabled={this.state.inProgress} style={{marginLeft:'2vw'}} onClick={this.compareCoins}>Compare</button>
                </Grid>
            </Grid>
            </Grid>

        <Grid size={{xs:12 , lg:9}} >
          <Grid container justifyContent={'center'}>
            <Grid item size={{xs:12, lg:9}} style={{display: 'flex', alignItems: 'center',  justifyContent: 'center'}} >
              {table}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
}

export default HomePage;
