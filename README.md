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
* [Figma for Wireframes](https://www.figma.com/file/0jmf44vrazZ8C2vkTCwnroMF/Kiva)
* [Figma for Final Design]()

## Frontend Resources

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
[Database Schema](https://docs.google.com/document/d/1qriyM0TZ51yHTynVHcDXwpPW9GKJDdjv6Nk0JDInJho/edit?usp=sharing)





