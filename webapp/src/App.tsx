import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'

function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <ConnectButton />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
