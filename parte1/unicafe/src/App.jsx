import { useState } from 'react'

const Title = ({ text }) => <h2>{text}</h2>

const Button = ({ handleClick, text}) => <button onClick={handleClick} >{text}</button>

const Result = ({ text, value }) => {
    return(
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

const Statistics = ({ good, neutral, bad }) => {
    const total = good + neutral + bad
    if(total == 0) {
        return (<div>No feedback given</div>)
    } else {
        const average = ((good * 1) + (neutral * 0) + (bad * -1)) / (total)
        const positive = (good / total) * 100
        return (
            <div>
                <table>
                    <tbody>
                        <Result text='good' value={good} />
                        <Result text='neutral' value={neutral} />
                        <Result text='bad' value={bad} />
                        <Result text='all' value={total} />
                        <Result text='average' value={average} />
                        <Result text='positive' value={positive + '%'} />
                    </tbody>
                </table>
            </div>
        )
    }
}

const App = () => {
    const [ good, setGood ] = useState(0)
    const [ neutral, setNeutral ] = useState(0)
    const [ bad, setBad ] = useState(0)

    const handleGoodClick = () => setGood(good + 1)
    const handleNeutralClick = () => setNeutral(neutral + 1)
    const handleBadClick = () => setBad(bad + 1)

    return (
        <div>
            <Title text='give feedback' />
            <Button handleClick={handleGoodClick} text='good' />
            <Button handleClick={handleNeutralClick} text='neutral' />
            <Button handleClick={handleBadClick} text='bad' />
            <Title text='statistics' /> 
            <Statistics good={good} neutral={neutral} bad={bad}/>
        </div>
    )
}

export default App