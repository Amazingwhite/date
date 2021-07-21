import React from 'react';

let UserInfo = (props) => {
    return( 
    <>

        <h1>Возраст пользователя: {props.age} years</h1>
        <h1>
            {props.beforeAfter && `До события ${props.untilEvent[0]} years, ${props.untilEvent[1]} months, ${props.untilEvent[2]} days, ${props.untilEvent[3]} hours: ${props.untilEvent[4]} minutes`} 
            {!props.beforeAfter && `После события прошло ${-props.untilEvent[0]} years, ${-props.untilEvent[1]} months, ${-props.untilEvent[2]} days, ${-props.untilEvent[3]} hours: ${-props.untilEvent[4]} minutes`} 
        </h1>
    </>
    )
}

export default UserInfo;