import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UserInfo from "./components/UserInfo";
import { ErrorMessage } from "@hookform/error-message";
import { getMinutes, getHours, getDate, getMonth, getYear, yearsToMonths, isAfter, isEqual, set, differenceInMonths, differenceInDays, differenceInYears, getDaysInYear, getDaysInMonth, monthsToYears, addYears, differenceInMinutes, differenceInHours, minutesToHours, setMonth, } from 'date-fns'
import ru from "date-fns/locale/ru"
import './App.css'

export default function App() {
  let [isSubmited, setIsSubmited] = useState(false);
  let [age, setAge] = useState(0);
  let [untilEvent, setUntilEvent] = useState([]);
  let [beforeAfter, setBeforeAfter] = useState(true)
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ criteriaMode: "all" });

  const diffDates = (d1, d2) => Math.floor((d1 - d2) / (365.25 * 24 * 60 * 60 * 1000));

  const timeCounter = (date1, date2) => {
    let firstDate = new Date(date1)
    let secondDate = new Date(date2)
    
    let diffInMinutes = differenceInMinutes(secondDate, firstDate)
    let diffInHours = differenceInHours(secondDate, firstDate)
    let minutes = diffInMinutes - diffInHours*60
    let hours = minutesToHours(diffInMinutes)
    let days = 0
    let months = 0
    let years = 0

    while( hours>23) {
      days++
      hours -=24
    }
    while(days >= getDaysInMonth(new Date(getYear(secondDate) ,getMonth(secondDate) - 1))){ 
      secondDate = setMonth(secondDate, getMonth(secondDate)-1)
      months++
      days -= getDaysInMonth(new Date(secondDate))
    }
    while(months >=12) {
      years++
      months -=12
    }
    setUntilEvent([years, months, days, hours, minutes])
  }

  const onSubmit = (data) => {
    let userAge = diffDates(new Date(data.currentDate), new Date(data.birthDate))
    let currentDate = set(new Date(data.currentDate), {hours: getHours(new Date()), minutes:  getMinutes(new Date())})
    let valuableEvent = new Date(data.valuableEvent)
    timeCounter(currentDate, valuableEvent)
    if (userAge > 0 && userAge < 130) {
      setAge(userAge)
      setIsSubmited(true)
    } 
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
        <input type='datetime-local' {...register("valuableEvent", {
          maxLength: {
            value: 16,
            message: 'Max year is 9999'
          },
          required: "This input is required."
        })} />
        <ErrorMessage
          errors={errors}
          name="valuableEvent"
          render={({ messages }) => {
            return messages
              ? Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))
              : null;
          }}
        />
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
      {isSubmited && <UserInfo age={age} untilEvent={untilEvent} beforeAfter={beforeAfter} />}
    </>
  );
}