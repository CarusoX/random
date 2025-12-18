start = 1
end = 999
while start <= end:
  med = (start + end) // 2
  print(f"¿Es {med} el número?")
  answer = input()
  if answer == "+":
    start = med + 1
  elif answer == "-":
    end = med - 1
  else:
    print(f"El número es {med}")
    break