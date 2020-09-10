const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const entryRouter = require('./routers/entry')
const paymentMethodRouter = require('./routers/paymentMethod')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(entryRouter)
app.use(paymentMethodRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})


// const Entry = require('./models/entry')
// const PaymentMethod = require('./models/paymentMethod')

// async function main () { 
    
//     // let paymentMethod = new PaymentMethod({
//     //     description: 'Teste'
//     // })

//     // await paymentMethod.save()


//     // let entry = new Entry({
//     //     description: 'Teste',
//     //     amount: 10.50,
//     //     type: 'Expense',
//     //     paymentMethod: paymentMethod._id,
//     // })

//     // await entry.save()

//     let entry = await Entry.findOne({_id: '5f594eaa21cb7d74b8cd7e43'})

//     await entry.populate('paymentMethod').execPopulate()

//     console.log(entry.paymentMethod.description)
// }

// main()