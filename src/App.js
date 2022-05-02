import { useEffect, useState } from 'react'
import './App.css'

let endpoint = `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`

let graphQuery = `
{
  pool(id: "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8") {
    poolHourData(orderBy: periodStartUnix) {
      token0Price
      token1Price
      periodStartUnix
    }
  }
}
`

function App () {
  // useEffect(() => {}, [])
  const [chartData, setChartData] = useState()

  function getData () {
    console.log('received clicked')
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: graphQuery })
    })
      .then(response => response.json())
      .then(data => setChartData(data))
      .catch(err => console.log(err))
  }

  function unixTimeConverter (unixTime) {
    let convertedDate = new Date(unixTime * 1000)
    return convertedDate.toLocaleString()
  }

  // useEffect(() => {
  //   chartData && console.log(chartData.data.pool.poolHourData)
  // }, [chartData])

  return (
    <div className='App'>
      <div className='button' onClick={() => getData()}>
        <p>Get data</p>
      </div>

      <ul>
        {chartData &&
          chartData.data.pool.poolHourData.map((item, index) => {
            return (
              <li key={index}>
                <p>{item.token0Price}</p>
                <p>{item.token1Price}</p>
                <p>{unixTimeConverter(item.periodStartUnix)}</p>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default App
