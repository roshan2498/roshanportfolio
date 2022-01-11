import React, { useEffect } from 'react'

export default function Resume() {
    useEffect(() => {
        window.location.href = "https://drive.google.com/file/d/1Bo0HIAjQHjrtXipnErMIoWDEwxIJQ-sx/view?usp=sharing"
    }, [])
    return (
        <div className='container my-5'>
            <h3>Redirecting to Resume....</h3>
        </div>
    )
}
