import numpy as np

def on_principal_change(origin_matrix, all_changes_on_principal, num_balloon):
    aggreg = 0
    # populate the previous changes except the last row
    for idx in range(len(origin_matrix)-num_balloon-1):
        #  amount the override exceeds the origin_matrix value
        if prev_changes[idx] != None:
            aggreg += all_changes_on_principal[idx] - origin_matrix[idx]
            origin_matrix[idx] = all_changes_on_principal[idx]
    
    if all_changes_on_principal[-1-num_balloon] != None:
        origin_matrix[][-1-num_balloon] = all_changes_on_principal[-1-num_balloon]
    else:
        origin_matrix[-1-num_balloon] -= aggreg

    return origin_matrix