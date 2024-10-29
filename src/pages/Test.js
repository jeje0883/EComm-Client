import { useState } from 'react';

export default function Test() {

    const [ num , setNum ] = useState(0);  

    let x = 1;

    function add() {
        setNum( num + 1)
        console.log(x); // Log the updated value of x
    }

    return (
        <div>
            <h1>Test Page</h1>
            <p>This is a test page.</p>
            <button onClick={add}>Add</button> {/* Pass the function reference */}
            <p>x: {num}</p> {/* This will not update the UI since x is not state */}
        </div>       
    );
}
