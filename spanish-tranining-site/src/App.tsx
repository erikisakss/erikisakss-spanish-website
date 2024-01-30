import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import  MultipleChoiceQuiz  from './components/MultipleChoiceQuiz'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
       <MultipleChoiceQuiz/>
      </div>
      
    </>
  )
}

export default App
