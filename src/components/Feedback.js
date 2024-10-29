import {useState, useEffect} from "react";
import { Form, Button } from 'react-bootstrap';

export default function Feedback () {

	
	const [user, setUser] = useState(localStorage.getItem('token'));



	const [email, setEmail] = useState("");
	const [feedback, setFeedback] = useState("");
	const [isActive, setIsActive] = useState(false);


	useEffect(() => {
    	if (email !== "" && feedback !== "" ) {

    		setIsActive(true);
    	} else {

    		setIsActive(false);
    	}
    }, [email, feedback])

    function sendFeedback (e) {

    	e.preventDefault();

    	alert("Thank you for your feedback. We'll get back to you as soon as we can.");

    	setEmail("");
    	setFeedback("");
    }

    return (
		<>
		{ (user !== null) ?
    	<Form onSubmit={(e) => sendFeedback (e)}>
    		<h1 className="my-5 text-center">Feedback</h1>
	      	<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
	        	<Form.Label>Email Address</Form.Label>
	        	<Form.Control 
		        	type="email" 
		        	placeholder="name@example.com"
		        	required
		        	value={email}
		        	onChange={e => {setEmail(e.target.value)}} 
		        />
	      	</Form.Group>
	      	<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
	        	<Form.Label>Feedback</Form.Label>
		        <Form.Control 
		        	as="textarea" 
		        	rows={5} 
		        	placeholder="Enter feedback"
		        	required
		        	value={feedback} 
		        	onChange={e => {setFeedback(e.target.value)}}
		        />
	      	</Form.Group>
	      	{isActive ?
            	<Button variant="primary" type="submit" id="submitFeedbackBtn">Submit</Button>
            	:
            	<Button variant="danger" type="submit" id="submitFeedbackBtn" disabled>Submit</Button>
        	}
	    </Form>
		:
		<div></div>
		}
		</>
    )
}