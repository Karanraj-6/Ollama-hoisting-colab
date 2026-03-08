const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.json())

let workerURL = null

app.post("/register-worker",(req,res)=>{
  if(!req.body || !req.body.url){
    return res.status(400).send("url missing")
  }

  workerURL = req.body.url
  console.log("Worker registered:", workerURL)
  res.send({status:"ok"})
})

app.post("/generate", async (req,res)=>{
  if(!workerURL){
    return res.status(503).send("No worker available")
  }

  try{
    const r = await axios.post(
      workerURL + "/api/generate",
      req.body
    )
    res.send(r.data)
  }catch(e){
    workerURL = null
    res.status(500).send("Worker offline")
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log("Gateway running"))