# Kiva Pricing Tool
An open source web application that outputs APR Nominal rate, Repayment Schedule, and Loan Payment Visualization.
* [Product Requirements Document](https://docs.google.com/document/d/1Rw6Q8YMIpvYFXR3eStdTVT4iZXMpR7En3_yg677VgjE/edit?usp=sharing)

## Setup
**Frontend Instructions**
* npm install
* npm start
* The site will be displayed on: http://localhost:3000 

**Backend Instructions**
* [Docs for Setting up](https://github.com/tko22/flask-boilerplate/blob/master/docs/regular-setup.md)

## Design Resources
* [Figma for Mockups](https://www.figma.com/file/0jmf44vrazZ8C2vkTCwnroMF/Kiva)

## Frontend Resources

**React Router**
* What is React Router
   * Different parts that make up react router that we will probably be using: 
        * Route: IMPORTANT! renders a specific UI when a location matches the route’s path.
        * Link: helps us navigate within our application
        * Router: The common low-level interface for all router components
            * Types of Routers
                * Browser Router
                * Hash Router 
                * Memory Router
                * Native Router
                * Static Router
        * Redirect: used to navigate to new location

* [React Router Docs](https://reacttraining.com/react-router/web/guides/philosophy)

**Redux Resources**
* What is Redux
   * Redux is a tool for managing application state.
* [Basic Intro Video to Redux Components](https://www.youtube.com/watch?v=DiLVAXlVYR0)
* [More on the Different Parts of Redux](https://redux.js.org/#the-gist)
* [When is Redux Useful](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
* [Quick Guide to Redux](https://medium.freecodecamp.org/a-quick-guide-to-redux-for-beginners-971d18c0509b)

**Implementing Visualizations into React**
* What is d3.js?
    * d3 stands for data driven documents and it is a JavaScript Library that enables us to create interactive visualizations by manipulating data-driven documents.
* [A Good Article on D3](https://medium.com/@enjalot/the-hitchhikers-guide-to-d3-js-a8552174733a)
* [React and D3](https://github.com/hshoff/vx)

**Making AJAX requests and using Axios**
* What is an AJAX request?
    * AJAX stands for Asynchronous JavaScript And XML and it enables us to send and get information to the server asynchronously.
* What is axios?
    * Axios is a Javascript library used to make http requests from node.js/XMLHttpRequests from the browser and it supports the Promise API.
* What are promises?
    * Promise are software abstraction used to overcome issues with multiple callbacks and provide better way to manage success and error conditions.
        * This means that there are no more nested callback 
    * The point of promises is to give us back functional composition and error bubbling in the async world
    * Promises have three states:
        * pending: means the async operation is going on.
        * resolved: async operation is completed successfully.
        * rejected: async operation is completed with error.
* [Article on AJAX, Promises and Callbacks](https://medium.com/front-end-hacking/ajax-async-callback-promise-e98f8074ebd7)
* [Axios Docs](https://github.com/axios/axios)
* [Article on Promises](https://gist.github.com/domenic/3889970)

## Backend Resources
[Database Schema](https://github.com/hack4impact-uiuc/kiva-pricing-tool/blob/master/api_docs.md)

**SQL Alchemy**
* What is SQL Alchemy?
    * SQL Alchemy is an Object Relational Mapper that allows you to access and manipulate the database with python.

**Jsonify** 
* Jsonify returns a flask response object that already has the appropriate content-type header 'application/json' for use with json responses

**JSON to SQL**
* [Article on JSON extensions for SQLAlchemy](https://www.compose.com/articles/using-json-extensions-in-postgresql-from-python-2/)

**XIRR Function**
* [Repo with XIRR function that we used for our calculations](https://github.com/peliot/XIRR-and-XNPV)

**Converting Info from Server to JSON**
* What is Serialization?
    * Serialization is the process of converting the state information of an object instance into a binary or textual form to persist into storage medium or transported over a network.
* Converting time into JSON
```python
    def datetime_to_string(value):
       if value is None:
           return None
       return [value.strftime("%Y-%m-%d"), value.strftime("%H:%M:%S")]
```
* Serializing for JSON
```python
    def serialize(self):
       return {
           'id': self.id,
           'modified_at': dump_datetime(self.modified_at),
           'objects'  : self.serialize_objects #when u have many-to-many relations
       }

    def serialize_objects(self):
       return [ item.serialize for item in self.objects]
       
    return jsonify(json_list=[i.serialize for i in qryresult.all()])
```

## Excel Sheet Calculation Differences
Our calculator functions differently, and more accurately, than the original excel tool that we based our implementation off of.

You can download the original APR tool we based our calculator off of [here](link here). The functionality our tool replicates is all under the "Pricing - Advanced" and "Rep Schedule - Advanced" sheets. We use the exact same inputs, but a few of our calculations are different. They are as following. 

* Repayment Schedule Editing
   * On the excel sheet, a user must enter manual mode and make changes on parallel columns
   * Our implementation allows a user to edit the table directly, which changes indicated by highlights

* Period 0
   * On the excel sheet, the initial period is labeled period 0
   * Our implementation instead labels the initial period "Disbursement Date"

* Security Deposit Interest Paid
   * On the excel sheet, if a balloon payment exists, the security deposit continues to accumulate interest, even though the loan has been paid off
   * Our calculations prevent interest from accumulating on the security deposit once the entire loan has been paid off
   
* Security Deposit Override
   * On the excel sheet, overriding the security deposit overrides both the security deposit and interest paid for that period
   * Our calculations will only override the security deposit column, and not affect the interest paid column
   
* Security Deposit Withdrawals
   * On the excel sheet, security deposit withdrawals are allocated to the last cashflow, even if a balloon payment occurs
   * Our calculations will lump the security deposit withdrawal with the final payment if a balloon payment occurs
   
   



