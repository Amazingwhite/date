import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UserInfo from "./components/UserInfo";
import { ErrorMessage } from "@hookform/error-message";
import { getMinutes, getHours, getMonth, getYear, isAfter, set, getDaysInMonth, differenceInMinutes, differenceInHours, minutesToHours, setMonth, getDate} from 'date-fns'
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
    let firstDate = new Date(date1)
    let secondDate = new Date(date2)
    let diffInMinutes = differenceInMinutes(secondDate, firstDate)
    let diffInHours = differenceInHours(secondDate, firstDate)
    let minutes = diffInMinutes - diffInHours * 60
    let hours = minutesToHours(diffInMinutes)
    let days = 0
    let months = 0
    let years = 0

    if (isAfter(firstDate, secondDate)) {
      let temp
      temp = firstDate
      firstDate = secondDate
      secondDate = temp
      diffInMinutes = differenceInMinutes(secondDate, firstDate)
      diffInHours = differenceInHours(secondDate, firstDate)
      minutes = diffInMinutes - diffInHours * 60
      hours = minutesToHours(diffInMinutes)
      while (hours > 23) {
        days++
        hours -= 24
      }
      while (days >= getDaysInMonth(new Date(getYear(firstDate), getMonth(firstDate) + 1))) {
        firstDate = setMonth(firstDate, getMonth(firstDate) + 1)
        months++
        days -= getDaysInMonth(new Date(firstDate))
      }
      while (months >= 12) {
        years++
        months -= 12
      }
      setBeforeAfter(false)
    } else {
      while (hours > 23) {
        days++
        hours -= 24
      }
      while (days >= getDaysInMonth(new Date(getYear(secondDate), getMonth(secondDate) - 1))) {
        secondDate = setMonth(secondDate, getMonth(secondDate) - 1)
        months++
        days -= getDaysInMonth(new Date(secondDate))
      }
      while (months >= 12) {
        years++
        months -= 12
      }
      setBeforeAfter(true)
    }
    setUntilEvent([years, months, days, hours, minutes])
  }

  const onSubmit = (data) => {
    let userAge = diffDates(new Date(data.currentDate), new Date(data.birthDate))
    let currentDate = set(new Date(data.currentDate), { hours: getHours(new Date()), minutes: getMinutes(new Date()) })
    let valuableEvent = set(new Date(), {year: getYear(new Date(data.valuableEventDate)), month: getMonth(new Date(data.valuableEventDate)), date: getDate(new Date(data.valuableEventDate)),
                                         hours: data.valuableEventTime.split(":")[0], minutes: data.valuableEventTime.split(":")[1]})
    timeCounter(currentDate, valuableEvent)
    if (userAge > 0 && userAge < 130) {
      setAge(userAge)
      setIsSubmited(true)
    }
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
              ))
              : null;
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
              ))
              : null;
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
                {required: "This input is required."})} type='text'/>
          <input {...register("valuableEventDate", 
                {required: "This input is required."})} type='date'/>
          <input {...register("valuableEventTime", 
                {required: "This input is required."})} type='time'/>
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
      {isSubmited && <UserInfo age={age} untilEvent={untilEvent} beforeAfter={beforeAfter} eventName={eventName}/>}
    </>
  );
}