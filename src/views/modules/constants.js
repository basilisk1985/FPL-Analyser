
const dateNormaliser =(d) =>{
       const date = new Date(d);
       // Get day, month, and year components
       const day = String(date.getDate()).padStart(2, '0');
       const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
       const year = date.getFullYear();
       // Format as dd/mm/yyyy
       const formattedDate = `${day}/${month}/${year}`;
       return d? formattedDate:""
     }
 
const priceNormaliser= (p) => p&& p!==0? "$"+noNormaliser(p):""

const allCapital= (p) => p && typeof p =='string' ? p.toUpperCase() :""
 
const noNormaliser= (p) => 
          typeof p ==='number' && p<1 ? p.toPrecision(6):
          (p>1 && p<1000) ? p.toFixed(2):
          p>=1000000000 ? `${(parseFloat(p) / 1e9).toFixed(2) + ' B'}`:
          p>=1000000 ? `${(parseFloat(p) / 1e6).toFixed(2) + ' M'}`:
          p>=1000 ? p.toLocaleString():
          p



const sampleResult=[
          {
              "id": "solana",
              "symbol": "sol",
              "name": "Solana",
              "image": "https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756",
              "current_price": 204.63,
              "market_cap": 96989187708,
              "market_cap_rank": 4,
              "fully_diluted_valuation": 120891679810,
              "total_volume": 13372566959,
              "high_24h": 224.9,
              "low_24h": 201.75,
              "price_change_24h": -14.796779798957118,
              "price_change_percentage_24h": -6.74341,
              "market_cap_change_24h": -6386512940.371948,
              "market_cap_change_percentage_24h": -6.17796,
              "circulating_supply": 471905183.14672,
              "total_supply": 588203815.802876,
              "max_supply": null,
              "ath": 259.96,
              "ath_change_percentage": -20.61822,
              "ath_date": "2021-11-06T21:54:35.825Z",
              "atl": 0.500801,
              "atl_change_percentage": 41106.02595,
              "atl_date": "2020-05-11T19:35:23.449Z",
              "roi": null,
              "last_updated": "2024-11-13T06:32:25.709Z"
          },
          {
              "id": "sui",
              "symbol": "sui",
              "name": "Sui",
              "image": "https://coin-images.coingecko.com/coins/images/26375/large/sui-ocean-square.png?1727791290",
              "current_price": 2.91,
              "market_cap": 8352453710,
              "market_cap_rank": 19,
              "fully_diluted_valuation": 29350616421,
              "total_volume": 1907028976,
              "high_24h": 3.29,
              "low_24h": 2.86,
              "price_change_24h": -0.24153800570765638,
              "price_change_percentage_24h": -7.67103,
              "market_cap_change_24h": -643363767.4633446,
              "market_cap_change_percentage_24h": -7.15181,
              "circulating_supply": 2845750695.58389,
              "total_supply": 10000000000.0,
              "max_supply": 10000000000.0,
              "ath": 3.3,
              "ath_change_percentage": -10.3696,
              "ath_date": "2024-11-11T15:15:44.705Z",
              "atl": 0.364846,
              "atl_change_percentage": 710.47077,
              "atl_date": "2023-10-19T10:40:30.078Z",
              "roi": null,
              "last_updated": "2024-11-13T06:32:19.340Z"
          }
      ]

const emptyDataStructure = {
  "id": "",
  "symbol": "",
  "name": "",
  "image": "",
  "current_price": "",
  "market_cap": "",
  "market_cap_rank": "",
  "fully_diluted_valuation": "",
  "total_volume": "",
  "high_24h": "",
  "low_24h": "",
  "price_change_24h": "",
  "price_change_percentage_24h": "",
  "market_cap_change_24h": "",
  "market_cap_change_percentage_24h": "",
  "circulating_supply": "",
  "total_supply": "",
  "max_supply": "",
  "ath": "",
  "ath_change_percentage": "",
  "ath_date": "",
  "atl": "",
  "atl_change_percentage": "",
  "atl_date": "",
  "roi": "",
  "last_updated": ""
}

    const headers ={
      "image": "image",
      "name": "Name",
      "symbol": "Symbol",
      "current_price": "Price",
      "market_cap_rank": "Rank",
      "market_cap": "Market Cap",
      "fully_diluted_valuation": "FDV",
      "circulating_supply": "Circulating Supply",
      "total_supply": "Total Supply",
      "max_supply": "Max Supply",
      // "price_change_24h": "Price Change 24h",
      "ath": "ATH",
      "ath_change_percentage": "ATH Change Percentage",
      "ath_date": "ATH Date",
      "atl": "ATL",
      "atl_change_percentage": "ATL Change Percentage",
      "atl_date": "ATL Date"
    }


export {dateNormaliser,priceNormaliser,noNormaliser, allCapital,sampleResult,emptyDataStructure, headers}