import datetime
from calendar import monthrange
import calendar
import numpy as np
#######
#For generate origin repayment schedule date and days columns
#######

start_day = 1
start_month = 1
start_year = 2012
num_installment = 12
installment_time_period = 'months'

change_col_idx = 1
change_row_idx = 2
change_val = 100
modify_days = change_col_idx == 1
modify_date = change_col_idx == 2

days_dict = {'days':1, 'weeks':7, 'two-weeks':14, '15 days':15, '4 weeks': 28}
month_num_to_str_dict = {1:'Jan', 2: 'Feb', 3: 'Mar', 4:'Apr', 5:'May', 6:'Jun', 7:'Jul', 8:'Aug', 9:'Sep', 10:'Oct', 11:'Nov', 12:'Dec'}
#  represent days in datetime objects
def get_num_days(period, prev_date):
    if period == 'months':
        return monthrange(prev_date.year, prev_date.month)[1]
    elif period == 'quarters':
        days_aggreg = 0
        for idx in range(3):
            days_aggreg += monthrange(prev_date.year, prev_date.month)[1]
            # update the prev_date forward by one month
            prev_date += datetime.timedelta(days=get_num_days('months', prev_date))
        return days_aggreg
    elif period == 'half-years':
        days_aggreg = 0
        for idx in range(6):
            days_aggreg += monthrange(prev_date.year, prev_date.month)[1]
            # update the prev_date forward by one month
            prev_date += datetime.timedelta(days=get_num_days('months', prev_date))
        return days_aggreg

    elif period == 'years':
        if calendar.isleap(prev_date.year):
            return 366
        else:
            return 365
    else:
        return days_dict[period]

def calc_origin_days(day, month, year, installment_time_period, num_installment):
    date_arr = []
    day_num_arr = []
    start_date = datetime.datetime(year=year, month=month, day=day)
    prev_date = start_date
    day_num_arr.append(0)
    start_date_str = '{0}-{1}-{2}'.format(start_date.day, month_num_to_str_dict[start_date.month], start_date.year)
    date_arr.append(start_date_str)

    for idx in range(num_installment):
        days_to_incre = get_num_days(installment_time_period, prev_date)
        new_date = prev_date + datetime.timedelta(days=days_to_incre)
        new_date_str = '{0}-{1}-{2}'.format(new_date.day, month_num_to_str_dict[new_date.month], new_date.year)
        date_arr.append(new_date_str)
        day_num_arr.append(days_to_incre)
        prev_date = new_date
    return date_arr, day_num_arr

date_arr, day_num_arr = calc_origin_days(start_day, start_month, start_year, installment_time_period, num_installment)
for idx in range(len(date_arr)):
    print ('{0}   {1}'.format(date_arr[idx], day_num_arr[idx]))

# TODO: save/update the origin matrix with correct version number


#######
#For repayment schedule date and days on change
#######

def on_change_day(input_date_arr, input_day_arr, change_row_idx, change_val, prev_changes):
    new_date_arr = []
    new_day_num_arr = []
    prev_changes[change_row_idx] = change_val
    date_col = input_date_arr
    day_col = input_day_arr
    print (input_day_arr)
    start_date = datetime.datetime.strptime(date_col[0], '%d-%b-%Y')
    prev_date = start_date
    new_date_arr.append(date_col[0])
    new_day_num_arr.append(0)
    for idx in range(1,len(date_col)):
        if prev_changes[idx] != None:
            days_to_incre = prev_changes[idx]
        else:
            days_to_incre = get_num_days(installment_time_period, prev_date)
            
        new_date = prev_date + datetime.timedelta(days=days_to_incre)
        new_date_str = '{0}-{1}-{2}'.format(new_date.day, month_num_to_str_dict[new_date.month], new_date.year)
        new_date_arr.append(new_date_str)
        new_day_num_arr.append(days_to_incre)
        prev_date = new_date

    return new_date_arr, new_day_num_arr


prev_changes = np.zeros(len(date_arr), dtype=object)
for idx in range(len(prev_changes)):
    prev_changes[idx] = None
    
# if modify_days:
new_date_arr, new_day_num_arr = on_change_day(date_arr, day_num_arr, 1, 100, prev_changes)
prev_changes[1] = 100
# TODO save the updated user change matrix to database

print ("#"*10+"after change")
for idx in range(len(new_date_arr)):
    print ('{0}   {1}'.format(new_date_arr[idx], new_day_num_arr[idx]))


# print (new_date_arr)
new_date_arr, new_day_num_arr = on_change_day(new_date_arr, new_day_num_arr, 4, 100, prev_changes)
prev_changes[4] = 100

print ("#"*10+"after change")
for idx in range(len(new_date_arr)):
    print ('{0}   {1}'.format(new_date_arr[idx], new_day_num_arr[idx]))


