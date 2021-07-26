import React from 'react';

export let UserInfo = (props) => {
    let {age, untilEvent} = props
    return( 
    <>
        <h1>
            {age>0 && `Возраст пользователя: ${age} years`}
            {age<=0 && `Введена некорректная дата рождения - возраст должен превышать 1 год`}
        </h1>
        {untilEvent.map(i => {
            let {years = 0, months = 0, days = 0, hours, minutes, eventName, beforeAfter} = i
            if(beforeAfter) {
                return <h1 >{`До события "${eventName}" осталось: ${years} years, ${months} months, ${days} days, ${hours} hours: ${minutes} minutes`}</h1>
            } else {
                return <h1>{`После события "${eventName}" прошло: ${years} years, ${months} months, ${days} days, ${hours} hours: ${minutes} minutes`}</h1>
            }
        })}
    </>
    )
}