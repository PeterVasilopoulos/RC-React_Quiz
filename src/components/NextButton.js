function NextButton({dispatch, answer, index, numQuestions}) {
    // early return if no answer has been selected
    if(answer === null) {
        return
    }

    // only display button if user is on any question before the last one
    if(index < numQuestions - 1)
    return (
        <button 
            className="btn btn-ui"
            onClick={() => dispatch({type: 'nextQuestion'})}
        >
            Next
        </button>
    )

    // if user is on last question
    if(index === numQuestions - 1)
    return (
        <button 
            className="btn btn-ui"
            onClick={() => dispatch({type: 'finish'})}
        >
            Finish
        </button>
    )
}

export default NextButton
