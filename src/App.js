import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { UserInfo } from "./components/UserInfo";
import { ErrorMessage } from "@hookform/error-message";
import moment from 'moment';
import './App.css'

export default function App() {
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
  const diffDates = (d1, d2) => Math.floor((d1 - d2) / (365.25 * 24 * 60 * 60 * 1000));
  const { fields, append } = useFieldArray({control, name: "events"});
  const timeCounter = (date1, date2) => {

    let firstDate = moment(date1)
    let secondDate = moment(date2)
    if (firstDate > secondDate) {
      // let diffDate = moment().set({
      //   year: firstDate.get('year') - secondDate.get('year'),
      //   month: firstDate.get('month') - secondDate.get('month'),
      //   date: firstDate.get('date') - secondDate.get('date'),
      //   hour: firstDate.get('hour') - secondDate.get('hour'),
      //   minute: firstDate.get('minute') - secondDate.get('minute')
      // })
      const diffDate = moment(moment(firstDate).diff(secondDate));
      // https://momentjs.com/docs/#/displaying/
      firstDate.diff(secondDate, 'minute') < 1440 // Вот эту историю можно хранить как-то иначе) 
      // Собственно можно вообще сразу собрать строку и ее сюда пушить
      // Чтобы не раскидывать сначала по часам, дням и т.д., а потом обратно не собирать
      ? allDiffs.push({beforeAfter: false, hours: diffDate.get('hour'), minutes: diffDate.get('minute') })
      : allDiffs.push({beforeAfter: false, years: diffDate.get('year'), months: diffDate.get('month'), days: diffDate.get('date'), hours: diffDate.get('hour'), minutes: diffDate.get('minute') })
    } else {
      // let diffDate = moment().set({
      //   year: secondDate.get('year') - firstDate.get('year'),
      //   month: secondDate.get('month') - firstDate.get('month'),
      //   date: secondDate.get('date') - firstDate.get('date'),
      //   hour: secondDate.get('hour') - firstDate.get('hour'),
      //   minute: secondDate.get('minute') - firstDate.get('minute'),
      // })
      const diffDate = moment(moment(firstDate).diff(secondDate));
      secondDate.diff(firstDate, 'minute') < 1440
        ? allDiffs.push({beforeAfter: true, hours: diffDate.get('hour'), minutes: diffDate.get('minute') })
        : allDiffs.push({beforeAfter: true, years: diffDate.get('year'), months: diffDate.get('month'), days: diffDate.get('date'), hours: diffDate.get('hour'), minutes: diffDate.get('minute') })
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
    setAge(diffDates(new Date(data.currentDate), new Date(data.birthDate))) // здесь можно было бы использовать метод .diff() 
    setUntilEvent(allDiffs)
    setIsSubmited(true)
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
        <label htmlFor='valuableEvent'>Events</label>
        {fields.map((item, index) => {
          return (
            <li className='valuableEvent' key={item.id}>
              <input
                {...register(`events.${index}.eventName`)}
                type='text'
                name={`events[${index}].eventName`}
                defaultValue={`${item.eventName}`}
              />
              <input
                {...register(`events.${index}.eventDate`)}
                type='date'
                name={`events[${index}].eventDate`}
                defaultValue={`${item.eventDate}`}
              />
              <input
                {...register(`events.${index}.eventTime`)}
                type='time'
                name={`events[${index}].eventTime`}
                defaultValue={`${item.eventTime}`}
              />
            </li>
          );
        })}
        <button
          type="button"
          onClick={() => {
            append({ eventName: "appendEventName", eventDate: "", eventTime: "" });
          }}>
          Add Event
        </button>
        <input type="submit" />
        <input
          type="button"
          onClick={() =>
            reset({
              birthDate: "",
              currentDate: "",
              valuableEvent: "",
              events: [{eventName: "some name", eventDate: "", eventTime: ""}]
              
            })}
          value="Reset inputs"
        />
      </form>
      {isSubmited && <UserInfo age={age} untilEvent={untilEvent} />}
    </>
  );
}