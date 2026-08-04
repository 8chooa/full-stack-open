import { useState } from 'react'

const Title = ({ text }) => <h2>{text}</h2>

const Button = ({ handleClick, text}) => <button onClick={handleClick} >{text}</button>

const Result = ({ text, value }) => <p>{text} {value}</p>
const App = () => {
	const [ good, setGood ] = useState(0)
	const [ neutral, setNeutral ] = useState(0)
	const [ bad, setBad ] = useState(0)

	const handleGoodClick = () => setGood(good + 1)
	const handleNeutralClick = () => setNeutral(neutral + 1)
	const handleBadClick = () => setBad(bad + 1)

	const total = good + neutral + bad
	return (
		<div>
			<Title text='give feedback' />
			<Button handleClick={handleGoodClick} text='good' />
			<Button handleClick={handleNeutralClick} text='neutral' />
			<Button handleClick={handleBadClick} text='bad' />
			<Title text='statistics' /> 
			<Result text='good' value={good} />
			<Result text='neutral' value={neutral} />
			<Result text='bad' value={bad} />
			<Result text='all' value={total} />
			<Result text='average' value={(((good * 1) + (neutral * 0) + (bad * -1)) / (total || 1)) + "%"} />
			<Result text='positive' value={(good / (total || 1)) + '%'} />
		</div>
	)
}

export default App