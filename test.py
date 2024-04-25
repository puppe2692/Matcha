import math

def calculate_score(distance):
    # You can adjust the parameters of the function to fit your specific needs# Adjust this to control the scale of the score

    # Exponential function to slow down the decrease at first
    exponential_part = 1 / math.exp(distance / 1000)

    # Logarithmic function to increase the decrease as distance increases

    # Combine the two functions to get the final score
    score = exponential_part
    return score


for i in range(1, 101):
    print(i, calculate_score(i))