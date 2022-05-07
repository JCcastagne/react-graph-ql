import { useEffect, useState } from 'react'
import './App.css'

let endpoint = `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`

function App () {
  // useEffect(() => {}, [])
  const [chartData, setChartData] = useState()
  const [contractAddress, setContractAddress] = useState(
    '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8'
  )

  let graphQuery = `
{
  pool(id: "${contractAddress}") {
    poolHourData(orderBy: periodStartUnix, orderDirection: desc) {
      token0Price
      token1Price
      periodStartUnix
    }
    token0 {
      symbol
    }
    token1 {
      symbol
    }
  }
}

  `

  function getData () {
    console.log('received clicked')

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: graphQuery })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.pool) {
          alert('Please enter a valid pool/pair address')
        } else {
          setChartData(data)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  function unixTimeConverter (unixTime) {
    let convertedDate = new Date(unixTime * 1000)
    return convertedDate.toLocaleString()
  }

  // useEffect(() => {
  //   chartData && console.log(chartData.data.pool.poolHourData)
  // }, [chartData])

  // useEffect(() => {
  //   console.log(graphQuery)
  // }, [graphQuery])

  return (
    <div className='App'>
      <h1>Get the price history of a pool</h1>

      <form>
        <label>Enter a valid pool address</label>
        <input
          type='text'
          name='poolAddress'
          onChange={e => {
            setContractAddress(e.target.value.toLowerCase())
          }}
        />

        <button
          className='button'
          onClick={e => {
            e.preventDefault()
            getData()
          }}
        >
          <p>Get data</p>
        </button>
      </form>

      <h2>
        {chartData &&
          `${chartData && chartData.data.pool.token0.symbol} VS ${chartData &&
            chartData.data.pool.token1.symbol}`}
      </h2>

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
