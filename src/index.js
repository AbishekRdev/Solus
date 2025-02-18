import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";
const port=process.env.PORT || 8000

connectDB()
  .then(()=>{
    app.listen(port,()=>{
        console.log(`APP listening to   port ${port}`);
    })
    
  })
  .catch((err) => {
    console.log("Mongo DB connection failed !!! ", err);
  });
