curl -s -c cookie.txt -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d "{\"username\": \"user1\", \"password\": \"password1\"}"

{"message":"Customer successfully logged in"}
