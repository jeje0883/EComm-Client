import { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import CourseSearch from './CourseSearch';

export default function UserView({coursesData}) {

    const [courses, setCourses] = useState([])

    useEffect(() => {
        console.log(coursesData);

        const coursesArr = coursesData.map(course => {
            //only render the active courses
            if(course.isActive === true) {
                return (
                    <CourseCard courseProp={course} key={course._id}/>
                    )
            } else {
                return null;
            }
        })

        setCourses(coursesArr)

    }, [coursesData])

    return(
        <>
            <CourseSearch />
            { courses }
        </>
        )
}