# Kiva Pricing Tool
An open source web application that outputs APR Nominal rate, Repayment Schedule, and Loan Payment Visualization.

## Product Resources
* [Product Requirements Document](https://docs.google.com/document/d/1Rw6Q8YMIpvYFXR3eStdTVT4iZXMpR7En3_yg677VgjE/edit?usp=sharing)
* [Specs] (https://docs.google.com/document/d/1zMf_uEDGpe6eoqfaJvVP6mnb-Vbvo_sfcE4FaL2NWB8/edit?usp=sharing)

## Design Resources
* [Figma for Mockups](https://www.figma.com/file/0jmf44vrazZ8C2vkTCwnroMF/Kiva)

## Backend Resources
* [Database Schema](https://github.com/hack4impact-uiuc/kiva-pricing-tool/blob/master/api_docs.md)
* [Repo with XIRR function that we used for our calculations](https://github.com/peliot/XIRR-and-XNPV)

## Excel Sheet Calculation Differences
Our calculator functions differently, and more accurately, than the original excel tool that we based our implementation off of.

You can download the original APR tool we based our calculator off of [here](/docs/APR_Excel_Tool.xlsm). The functionality our tool replicates is all under the "Pricing - Advanced" and "Rep Schedule - Advanced" sheets. We use the exact same inputs, but a few of our calculations are different. They are as following. 

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
   
* Cash Flows
    * On the excel sheet, there are cashflow indicators after each expense (interest, fees, taxes, security deposit)
    * Our implementation instead displays the overall final cash flows in each period once

## Our Workarounds
Over the course of the 3 months we had to build out this tool, we accumulated some technical debt which, with some additional resources and time, can be re-implemented with better practices.

* Endpoints
    * Admin Tools
        *

* Database entries
    * saving loans is not saving loans

* Repayment schedule matricies
    * 
  
