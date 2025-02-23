import React, { useEffect } from 'react';


const TFTemplate = ({question}) => {

    useEffect(() => {
        if(question){
            console.log(question);
        }
    }, [question]);

    return (
        <div>
            <h1>{question.questionText}</h1>
        </div>
    );
};

export default TFTemplate;