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
            if(i.beforeAfter) {
                return(
                    <h1>{`До события "${i.eventName}" осталось: ${i.years} years, ${i.months} months, ${i.days} days, ${i.hours} hours: ${i.minutes} minutes`}</h1>
                )
            } else {
                return(
                    <h1>{`После события "${i.eventName}" прошло: ${i.years} years, ${i.months} months, ${i.days} days, ${i.hours} hours: ${i.minutes} minutes`}</h1>
                )
            }
        })}
    </>
    )
}