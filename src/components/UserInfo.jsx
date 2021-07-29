import React from 'react';

export let UserInfo = (props) => {
    let {age, untilEvent} = props
    return( 
    <>
        <h1 className='eventHeader'>{age > 0 ? `Возраст пользователя: ${age} years` : `Введена некорректная дата рождения - возраст должен превышать 1 год`}</h1>
        {untilEvent.map((i, index) => {
            let {years = 0, months = 0, days = 0, hours, minutes, eventName, beforeAfter} = i
            return (
                <h1 className='eventHeader' key={index}>
                    {`${beforeAfter 
                    ? `До события "${eventName}" осталось: ` 
                    : `После события "${eventName}" прошло: `}
                    ${years} years, ${months} months, ${days} days, ${hours} hours: ${minutes} minutes`}
                </h1>
            )
        })}
    </>
    )
}