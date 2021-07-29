import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { UserInfo } from "./UserInfo";
import { ErrorMessage } from "@hookform/error-message";
import moment from 'moment';
import { Link } from "react-router-dom";
import '../styles/FormStyle.css'

export const Form = (props) => {
    let allDiffs = []
    let [isSubmited, setIsSubmited] = useState(false);
    let [age, setAge] = useState(0);
    let [untilEvent, setUntilEvent] = useState([]);
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm({
      criteriaMode: "all",
      defaultValues: {
        events: [{ eventName: "some name", eventDate: "", eventTime: "" }]
      }
    });
    const { fields, append } = useFieldArray({control, name: "events"});
    const timeCounter = (date1, date2) => {
      if (moment(date1) > moment(date2)) {
        const diffDate = moment.duration(moment(date1).diff(moment(date2))).add(1, 'minutes')
        allDiffs.push({ beforeAfter: false, years: diffDate.years(), months: diffDate.months(), days: diffDate.days(), hours: diffDate.hours(), minutes: diffDate.minutes() })
      } else {
        const diffDate = moment.duration(moment(date2).diff(moment(date1)))
        allDiffs.push({ beforeAfter: true, years: diffDate.years(), months: diffDate.months(), days: diffDate.days(), hours: diffDate.hours(), minutes: diffDate.minutes() })
      }
    }
    const onSubmit = (data) => {
      let currentDate = moment(data.currentDate).set({ hour: moment().get('hour'), minute: moment().get('minute') })
      data.events.forEach((i) => {
        let valuableEvent = moment().set({
          year: moment(i.eventDate).get('year'),
          month: moment(i.eventDate).get('month'),
          date: moment(i.eventDate).get('date'),
          hour: i.eventTime.split(":")[0],
          minute: i.eventTime.split(":")[1]
        })
        timeCounter(currentDate, valuableEvent)
        allDiffs[allDiffs.length-1].eventName = i.eventName;
      })
      setAge(moment(data.currentDate).diff(data.birthDate, 'year')) 
      setUntilEvent(allDiffs)
      setIsSubmited(true)
    }
    return (
      <>
        <form className='inputForm' onSubmit={handleSubmit(onSubmit)}>
          <label className='inputHeader' htmlFor='birthDate'>Birth date</label>
          <input className='formInput' type='date' {...register("birthDate", {
            maxLength: {
              value: 10,
              message: 'Max year is 9999'
            },
            required: "This input is required."
          })} />
          <ErrorMessage
            errors={errors}
            name="birthDate"
            render={({ messages }) => {
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                  <p className='errorText' key={type}>{message}</p>
                )) : null;
            }}/>
          <label className='inputHeader' htmlFor='currentDate'>Current date</label>
          <input className='formInput' type='date' {...register("currentDate", {
            maxLength: {
              value: 10,
              message: 'Max year is 9999'
            },
            required: "This input is required."
          })} />
          <ErrorMessage
            errors={errors}
            name="currentDate"
            render={({ messages }) => {
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                  <p className='errorText' key={type}>{message}</p>
                )) : null;
            }}/>
          <label className='inputHeader' htmlFor='valuableEvent'>Events</label>
          {fields.map((item, index) => {
            return (
              <li className='valuableEvent' key={item.id}>
                <input
                  className='formInput'
                  {...register(`events.${index}.eventName`)}
                  type='text'
                  name={`events[${index}].eventName`}
                  defaultValue={`${item.eventName}`}/>
                <input
                  className='formInput'
                  {...register(`events.${index}.eventDate`)}
                  type='date'
                  name={`events[${index}].eventDate`}
                  defaultValue={`${item.eventDate}`}/>
                <input
                  className='formInput'
                  {...register(`events.${index}.eventTime`)}
                  type='time'
                  name={`events[${index}].eventTime`}
                  defaultValue={`${item.eventTime}`}/>
              </li>
            );
          })}
          <button
            className='formButton'
            type="button"
            onClick={() => {
              append({ eventName: "appendEventName", eventDate: "", eventTime: "" });
            }}>
            Add Event
          </button>
          <input className='formInput' type="submit" />
          <input
            className='formInput'
            type="button"
            onClick={() =>
              reset({
                birthDate: "",
                currentDate: "",
                valuableEvent: "",
                events: [{eventName: "some name", eventDate: "", eventTime: ""}]
              })}
            value="Reset inputs"/>
            <Link to="/calculator">
            <input 
              className='formInput'
              type="button"
              value="Залезть в долги" />
            </Link>
        </form>
        
        {isSubmited && <UserInfo age={age} untilEvent={untilEvent} />}
      </>
    );
}