import './App.css'

import { useEffect, useState } from 'react'

import Chart from 'react-apexcharts'

let endpoint = `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`

function App () {
  const [chartData, setChartData] = useState()
  const [contractAddress, setContractAddress] = useState(
    '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8'
  )

  const [apexChartData, setApexChartData] = useState({
    series: [
      {
        data: [
          [1327359600000, 30.95],
          [1327446000000, 31.34],
          [1327532400000, 31.18],
          [1327618800000, 31.05],
          [1327878000000, 31.0],
          [1327964400000, 30.95],
          [1328050800000, 31.24],
          [1328137200000, 31.29],
          [1328223600000, 31.85],
          [1328482800000, 31.86],
          [1328569200000, 32.28]
        ]
      }
    ],
    options: {
      chart: {
        id: 'area-datetime',
        type: 'area',
        height: 350,
        zoom: {
          autoScaleYaxis: true
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
        style: 'hollow'
      },
      xaxis: {
        type: 'datetime',
        // min: new Date('01 Mar 2012').getTime(),
        tickAmount: 6
      },
      tooltip: {
        x: {
          format: 'MM dd yyyy hh:mm'
        },
        y: {
          enabled: false
        }
      },
      stroke: {
        curve: 'smooth',
        colors: ['#c00f4d'],
        width: 3
      },
      fill: {
        type: 'gradient',
        colors: ['#c00f4d', '#000'],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.66,
          opacityTo: 0,
          stops: [0, 500]
        }
      },
      theme: {
        mode: 'light',
        palette: 'palette1',
        monochrome: {
          enabled: false,
          color: '#00000',
          shadeTo: 'dark',
          shadeIntensity: 1
        }
      }
    }
  })

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

  async function getData () {
    console.log('received clicked')

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: graphQuery })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.data.pool) {
          console.log(data.data.pool)
          alert('Please enter a valid pool/pair address')
        } else {
          // console.log(data.data)
          setChartData(data.data)
        }

        // setChartData(data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function unixTimeConverter (unixTime) {
    let convertedDate = new Date(unixTime * 1000)
    return convertedDate.toLocaleString()
  }

  useEffect(() => {
    if (chartData) {
      let updatedSeries = []
      chartData.pool.poolHourData.forEach(item => {
        let tokenPrice = parseFloat(item.token0Price)
        updatedSeries.push([item.periodStartUnix * 1000, tokenPrice.toFixed(2)])
      })
      let prevState = apexChartData
      setApexChartData(prevState => ({
        options: { ...prevState.options },
        series: [{ data: updatedSeries }]
      }))
      // console.log(updatedSeries)
      // console.log(apexChartData)
    }
  }, [chartData])

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
          `${chartData && chartData.pool.token0.symbol} VS ${chartData &&
            chartData.pool.token1.symbol}`}
      </h2>

      <div id='chart'>
        <div id='chart-timeline'>
          <Chart
            options={apexChartData.options}
            series={apexChartData.series}
            type='area'
            height={350}
          />
        </div>
      </div>

      <ul>
        {chartData &&
          chartData.pool.poolHourData.map((item, index) => {
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
