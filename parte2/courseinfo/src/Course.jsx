const Header = (props) => <h2>{props.name}</h2>

const Content = (props) => {
    console.log(props)
    return (
        <div>
            {props.parts.map((part) => <Part key={part.id} part={part}/>)}
        </div>
    )
}

const Part = (props) => (
    <p>
        {props.part.name} {props.part.exercises}
    </p>
)

const Total = (props) => {
    const total = props.parts.reduce((acumulado, actual) => acumulado + actual.exercises, 0)
    return (
        <strong>total of {total} exercises</strong>
    )
}

const Course = (props) => {
    return (
        <div>
            <Header name={props.course.name} />
            <Content parts={props.course.parts}/>
            <Total parts={props.course.parts}/>
        </div>
    )
}

export default Course