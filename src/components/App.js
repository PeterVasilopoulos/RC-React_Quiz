import {useEffect, useReducer} from 'react'
import Header from './Header'
import Main from './Main'
import Loader from './Loader'
import Error from './Error'
import StartScreen from './StartScreen'
import Question from './Question'
import NextButton from './NextButton'
import Progress from './Progress'
import FinishScreen from './FinishScreen'

const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0
}

function reducer(state, action) {
  switch(action.type) {
    // if question data is received
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready'
      }

    // if question data was not received
    case 'dataFailed':
      return {
        ...state,
        status: 'error'
      }
    
    // when the user clicks start test button
    case 'start':
      return {
        ...state,
        status: 'active'
      }
    
    // when the user selects a new answer
    case 'newAnswer':
      const question = state.questions.at(state.index)

      return {
        ...state,
        answer: action.payload,
        points: 
          action.payload === question.correctOption 
            ? state.points + question.points
            : state.points
      }
    
    // when user moves to the next question
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null
      }

    // when user finishes the quiz
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore 
      }

    // default case throws error
    default:
      throw new Error("Actions unknown")
  }
}


// App Component
export default function App() {
  const [{questions, status, index, answer, points, highscore}, dispatch] = useReducer(reducer, initialState)

  const numQuestions = questions.length
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points, 0
  )

  useEffect(function() {
    fetch('http://localhost:8000/questions')
      .then(res => res.json())
      .then(data => dispatch({type: 'dataReceived', payload: data}))
      .catch(err => dispatch({type: 'dataFailed'}))
  }, [])

  return (
    <div className='app'>
      <Header />
      
      <Main>
        {status === 'loading' && <Loader />}

        {status === 'error' && <Error />}

        {status === 'ready' && 
          <StartScreen 
            numQuestions={numQuestions} 
            dispatch={dispatch}
          />
        }

        {status === 'active' && 
          <>
            <Progress 
              index={index} 
              numQuestions={numQuestions} 
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />

            <Question 
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <NextButton 
              dispatch={dispatch} 
              answer={answer} 
              index={index}
              numQuestions={numQuestions}
            />
          </>
        }

        {status === 'finished' && 
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
          />
        }
      </Main>
    </div>
  )
}