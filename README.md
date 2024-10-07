# styl

### About
Styl is an application using AI based recommendations to provide clothing choises across various sites.

It uses Gemini LLM with vision and custom designed prompts to suggest styles which are then searched over the internet via Programmatic search API on select sites.

It is a powerful way to buy the best clothes.

# Demo
https://github.com/user-attachments/assets/773f8e73-8664-45a4-bf9c-7688d7335012


# How to install

```
git clone https://github.com/bhargavyagnik/styl.git
cd styl
```


Commands to run frontend 

```jsx
cd styl/frontend
npm run dev
```

Command to run backend
```
cd styl/backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
### Docker
```
cd styl/
docker compose up -d
```
