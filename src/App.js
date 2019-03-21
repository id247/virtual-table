import React, { useState, useEffect } from 'react'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

const rows = []
const rowHeight = 30

for (let i = 0; i < 100000; i++) {
  const cells = []
  for (let j = 0; j < 15; j++) {
    cells.push({
      id: `col-${j}`,
      content: Math.random()
        .toString(36)
        .substring(7),
    })
  }

  rows.push({ id: i + 1, cells })
}

const px = n => `${n}px`

const getSize = () => Math.ceil(window.innerHeight / rowHeight)

const updateItems = ({ sliceRows, size }) => {
  const deltaPercent = window.pageYOffset / (rows.length * rowHeight)

  const begin = Math.round(rows.length * deltaPercent)
  sliceRows(rows.slice(begin, begin + size))
}

const handleScroll = ({ sliceRows, size }) => {
  const scrollListener = throttle(e => {
    updateItems({ sliceRows, size })
  }, 100)

  window.addEventListener('scroll', scrollListener)

  return () => {
    window.removeEventListener('scroll', scrollListener)
  }
}

const handleResize = ({ setSize }) => {
  const resizeListener = debounce(e => {
    setSize(getSize())
  }, 300)

  window.addEventListener('resize', resizeListener)

  return () => {
    window.removeEventListener('resize', resizeListener)
  }
}

function App() {
  const [size, setSize] = useState(getSize())
  const [slicedRows, sliceRows] = useState(rows.slice(0, size))

  useEffect(() => handleResize({ setSize }), [])
  useEffect(() => handleScroll({ sliceRows, size }), [size])
  useEffect(() => {
    updateItems({ sliceRows, size })
  }, [size])

  return (
    <div style={{ height: px(rows.length * rowHeight) }}>
      <table>
        <tbody>
          {slicedRows.map(row => (
            <tr key={row.id}>
              {row.cells.map(cell => (
                <td key={cell.id}>{cell.content}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
