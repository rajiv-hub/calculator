import { ACTIONS } from "./App";

import React from 'react'

function DigitButton({digit, dispatch}) {
    return (
        <button 
        onClick={()=> dispatch({ type: ACTIONS.ADD_DIGIT, payload: {digit} })}>
            {digit}
        </button>
    )
}

export default DigitButton
