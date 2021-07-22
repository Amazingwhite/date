import React from 'react';

export let UserInfo = (props) => {
    let {days = 0, hours, minutes, months = 0, years = 0} = props.untilEvent
    return( 
    <>
        
        <h1>
            {props.age>0 && `Возраст пользователя: ${props.age} years`}
            {props.age<=0 && `Введена некорректная дата рождения - возраст должен превышать 1 год`}
        </h1>
        <h1>
            {props.beforeAfter && `До события "${props.eventName}" осталось: ${years} years, ${months} months, ${days} days, ${hours} hours: ${minutes} minutes`} 
            {!props.beforeAfter && `После события "${props.eventName}" прошло: ${years} years, ${months} months, ${days} days, ${hours} hours: ${minutes} minutes`} 
        </h1>
    </>
    )
}