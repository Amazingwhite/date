import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { UserInfo } from "./components/UserInfo";
import { ErrorMessage } from "@hookform/error-message";
import { getMinutes, getHours, getMonth, getYear, isAfter, set, differenceInMinutes, differenceInHours,  getDate, addMinutes } from 'date-fns'
import './App.css'

export default function App() {
  let [isSubmited, setIsSubmited] = useState(false);
  let [age, setAge] = useState(0);
  let [untilEvent, setUntilEvent] = useState([]);
  let [beforeAfter, setBeforeAfter] = useState(true)
  let [eventName, setEventName] = useState('')
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ criteriaMode: "all" });
  const diffDates = (d1, d2) => Math.floor((d1 - d2) / (365.25 * 24 * 60 * 60 * 1000));

  const timeCounter = (date1, date2) => {
    let firstDate = new Date(date1);
    let secondDate = new Date(date2);
    if (isAfter(firstDate, secondDate)) {
        let diff = set(new Date(), 
          {year: getYear(firstDate) - getYear(secondDate), month: getMonth(firstDate) - getMonth(secondDate),
          date: getDate(firstDate) - getDate(secondDate), hours: getHours(firstDate) - getHours(secondDate),
          minutes: getMinutes(firstDate) - getMinutes(secondDate)})

        differenceInMinutes(firstDate, secondDate) < 1439 
        ? setUntilEvent({hours: getHours(diff), minutes: getMinutes(diff)})
        : setUntilEvent({years: getYear(diff),months: getMonth(diff),days: getDate(diff),hours: getHours(diff),minutes: getMinutes(diff)})
        setBeforeAfter(false)
    } else {
        let diff = set(new Date(), 
          {year: getYear(secondDate) - getYear(firstDate), month: getMonth(secondDate) - getMonth(firstDate),
          date: (getDate(secondDate) - getDate(firstDate)), hours: getHours(secondDate) - getHours(firstDate),
          minutes: getMinutes(secondDate) - getMinutes(firstDate)})

        differenceInMinutes(secondDate, firstDate) < 1439
        ? setUntilEvent({hours: getHours(diff), minutes: getMinutes(diff)})
        : setUntilEvent({years: getYear(diff),months: getMonth(diff),days: getDate(diff),hours: getHours(diff),minutes: getMinutes(diff)})
        setBeforeAfter(true)
    }
  }
  const onSubmit = (data) => {
    let currentDate = set(new Date(data.currentDate), { hours: getHours(new Date()), minutes: getMinutes(new Date()) })
    let valuableEvent = set(new Date(), {
      year: getYear(new Date(data.valuableEventDate)), month: getMonth(new Date(data.valuableEventDate)), date: getDate(new Date(data.valuableEventDate)),
      hours: data.valuableEventTime.split(":")[0], minutes: data.valuableEventTime.split(":")[1]
    })
    timeCounter(currentDate, valuableEvent)
    setAge(diffDates(new Date(data.currentDate), new Date(data.birthDate)))
    setIsSubmited(true)
    setEventName(data.valuableEventName)
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='birthDate'>Birth date</label>
        <input type='date' {...register("birthDate", {
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
                <p key={type}>{message}</p>
              )) : null;
          }}
        />
        <label htmlFor='currentDate'>Current date</label>
        <input type='date' {...register("currentDate", {
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
                <p key={type}>{message}</p>
              )) : null;
          }}
        />
        <label htmlFor='valuableEvent'>Event</label>
        <div className='valuableEvent'>
          <span>Название</span>
          <span>Дата</span>
          <span>Время</span>
        </div>
        <div className='valuableEvent'>
          <input {...register("valuableEventName",
            { required: "This input is required." })} type='text' />
          <input {...register("valuableEventDate",
            { required: "This input is required." })} type='date' />
          <input {...register("valuableEventTime",
            { required: "This input is required." })} type='time' />
        </div>

        <input type="submit" />
        <input
          type="button"
          onClick={() =>
            reset({
              birthDate: "",
              currentDate: "",
              valuableEvent: "",
            })
          }
          value="Reset inputs"
        />
      </form>
      {isSubmited && <UserInfo age={age} untilEvent={untilEvent} beforeAfter={beforeAfter} eventName={eventName} />}
    </>
  );
}