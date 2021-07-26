import React from 'react';

export let UserInfo = (props) => {
    // console.log(props);
    let {age, beforeAfter, eventName, untilEvent: {days = 0, hours, minutes, months = 0, years = 0}} = props
    return( 
    <>
        <h1>
            {age>0 && `Возраст пользователя: ${age} years`}
            {age<=0 && `Введена некорректная дата рождения - возраст должен превышать 1 год`}
        </h1>
        <h1>
            {beforeAfter && `До события "${eventName}" осталось: ${years} years, ${months} months, ${days} days, ${hours} hours: ${minutes} minutes`} 
            {!beforeAfter && `После события "${eventName}" прошло: ${years} years, ${months} months, ${days} days, ${hours} hours: ${minutes} minutes`} 
        </h1>
    </>
    )
}