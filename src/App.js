import './styles.css';
import {useReducer} from 'react';
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}){
  console.log(state, 'stateee')
  switch(type){
    case ACTIONS.ADD_DIGIT : 
      if(state.overwrite){
        /*once equal is clicked overwrite the displayed digit with typed digit*/
        return{
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0"){
        return state;
      }
      if(payload.digit === "." && state.currentOperand.includes('.')){
        return state;
      }
      return {
        ...state,
        currentOperand : `${state.currentOperand || ''}${payload.digit}`
      }

    case ACTIONS.CLEAR :   
      return {}

    case ACTIONS.DELETE_DIGIT:
      /*TODO :  Retain modified currentOperand 
      * Delete used on value ie displayed after the evaluation (=),
       Now the value in currentOperand is a new value and this new value should not be overwritten  */

      /**
       * After Evaluated value (=) : Delete is Clicked then whole currentOperand  should be deleted      */
      if(state.overwrite){
        return{
          ...state,
          overwrite:false,
          currentOperand:null
        }
      }
      /*After Evaluated value (=) : Delete is clicked when there is no currentOperand*/
      if(state.currentOperand == null) return state;
      /*After Evaluated value (=) : Delete is Clicked with some currentOperand */
      if(state.currentOperand.length === 1){
        return {
          ...state,
          currentOperand: null
        }
      }

      /* delete last digit from currentoperand 
      slice(0,-1) removes the last index and returns an new string
      */
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }


    case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && 
          state.previousOperand == null) {
          return state
        }

        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation,
          }
        }

        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }

        return {
          ...state,
          previousOperand: state,
          operation: payload.operation,
          currentOperand: null,
        }

    case ACTIONS.EVALUATE :
        if(state.currentOperand == null || 
          state.previousOperand == null || 
          state.operation == null){
          return state;
        } 

        return {
          ...state,
          overwrite:true,
          currentOperand: evaluate(state.currentOperand, state.previousOperand, state.operation),
          previousOperand: null,
          operation:null
        }
  }
}

function evaluate(currentOperand, previousOperand, operation){
  const currValue = parseFloat(currentOperand);
  const prevValue = parseFloat(previousOperand);
  if(isNaN(currValue) || isNaN(prevValue)){
    return '';
  }
  let value = ''
  switch(operation){
    case "÷" :
        value = prevValue / currValue;
        break;
    case "*" :
        value = prevValue * currValue;
        break;
    case "+" :
        value = prevValue + currValue;
        break;  
    case "-" :
      value = prevValue - currValue;
      break;      
  }
  return value.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-uk", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  /* 
  * const [state, dispatch] = useReducer(reducer, initialState);
  * but we need/hve 3 states currentOperand, previousOperand, operation 
  * */

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand"> {formatOperand(previousOperand)} {operation} </div>
        <div className="current-operand"> {formatOperand(currentOperand)} </div>
      </div>
      <button className="span-two" 
      onClick={ ()=> dispatch({ type:ACTIONS.CLEAR}) }>
        AC</button>
      <button onClick={()=>{
        dispatch({type:ACTIONS.DELETE_DIGIT})
      }}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick= { ()=> {
          dispatch({type:ACTIONS.EVALUATE})  
        }
      }> = </button>
    </div>
  );
}

export default App;
