
import './App.css'
import { useState } from 'react'
import  MultipleChoiceQuiz  from './components/MultipleChoiceQuiz'
import WriteTranslationQuiz from './components/WriteTranslationQuiz'

function App() {
  const [activeQuiz, setActiveQuiz] = useState<'multiple-choice' | 'write-translation' | null>(null);
 

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen  p-4">
        <h1 className="text-4xl text-gray-800 font-bold mb-8 dark:text-white-800">Spanish Training Site!</h1>
        {activeQuiz && (
           <button onClick={() => setActiveQuiz(activeQuiz === 'write-translation' ? 'multiple-choice' : 'write-translation')} className='mb-4 bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-700 transition duration-300'>
           Switch Quiz
         </button>
        )}
        {activeQuiz === null && (
          <div className="space-y-2 mb-4 flex flex-col">
            <button onClick={() => setActiveQuiz('multiple-choice')} className='bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300'>Multiple Choice</button>
            <button onClick={() => setActiveQuiz('write-translation')} className='bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition duration-300'>Write Translation</button>

            </div>
        )}
        {activeQuiz === 'multiple-choice' && <MultipleChoiceQuiz />}
        {activeQuiz === 'write-translation' && <WriteTranslationQuiz />}

        
       
      </div>
      
    </>
  )
}

export default App
