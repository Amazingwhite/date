import React from "react";
import { Form } from "./components/Form";
import { Route } from "react-router";
import {Calculator}  from "./components/Calculator";
import { Redirect } from "react-router-dom";

export default function App() {
  return(
    <>
      <Route path='/date' component={Form} />
      <Route path='/calculator' component={Calculator} />
      <Redirect from='/' to='/date' />
    </>
  )
  
}