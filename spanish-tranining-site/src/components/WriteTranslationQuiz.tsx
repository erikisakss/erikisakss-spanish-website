import { useState, useEffect } from 'react';
import data from './data.json';

interface WordPair {
    Spanish: string;
    English: string;
}

const wordPairs: WordPair[] = data.map((pair) => ({
    Spanish: pair.Spanish,
    English: pair.English.toString(),
}));

const getRandomWordPair = () => {
    const randomIndex = Math.floor(Math.random() * wordPairs.length);
    return wordPairs[randomIndex];
}

const WriteTranslationQuiz: React.FC = () => {
    const [currentWordPair, setCurrentWordPair] = useState<WordPair>(getRandomWordPair());
    const [selectedLanguage, setSelectedLanguage] = useState<'Spanish' | 'English'>('Spanish');
    const [userInput, setUserInput] = useState<string>('');
    const [answerStatus, setAnswerStatus] = useState<'correct' | 'almost' | 'incorrect' | null>(null);
    const targetLanguage = selectedLanguage === 'Spanish' ? 'English' : 'Spanish';
    const [definition, setDefinition] = useState<string>('');
    useEffect(() => {
       setCurrentWordPair(getRandomWordPair());
        setUserInput('');
        setAnswerStatus(null);
        setDefinition('')

    }, [selectedLanguage]);

    const checkAnswer = () => {
        const correctAnswer = currentWordPair[targetLanguage].toLowerCase();
        const userInputLower = userInput.trim().toLowerCase();

        if(userInputLower === correctAnswer) {
            setAnswerStatus('correct');

            setTimeout(() => {
                setCurrentWordPair(getRandomWordPair());
                setUserInput('');
                setAnswerStatus(null);
                setDefinition('');
            }, 300);

        } else if(isAlmostCorrect(userInputLower, correctAnswer)) {
            setAnswerStatus('almost');
        } else {
            setAnswerStatus('incorrect');
        }
    };

    const levensteinDistance = (a: string, b: string): number => {
        if(a.length === 0) return b.length;
        if(b.length === 0) return a.length;

        const matrix = [];

        for(let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for(let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(
                            matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1 // deletion
                        )
                    );
                }
            }
        }
    
        return matrix[b.length][a.length];
    };



    const isAlmostCorrect = (userInput: string, correctAnswer: string): boolean => {
       const distance = levensteinDistance(userInput, correctAnswer);
       return distance <= 2;
    

    };

    const fetchDefinition = async () => {
        const wordToDefine = currentWordPair.English.toLowerCase();
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordToDefine}`);
            const data = await response.json();
            const definition = data[0].meanings[0].definitions[0].definition;
            setDefinition(definition);
        } catch (error) {
            console.log(error);
        }
    }

    const handleLanguageChange = () => {
        setSelectedLanguage(selectedLanguage === 'Spanish' ? 'English' : 'Spanish');
       
      }

      return (
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto mt-8">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
              onClick={handleLanguageChange}
            >
              Switch to {targetLanguage}
            </button>
            <div className="my-4">
              <p className="text-center font-bold text-lg text-black">{currentWordPair[selectedLanguage]}</p>
            </div>
            <div>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full px-4 py-2 my-1 rounded border-2 border-gray-200 text-black"
                placeholder={`Enter the translation in ${targetLanguage}`}
              />
              <button
                onClick={checkAnswer}
                className="w-full bg-green-500 text-white px-4 py-2 my-1 rounded"
              >
                Check Answer
              </button>
            </div>
            <div>
                <button
                    onClick={fetchDefinition}
                    className="w-full bg-blue-500 text-white px-4 py-2 my-1 rounded"
                >
                    Get definition
                </button>
                {definition && (
                    <div className="w-full px-4 py-2 my-1 rounded text-black bg-gray-100 overflow-auto">
                    <p className="break-words">{definition}</p>
                    </div>
                )}
            </div>
            {answerStatus && (
              <div className={`w-full px-4 py-2 my-1 rounded text-white ${
                answerStatus === 'correct' ? 'bg-green-500'
                : answerStatus === 'almost' ? 'bg-orange-500'
                : 'bg-red-500'
              }`}>
                {answerStatus === 'correct' ? 'Correct!'
                : answerStatus === 'almost' ? 'Almost correct!'
                : 'Wrong, try again!'}
              </div>
            )}
          </div>
        </div>
      );
    };
    
    export default WriteTranslationQuiz;