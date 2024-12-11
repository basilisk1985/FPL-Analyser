import './CoinCompare.css';
import { Component } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid2'
// import { Autocomplete } from '@mui/material';
// import AutoComplete from './modules/AutoCompleteField1';
import   AutoComplete   from './modules/PrimeAutoComplete';        
import { dateNormaliser,priceNormaliser,noNormaliser, allCapital, emptyDataStructure, headers } from './modules/constants';
import {coinList} from './modules/sampleData'


class HomePage extends Component{

state={
        id1:null, 
        id2:null, 
        coinsList:[{}], 
        inProgress:false, 
        data :[emptyDataStructure,emptyDataStructure],
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

  fetchCoinDetails =(ids ) => {
 
    const id1 =  ids && ids[0] || ""
    const id2 =  ids && ids[1] || ""

    this.setState({inProgress:true})
   
    // const coin1Data = sampleResult.find(c=> c.symbol.toUpperCase() === id1.toUpperCase())
    // // coin1Data = this.addCirculatingSupply(coin1Data)
    // // console.log("🚀 ~ HomePage ~ coin1Data:", coin1Data)
    // const coin2Data = sampleResult.find(c=> c.symbol.toUpperCase() === id2.toUpperCase())
    //   this.setState({data:[coin1Data, coin2Data]  })

      axios
      .get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids="+this.fetchCoinId(id1)+","+this.fetchCoinId(id2))
      // .get("https://jsonplaceholder.typicode.com/users/1")
      .then((response) => {
        this.setState({inProgress:false})      
        const res = response.data
        const coin1Data = res.find(c=>  (c.name && c.name.toUpperCase()) === id1.toUpperCase())||[emptyDataStructure]
        const coin2Data = res.find(c=> (c.name && c.name.toUpperCase()) === id2.toUpperCase())||[emptyDataStructure]
          this.setState({data:[coin1Data, coin2Data]})
      })
      .catch((err) => {
        this.setState({inProgress:false})
        console.log(err)});
  }


  tableDataCreator =(coinDetails) =>{
    const result =[]    
    const titles = Object.keys(headers);
    const percentFormatter= (no) =>no && no.toPrecision(4) || no
    titles.forEach((h)=>{
      const header = headers[h] 
      const marketCapWithPercent = (mc,fdv) => `${noNormaliser(mc)} (${(mc>0&&fdv>0) ? percentFormatter(100*mc/(fdv||1) ):''}%)`     
      const col1 = header == "Market Cap" && coinDetails[0][h] && coinDetails[0]["fully_diluted_valuation"]? marketCapWithPercent(coinDetails[0][h],coinDetails[0]["fully_diluted_valuation"]) : coinDetails[0][h];
      const col2 = header == "Market Cap" && coinDetails[1][h] && coinDetails[1]["fully_diluted_valuation"]? marketCapWithPercent(coinDetails[1][h],coinDetails[1]["fully_diluted_valuation"]) : coinDetails[1][h];
      const row =[header, col1, col2]
      return (result.push(row))})
    return result
  }

  tableCreator =(data)=>  { 

    const normalisers ={
      [headers.symbol]: allCapital,
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
              {tableHeaders.map((i,ind)=>(ind===0?<td style={headerStyle} key={`${i}-${ind}`}></td>:
                    <td key={`${i}-${ind}`} style={headerStyle}>{i && <img key={`IM-${i}-${ind}`} src={i} style={{width:'3vw'}}/>}</td>
                   ))}
          </tr>
      </thead>
      <tbody>
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

  calculatePrice =(currentPrice, circulatingSupply, athPrice, circulatingSupply2, targetMarketCap, radioButton) => {
    let projectedPrice =  0
    switch  (radioButton ){
      case  'Option 1':
        projectedPrice = targetMarketCap/ circulatingSupply
        break
        
        case 'Option 2':
          const athTargetMarketCap = circulatingSupply2 * athPrice
          projectedPrice = athTargetMarketCap/ circulatingSupply
        break

        case 'Option 3':
          const marketCapRatio = this.state.marketCapRatio || 1
          const parsedMarketCapratio = parseFloat(marketCapRatio) || 1
          //const targetMrketCapRatio = typeof this.state.marketCapRatio ==='number' && this.state.marketCapRatio 
          projectedPrice = parsedMarketCapratio * targetMarketCap/ circulatingSupply
        break
    }
    const percent_change = 100*(projectedPrice-currentPrice)/currentPrice
    return ({projectedPrice, percent_change })
  }

  inputFieldChangeHandler = (id,value) =>{
    let newIds= this.state.ids||[];
    newIds[id] = value;
    return this.setState({ids: newIds})
  }
  
  render =() =>{
    
    const coinsData = this.state.data ||[]
    const {ids,coinsList, radioButtonValue, marketCapRatio} = this.state
    const coinOptions = coinsList.map(c=>({item: c.symbol, description: c.name}))
    const currentPrice = this.findDataByField(coinsData[0],'current_price')
    const targetAthPrice = this.findDataByField(coinsData[1],'ath')
    const currentMarketCap= this.findDataByField(coinsData[0],'market_cap')
    const circulatingSupply= this.findDataByField(coinsData[0],'circulating_supply')
    const circulatingSupply2= this.findDataByField(coinsData[1],'circulating_supply')
    const projectedMarketCap= this.findDataByField(coinsData[1],'market_cap')
    const {projectedPrice,percent_change }= this.calculatePrice(currentPrice, circulatingSupply, targetAthPrice, circulatingSupply2, projectedMarketCap, radioButtonValue)
    
    const table =
      <div style={{marginTop:'2vh', minWidth:'60vw'}}>
      <Grid container justifyContent={'center'} > 
        <Grid>
          {coinsData && coinsData.length && this.tableCreator(this.tableDataCreator(coinsData))}
          </Grid>
        </Grid> 
      </div>

  const radioButtonArea = 
        <div style={{textAlign:"left",  marginLeft:'4vw'}}>
          <label>
            <input
              type="radio"
              value="Option 1"
              checked={radioButtonValue === "Option 1"}
              onChange={(event) => this.setState({radioButtonValue: event.target.value})}
            />
            Current Market Cap
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="Option 2"
              checked={radioButtonValue === "Option 2"}
              onChange={(event) => this.setState({radioButtonValue: event.target.value})}
            />
            Market Cap at ATH
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="Option 3"
              checked={radioButtonValue === "Option 3"}
              onChange={(event) => this.setState({radioButtonValue: event.target.value})}
            />
            With Scaled Market Cap
          </label>
          <br />
        { radioButtonValue==='Option 3' && <div style={{pading:'1vw'}}>
          <label>
            Target Market Cap Ratio:
          </label>
            <input
              style={{marginLeft:'1vw', width:'4vw'}}
              type="text"
              value={marketCapRatio}
              onChange={(event) => this.setState({marketCapRatio: event.target.value})}
              />
          </div>}
        </div>

const CompareCoinArea = projectedPrice?
        <Grid  style={{marginTop:'2vh'}} className='calculationCard' spacing={3} container>  
          <Grid  style ={{}}  size={{ xs: 12 }}>
            <p>{`${ids[0] && ids[0].toUpperCase()} price with the  market cap of ${ids[1] && ids[1].toUpperCase()}`}</p>
          </Grid>
          <Grid  style ={{}}  size={{ xs: 12 }}>
            <Grid container minHeight={60} spacing={2} justifyContent="center" style ={{color:'white'}}>
              <Grid display="flex" justifyContent="center" alignItems="center" size={{}}>
                <img className={'logo'} src={this.findDataByField(coinsData[0],'image')}/>   
                <span style={{margin:'0 5px'}} >{ids[0] && ids[0].toUpperCase()}</span>
              </Grid>
              <Grid display="flex" justifyContent="center" alignItems="center" size={{}}>
                <span className='priceTag'>{`${priceNormaliser(projectedPrice)}`}</span>
                <span className='percentTag'>{`(${noNormaliser(percent_change)}%)`}</span>
              </Grid>
            </Grid>
          </Grid>
          <Grid  style ={{}}  size={{ xs: 12 }}>
            <p style={{textAlign:"left", marginLeft:'4vw',marginBottom:'1vh'}} >{`${ids[0] && ids[0].toUpperCase()} mCap: ${priceNormaliser(currentMarketCap)}`}</p>
            <p style={{textAlign:"left", marginLeft:'4vw',marginTop:'1vh'}} >{`${ids[1] && ids[1].toUpperCase()} mCap: ${priceNormaliser(projectedMarketCap)}`}</p>
          </Grid>
          <Grid  style ={{marginBottom:'2vh'}}  size={{ xs: 12 }}>
            {radioButtonArea}
          </Grid>
        </Grid>:
        <Grid style={{marginTop:'2vh', minWidth:'30vw', minHeight:'30vh'}} className='calculationCard' spacing={3} container>  </Grid>


    return (
      <div className="App">
        <Grid container justifyContent={'center'} spacing={5} style={{marginBottom:'5vh'}}>
          <Grid >
            <AutoComplete id='id1' placeholder='Source Coin' callback ={(e) => this.inputFieldChangeHandler(0,e)}  items={coinOptions} />         
          </Grid>
          <Grid >
            <AutoComplete id='id2' placeholder='Target Coin' callback ={(e) => this.inputFieldChangeHandler(1,e)}  items={coinOptions} />
          </Grid>
          <Grid  justifyContent={'center'}>
            <button disabled={this.state.inProgress} onClick={()=>this.fetchCoinDetails(this.state.ids)}>Compare</button>
          </Grid>
        </Grid>
        <Grid container justifyContent={'center'}>
          <Grid size={{ xs: 12 , lg:7}} >
            {table}
          </Grid>
          <Grid size={{ xs: 5 , lg:4}}>
            {CompareCoinArea}
          </Grid>
        </Grid>
    </div>
  );
}
}

export default HomePage;
