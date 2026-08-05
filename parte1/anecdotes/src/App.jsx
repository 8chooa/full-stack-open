import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Title = ({ text }) => <h2>{text}</h2>

const MostVotes = ({ anecdotes, votes }) => {
    let mayor = votes[0]
    let posicion = 0
    for(let i = 0; i < votes.length; i++) {
        if(mayor < votes[i]) {
            mayor = votes[i]
            posicion = i
        }
    }
    if(mayor === 0) {
        return (<p>no votes yet</p>)
    } else {
        return<p>{anecdotes[posicion]}</p>
    }
    

}

const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]
    const [ selected, setSelected ] = useState(0)
    const [ votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
    
    const copia = [...votes]

    const handleClick = () => {
        const num = Math.floor(Math.random() * anecdotes.length)
        setSelected(num)
    }

    const handleVoteClick = () => {
        copia[selected] += 1
        setVotes(copia)
        console.log(copia)
    }

    return (
        <div>
            <Title text={'Anecdote of the day'} />
            <p>{anecdotes[selected]}</p>
            <p>{'has ' + votes[selected] + ' votes'}</p>
            <Button handleClick={handleVoteClick} text='vote' />
            <Button handleClick={handleClick} text='next anecdote'/>
            <Title text={'Anecdote with most votes'} />
            <MostVotes anecdotes={anecdotes} votes={votes}/>
        </div>
    )
}

export default App