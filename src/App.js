import React, { useState } from "react";
import { useForm } from "react-hook-form";
import UserInfo from "./components/UserInfo";
import { ErrorMessage } from "@hookform/error-message";
import { getMinutes, getHours, getDate, getMonth, getYear, yearsToMonths, setHours, isAfter, setMinutes, isEqual } from 'date-fns'
import './App.css'

export default function App() {
  let [isSubmited, setIsSubmited] = useState(false);
  let [age, setAge] = useState(0);
  let [untilEvent, setUntilEvent] = useState([]);
  let [beforeAfter, setBeforeAfter] = useState(true)
  const { register, formState: { errors }, handleSubmit, reset } = useForm({ criteriaMode: "all" });

  const diffDates = (d1, d2) => Math.floor((d1 - d2) / (365.25 * 24 * 60 * 60 * 1000));
  const countYears = (d1, d2) => (yearsToMonths(getYear(d1)) + (getMonth(d1) + 1) - (yearsToMonths(getYear(d2)) + (getMonth(d2) + 1))) / 12

  const timeCounter = (date1, date2) => {
    date1 = new Date(date1);
    date2 = setHours(new Date(date2), getHours(new Date()))
    date2 = setMinutes(new Date(date2), getMinutes(new Date()))
    let time = [];
    let years = !isAfter(date1, date2) ? Math.ceil(countYears(date1, date2)) : Math.floor(countYears(date1, date2))
    let months = (getMonth(date1) + 1) - (getMonth(date2) + 1)
    let days = getDate(date1) - getDate(date2)
    let hours = getHours(date1) - getHours(new Date())
    let minutes = getMinutes(date1) - getMinutes(new Date())
    setBeforeAfter(date1 >= date2)

    if (isAfter(date1, date2) || isEqual(date1, date2)) {
      if (months < 0 ) months = 12 + months
      if (days < 0) {
        days = 32 - new Date(2021, getMonth(date1) - 1, 32).getDate() + days;
        months =  months - 1 
        if (months <= 0 && years !==0) {
          years -= 1 
          months =  11 
        }
      }
      if( hours < 0) {
        days = days - 1
        hours = 24 + hours
        if( days < 0) {
          months -= 1
          days = 32 - new Date(2021, getMonth(date1) - 1, 32).getDate() + days
        }
        if(months < 0) {
          years -= 1
          months = 12 + months
        }
      }
      if (minutes < 0) {
        hours = hours - 1
        minutes = 60 + minutes
        if( hours < 0) {
          days -= 1
          hours = 24 + hours
          if( days < 0) {
            months -= 1
            days = 32 - new Date(2021, getMonth(date1) - 1, 32).getDate() + days
          }
          if(months < 0) {
            years -= 1
            months = 12 + months
          }
        }
      }
    } else if (!isAfter(date1, date2)) {
      if (months > 0) months = months - 12
      if (days > 0) {
        days = days - (32 - new Date(2021, getMonth(date2) - 1, 32).getDate())
        months += 1 
        if (months >= 0 && years !==0) {
          years += 1 
          months = months - 12 
        }
      }
      if( hours > 0) {
        days += 1
        hours = hours - 24
        if( days > 0) {
          months += 1
          days = -(32 - new Date(2021, getMonth(date1) - 1, 32).getDate() - days)
        }
        if(months > 0) {
          years += 1
          months -= 12
        }
      }
      if (minutes > 0) {
        hours = hours + 1
        minutes = minutes - 60
        if( hours > 0) {
          days += 1
          hours -= 24
          if( days > 0) {
            months = months + 1
            days = -(32 - new Date(2021, getMonth(date1) - 1, 32).getDate() - days)
          }
          if(months > 0) {
            years += 1
            months -= 12
          }
        }
      }
    }
    time.push({ years: years })
    time.push({ months: months })
    time.push({ days: days })
    time.push({ hours: hours })
    time.push({ minutes: minutes })
    setUntilEvent(time)
  }
  const onSubmit = (data) => {
    let userAge = diffDates(new Date(data.currentDate), new Date(data.birthDate))
    timeCounter(data.valuableEvent, data.currentDate)
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