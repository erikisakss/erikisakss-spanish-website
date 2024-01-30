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

const TranslationQuiz: React.FC = () => {
    const [currentWordPair, setCurrentWordPair] = useState<WordPair>(getRandomWordPair());
    const [selectedLanguage, setSelectedLanguage] = useState<'Spanish' | 'English'>('Spanish');
    const [choices , setChoices] = useState<string[]>([]);
    const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const targetLanguage = selectedLanguage === 'Spanish' ? 'English' : 'Spanish';

    useEffect(() => {
       setChoices(generateChoices(currentWordPair, targetLanguage));

       setWrongAnswers([]);
        

    }, [selectedLanguage, currentWordPair]);

    const generateChoices = (newWordPair: WordPair, targetLanguage: 'Spanish' | 'English') => {
        let newChoices = wordPairs
            .map(pair => pair[targetLanguage])
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        newChoices.push(newWordPair[targetLanguage]);
        newChoices.sort(() => Math.random() - 0.5);
        return newChoices;
    };

    const handleAnswer = (answer : string) => {
        setSelectedAnswer(answer);

        if(answer === currentWordPair[targetLanguage]) {


              setTimeout(() => {
                setSelectedAnswer(null);
                setCurrentWordPair(wordPairs[Math.floor(Math.random() * wordPairs.length)]);
              }, 300);
        } else {
            setWrongAnswers((prev) => [...prev, answer])
        } 

    };

    const handleLanguageChange = () => {
        setSelectedLanguage(selectedLanguage === 'Spanish' ? 'English' : 'Spanish');
       
        setSelectedAnswer(null);
      }

    return (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white rounded-lg shadow p-8">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
              onClick={handleLanguageChange}
            >
              Switch to {targetLanguage}
            </button>
            <div className="my-4">
              <p className="text-center font-bold text-lg text-black ">{currentWordPair[selectedLanguage]}</p>
            </div>
            <div>
              {choices.map((choice, index) => (
                <button
                  key={index}
                  className={`block w-full text-left px-4 py-2 my-1 rounded dark:bg-gray${
                    wrongAnswers.includes(choice)
                        ? 'bg-custom-red dark:bg-custom-red' // applies on both light and dark mode
                        : selectedAnswer === choice
                        ? 'bg-custom-green dark:bg-custom-green' // applies on both light and dark mode
                        : 'bg-white'
                  } border-2 border-gray-200 hover:border-gray-100 text-black dark:text-white`}
                  onClick={() => handleAnswer(choice)}
                
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    export default TranslationQuiz;