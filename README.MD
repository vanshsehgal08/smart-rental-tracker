# Setup Commands

## Frontend (Next.js + TypeScript + Tailwind + Shadcn/UI + Recharts + Axios + Framer Motion)
```
cd frontend
npx create-next-app@latest . --ts
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install shadcn-ui recharts chart.js axios framer-motion
```
### (Optional) Initialize Shadcn/UI
```
npx shadcn-ui@latest init
```

## Backend (FastAPI)
```
cd backend/app
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy pydantic
```

## ML (Optional)
```
cd ../../ml
pip install pandas scikit-learn prophet
```
