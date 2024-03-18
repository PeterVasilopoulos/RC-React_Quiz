function NextButton({dispatch, answer}) {
    // early return if no answer has been selected
    if(answer === null) {
        return
    }

    return (
        <button 
            className="btn btn-ui"
            onClick={() => dispatch({type: 'nextQuestion'})}
        >
            Next
        </button>
    )
}

export default NextButton
